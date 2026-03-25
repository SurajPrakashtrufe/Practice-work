"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Zap, CheckCircle2, Clock, Droplets, Bell, BellOff,
  AlertTriangle, Heart, RefreshCw, ChevronRight,
} from "lucide-react"
import type { QBSession } from "../layout"

// ── Notification types ────────────────────────────────────────────────────────

type NotifType =
  | "new_request"
  | "donor_responded"
  | "donor_confirmed"
  | "request_fulfilled"
  | "cooldown_ended"
  | "low_stock"
  | "availability_reminder"
  | "request_cancelled"

interface Notification {
  id: string
  type: NotifType
  title: string
  body: string
  time: string
  read: boolean
  href?: string
  urgency?: "high" | "medium" | "low"
}

// ── Mock notifications per role ───────────────────────────────────────────────

const NOTIFICATIONS: Record<string, Notification[]> = {
  donor: [
    {
      id: "n1", type: "new_request", read: false, urgency: "high",
      title: "Urgent: B+ blood needed near you",
      body: "Apollo Hospital, Andheri needs 2 units of B+ blood. 1.2 km away.",
      time: "5 min ago", href: "/dashboard/donor/requests",
    },
    {
      id: "n2", type: "new_request", read: false, urgency: "high",
      title: "Urgent: O- blood needed — you're a universal donor",
      body: "Lilavati Hospital, Bandra needs 1 unit urgently. 3.4 km away.",
      time: "20 min ago", href: "/dashboard/donor/requests",
    },
    {
      id: "n3", type: "cooldown_ended", read: false, urgency: "low",
      title: "You're eligible to donate again!",
      body: "90 days have passed since your last donation. You can now donate blood.",
      time: "2 hrs ago", href: "/dashboard/donor",
    },
    {
      id: "n4", type: "availability_reminder", read: true, urgency: "low",
      title: "Reminder: Are you still available?",
      body: "You've been marked available for 7 days. Let us know if anything changed.",
      time: "Yesterday", href: "/dashboard/donor",
    },
    {
      id: "n5", type: "new_request", read: true, urgency: "medium",
      title: "Scheduled: A+ needed in 3 days",
      body: "Kokilaben Hospital, Versova needs 1 unit on 28 Mar. 6.8 km away.",
      time: "2 days ago", href: "/dashboard/donor/requests",
    },
    {
      id: "n6", type: "request_fulfilled", read: true, urgency: "low",
      title: "Thank you for your response!",
      body: "The request at KEM Hospital has been fulfilled. Your contribution matters.",
      time: "5 days ago",
    },
  ],
  patient: [
    {
      id: "n1", type: "donor_responded", read: false, urgency: "high",
      title: "3 donors responded to your request",
      body: "3 compatible B+ donors near Apollo Hospital want to help. View and confirm one.",
      time: "2 min ago", href: "/dashboard/patient/requests/1",
    },
    {
      id: "n2", type: "donor_responded", read: false, urgency: "medium",
      title: "New donor available for your request",
      body: "A B- donor (0.8 km away) just responded to your Andheri request.",
      time: "8 min ago", href: "/dashboard/patient/requests/1",
    },
    {
      id: "n3", type: "donor_confirmed", read: true, urgency: "low",
      title: "Donor confirmed for request #2",
      body: "Arjun S. has been confirmed for your A+ request at Lilavati Hospital.",
      time: "1 hr ago", href: "/dashboard/patient/requests/2",
    },
    {
      id: "n4", type: "request_fulfilled", read: true, urgency: "low",
      title: "Request fulfilled successfully",
      body: "Your March 12 request at Hinduja Hospital was marked fulfilled. Thank you.",
      time: "13 Mar 2025",
    },
  ],
  hospital: [
    {
      id: "n1", type: "low_stock", read: false, urgency: "high",
      title: "Critical: AB- stock at 0 units",
      body: "Your AB- inventory has run out. Post a donor request immediately.",
      time: "Just now", href: "/dashboard/hospital/request/new",
    },
    {
      id: "n2", type: "donor_responded", read: false, urgency: "high",
      title: "4 donors responded to urgent B+ request",
      body: "Patient: Rahul M. — 4 donors are ready. Confirm one to proceed.",
      time: "5 min ago", href: "/dashboard/hospital",
    },
    {
      id: "n3", type: "low_stock", read: false, urgency: "medium",
      title: "Low stock: B- at 1 unit",
      body: "Your B- supply is critically low. Consider posting a request or reaching out to donors.",
      time: "30 min ago", href: "/dashboard/hospital/inventory",
    },
    {
      id: "n4", type: "donor_confirmed", read: true, urgency: "low",
      title: "Donor confirmed for Sneha K.'s request",
      body: "Meera K. (O-) has been confirmed for the urgent request at Ward 3.",
      time: "1 hr ago",
    },
    {
      id: "n5", type: "request_fulfilled", read: true, urgency: "low",
      title: "Request fulfilled — inventory updated",
      body: "2 units of O+ received for Vikram P.'s request. Blood bank updated.",
      time: "3 hrs ago",
    },
  ],
}

// ── Icon & color config ───────────────────────────────────────────────────────

