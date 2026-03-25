"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Droplets, Heart, TrendingUp, Award, BadgeCheck, BadgeX,
  Bell, MapPin, Phone, Mail, Shield, LogOut, ChevronRight,
  Edit3, Camera,
} from "lucide-react"
import type { QBSession } from "../../layout"

function addDays(d: Date, n: number) {
  const r = new Date(d); r.setDate(r.getDate() + n); return r
}
function formatDate(d: Date) {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

const LAST_DONATION  = new Date("2026-01-10")
const TOTAL_DONATED  = 3
const SCORE          = 60

const BLOOD_COMPAT: Record<string, string[]> = {
  "O-":  ["O-","O+","A-","A+","B-","B+","AB-","AB+"],
  "O+":  ["O+","A+","B+","AB+"],
  "A-":  ["A-","A+","AB-","AB+"],
  "A+":  ["A+","AB+"],
  "B-":  ["B-","B+","AB-","AB+"],
  "B+":  ["B+","AB+"],
  "AB-": ["AB-","AB+"],
  "AB+": ["AB+"],
}

function Row({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-gray-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-900 truncate">{value}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  )
}

function SettingRow({ icon: Icon, label, sub, danger, onClick, trailing }: {
  icon: React.ElementType; label: string; sub?: string; danger?: boolean
  onClick?: () => void; trailing?: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 py-3 border-b border-gray-100 last:border-0 text-left hover:bg-gray-50 -mx-1 px-1 rounded-xl transition-colors"
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${danger ? "bg-red-50" : "bg-gray-100"}`}>
        <Icon className={`h-4 w-4 ${danger ? "text-red-500" : "text-gray-500"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${danger ? "text-red-600" : "text-gray-900"}`}>{label}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
      {trailing ?? <ChevronRight className="h-4 w-4 text-gray-300 shrink-0" />}
    </button>
  )
}

export default function DonorProfile() {
  const router   = useRouter()
  const [session, setSession]       = useState<QBSession | null>(null)
  const [available, setAvailable]   = useState(true)
  const [toggling, setToggling]     = useState(false)
  const [notifOn, setNotifOn]       = useState(true)

  useEffect(() => {
    const raw = localStorage.getItem("qb_session")
    if (!raw) return
    const s = JSON.parse(raw) as QBSession
    setSession(s)
    setAvailable(s.isAvailable)
  }, [])

  function toggleAvail() {
    if (toggling) return
    setToggling(true)
    setTimeout(() => {
      const next = !available
      setAvailable(next)
      const raw = localStorage.getItem("qb_session")
      if (raw) {
        const s = JSON.parse(raw) as QBSession
        localStorage.setItem("qb_session", JSON.stringify({ ...s, isAvailable: next }))
      }
      setToggling(false)
    }, 500)
  }

  function logout() {
    localStorage.removeItem("qb_session")
    router.push("/auth/login")
  }

  if (!session) return null

  const initials     = session.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
  const nextEligible = addDays(LAST_DONATION, 90)
  const canDonate    = new Date() >= nextEligible
  const compatible   = BLOOD_COMPAT[session.bloodGroup] ?? []

  const scoreTier =
    SCORE >= 80 ? { label: "Gold Donor",   color: "text-amber-500", bar: "bg-amber-400" } :
    SCORE >= 40 ? { label: "Silver Donor", color: "text-gray-500",  bar: "bg-gray-400"  } :
                  { label: "New Donor",    color: "text-blue-500",  bar: "bg-blue-400"  }

  return (
    <div className="max-w-lg mx-auto space-y-5">

      {/* Avatar + name */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white text-xl font-bold">
              {initials}
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
              <Camera className="h-3 w-3 text-white" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-gray-900 truncate">{session.name}</p>
              <button className="shrink-0"><Edit3 className="h-4 w-4 text-gray-400 hover:text-gray-600" /></button>
            </div>
            <p className="text-sm text-gray-500">{session.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                {session.bloodGroup}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${scoreTier.color} bg-gray-100`}>
                {scoreTier.label}
              </span>
            </div>
          </div>
        </div>

        {/* Availability toggle */}
        <div className={`mt-4 flex items-center justify-between rounded-xl px-3 py-2.5 ${available && canDonate ? "bg-green-50 border border-green-200" : "bg-gray-100 border border-gray-200"}`}>
          <div className="flex items-center gap-2">
            {available && canDonate
              ? <BadgeCheck className="h-4 w-4 text-green-600" />
              : <BadgeX className="h-4 w-4 text-gray-400" />}
            <div>
              <p className={`text-sm font-semibold ${available && canDonate ? "text-green-700" : "text-gray-600"}`}>
                {available && canDonate ? "Available to donate" : !canDonate ? "In cooldown" : "Marked unavailable"}
              </p>
              <p className="text-[10px] text-gray-400">
                {canDonate ? "Toggle off if you can't donate right now" : `Eligible from ${formatDate(nextEligible)}`}
              </p>
            </div>
          </div>
          {canDonate && (
            <button
              onClick={toggleAvail}
              disabled={toggling}
              className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none shrink-0
                ${available ? "bg-green-500" : "bg-gray-300"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300
                ${available ? "left-5" : "left-0.5"}`} />
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Heart,     label: "Donated",    value: String(TOTAL_DONATED), sub: "times", color: "text-red-600",    bg: "bg-red-50"    },
          { icon: Droplets,  label: "Groups",     value: String(compatible.length), sub: "compatible", color: "text-blue-600", bg: "bg-blue-50" },
          { icon: Award,     label: "Lives",      value: `${TOTAL_DONATED * 3}+`, sub: "helped",  color: "text-purple-600", bg: "bg-purple-50" },
        ].map(({ icon: Icon, label, value, sub, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-3 border border-gray-100 space-y-2">
            <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
              <p className={`text-base font-bold ${color}`}>{value}</p>
              <p className="text-[10px] text-gray-400">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Reliability score */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-amber-500" />
            <p className="text-sm font-semibold text-gray-900">Reliability Score</p>
          </div>
          <span className={`text-sm font-bold ${scoreTier.color}`}>{SCORE}/100</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full ${scoreTier.bar} rounded-full`} style={{ width: `${SCORE}%` }} />
        </div>
        <p className="text-xs text-gray-400">
          {SCORE < 100
            ? `${Math.ceil((100 - SCORE) / 20)} more donation${Math.ceil((100 - SCORE) / 20) !== 1 ? "s" : ""} to reach Gold tier`
            : "Top tier achieved!"}
        </p>
      </div>

      {/* Personal info */}
      <div className="bg-white rounded-2xl border border-gray-100 px-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide pt-4 pb-2">Personal info</p>
        <Row icon={Mail}    label="Email"       value={session.email} />
        <Row icon={Phone}   label="Phone"       value="+91 98765 43210" />
        <Row icon={Droplets}label="Blood group" value={session.bloodGroup} sub={`Can donate to ${compatible.length} groups`} />
        <Row icon={MapPin}  label="Location"    value="Andheri, Mumbai" sub="Used for nearby request matching" />
        <div className="pb-2" />
      </div>

      {/* Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 px-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide pt-4 pb-2">Preferences</p>
        <SettingRow
          icon={Bell} label="Push notifications"
          sub={notifOn ? "Enabled — you'll be notified of nearby requests" : "Disabled"}
          trailing={
            <button
              onClick={() => setNotifOn(v => !v)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-300 shrink-0
                ${notifOn ? "bg-red-500" : "bg-gray-300"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300
                ${notifOn ? "left-5" : "left-0.5"}`} />
            </button>
          }
        />
        <SettingRow icon={MapPin}  label="Location sharing" sub="Shared for request matching — Andheri, Mumbai" />
        <SettingRow icon={Shield}  label="Privacy & data"   sub="Manage what you share with hospitals and patients" />
        <div className="pb-2" />
      </div>

      {/* Account */}
      <div className="bg-white rounded-2xl border border-gray-100 px-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide pt-4 pb-2">Account</p>
        <SettingRow icon={Shield} label="Change password" />
        <SettingRow icon={LogOut} label="Log out" danger onClick={logout} trailing={null} />
        <div className="pb-2" />
      </div>

    </div>
  )
}