const TYPE_CONFIG: Record<NotifType, { icon: React.ElementType; color: string; bg: string }> = {
  new_request:          { icon: Droplets,    color: "text-red-600",    bg: "bg-red-100"    },
  donor_responded:      { icon: Heart,       color: "text-pink-600",   bg: "bg-pink-100"   },
  donor_confirmed:      { icon: CheckCircle2,color: "text-green-600",  bg: "bg-green-100"  },
  request_fulfilled:    { icon: CheckCircle2,color: "text-green-600",  bg: "bg-green-100"  },
  cooldown_ended:       { icon: RefreshCw,   color: "text-blue-600",   bg: "bg-blue-100"   },
  low_stock:            { icon: AlertTriangle,color: "text-amber-600", bg: "bg-amber-100"  },
  availability_reminder:{ icon: Bell,        color: "text-purple-600", bg: "bg-purple-100" },
  request_cancelled:    { icon: BellOff,     color: "text-gray-500",   bg: "bg-gray-100"   },
}

const URGENCY_DOT: Record<string, string> = {
  high:   "bg-red-500",
  medium: "bg-amber-400",
  low:    "bg-gray-300",
}

const ROLE_ACCENT: Record<string, string> = {
  donor:    "text-red-600",
  patient:  "text-blue-600",
  hospital: "text-green-700",
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const [session, setSession]         = useState<QBSession | null>(null)
  const [readIds, setReadIds]         = useState<Set<string>>(new Set())
  const [filter, setFilter]           = useState<"all" | "unread">("all")

  useEffect(() => {
    const raw = localStorage.getItem("qb_session")
    if (!raw) return
    setSession(JSON.parse(raw) as QBSession)
  }, [])

  if (!session) return null

  const notifs   = NOTIFICATIONS[session.role] ?? []
  const accent   = ROLE_ACCENT[session.role]

  function isRead(n: Notification) {
    return n.read || readIds.has(n.id)
  }

  function markRead(id: string) {
    setReadIds(prev => new Set([...prev, id]))
  }

  function markAllRead() {
    setReadIds(new Set(notifs.map(n => n.id)))
  }

  const unreadCount = notifs.filter(n => !isRead(n)).length

  const visible = filter === "unread"
    ? notifs.filter(n => !isRead(n))
    : notifs

  // Group by time bucket
  const today   = visible.filter(n => ["Just now","just now","5 min ago","2 min ago","8 min ago","20 min ago","30 min ago","10 min ago","1 hr ago","2 hrs ago","3 hrs ago","5 hrs ago"].some(t => n.time.includes(t.split(" ")[0]) || n.time === t))
  const earlier = visible.filter(n => !today.includes(n))

  function NotifCard({ n }: { n: Notification }) {
    const cfg  = TYPE_CONFIG[n.type]
    const Icon = cfg.icon
    const read = isRead(n)

    const inner = (
      <div
        onClick={() => markRead(n.id)}
        className={`flex items-start gap-3 p-4 rounded-2xl border transition-colors cursor-pointer
          ${read
            ? "bg-white border-gray-100 hover:border-gray-200"
            : "bg-blue-50/50 border-blue-100 hover:border-blue-200"}`}
      >
        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}>
          <Icon className={`h-5 w-5 ${cfg.color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <p className={`text-sm font-semibold leading-snug ${read ? "text-gray-700" : "text-gray-900"}`}>
              {n.title}
            </p>
            {!read && n.urgency && (
              <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${URGENCY_DOT[n.urgency]}`} />
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.body}</p>
          <p className="text-[10px] text-gray-400 mt-1.5 flex items-center gap-1">
            <Clock className="h-3 w-3" />{n.time}
          </p>
        </div>

        {/* Chevron for linked items */}
        {n.href && <ChevronRight className="h-4 w-4 text-gray-300 shrink-0 mt-0.5" />}
      </div>
    )

    return n.href ? (
      <Link href={n.href} className="block">{inner}</Link>
    ) : (
      <div>{inner}</div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className={`text-xs font-semibold ${accent} hover:underline shrink-0 mt-1`}
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
        {(["all", "unread"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors capitalize
              ${filter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {f === "unread" ? `Unread (${unreadCount})` : `All (${notifs.length})`}
          </button>
        ))}
      </div>

      {/* Notification groups */}
      {visible.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
            <BellOff className="h-7 w-7 text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-600">No unread notifications</p>
          <p className="text-xs text-gray-400">Switch to "All" to see past notifications.</p>
        </div>
      ) : (
        <>
          {today.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide px-1">Today</p>
              {today.map(n => <NotifCard key={n.id} n={n} />)}
            </div>
          )}
          {earlier.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide px-1">Earlier</p>
              {earlier.map(n => <NotifCard key={n.id} n={n} />)}
            </div>
          )}
        </>
      )}

      {/* Notification settings hint */}
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3">
        <Bell className="h-4 w-4 text-gray-400 shrink-0" />
        <p className="text-xs text-gray-500">
          Push notifications are delivered based on your permission settings.
          <span className={`ml-1 font-semibold ${accent}`}>Manage in profile.</span>
        </p>
      </div>

    </div>
  )
}
