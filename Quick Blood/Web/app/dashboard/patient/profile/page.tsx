"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Droplets, PlusCircle, CheckCircle2, Clock, MapPin,
  Phone, Mail, Shield, LogOut, ChevronRight, Camera, Edit3, Bell, User,
} from "lucide-react"
import type { QBSession } from "../../layout"

const MOCK_STATS = { total: 3, fulfilled: 2, active: 1 }
const SAVED_HOSPITALS = [
  { name: "Apollo Hospital",  area: "Andheri, Mumbai"    },
  { name: "Lilavati Hospital",area: "Bandra, Mumbai"     },
]

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

function SettingRow({ icon: Icon, label, sub, danger, onClick }: {
  icon: React.ElementType; label: string; sub?: string; danger?: boolean; onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 py-3 border-b border-gray-100 last:border-0 text-left hover:bg-gray-50 -mx-1 px-1 rounded-xl transition-colors"
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${danger ? "bg-red-50" : "bg-gray-100"}`}>
        <Icon className={`h-4 w-4 ${danger ? "text-red-500" : "text-gray-500"}`} />
      </div>
      <div className="flex-1">
        <p className={`text-sm font-semibold ${danger ? "text-red-600" : "text-gray-900"}`}>{label}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
      <ChevronRight className="h-4 w-4 text-gray-300 shrink-0" />
    </button>
  )
}

export default function PatientProfile() {
  const router  = useRouter()
  const [session, setSession] = useState<QBSession | null>(null)
  const [notifOn, setNotifOn] = useState(true)

  useEffect(() => {
    const raw = localStorage.getItem("qb_session")
    if (!raw) return
    setSession(JSON.parse(raw) as QBSession)
  }, [])

  function logout() {
    localStorage.removeItem("qb_session")
    router.push("/auth/login")
  }

  if (!session) return null

  const initials = session.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()

  return (
    <div className="max-w-lg mx-auto space-y-5">

      {/* Avatar + name */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
              {initials}
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
              <Camera className="h-3 w-3 text-white" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-gray-900 truncate">{session.name}</p>
              <button><Edit3 className="h-4 w-4 text-gray-400 hover:text-gray-600 shrink-0" /></button>
            </div>
            <p className="text-sm text-gray-500">{session.email}</p>
            <span className="inline-block mt-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Patient
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: PlusCircle,  label: "Requests",  value: String(MOCK_STATS.total),     sub: "total raised",   color: "text-blue-600",   bg: "bg-blue-50"   },
          { icon: CheckCircle2,label: "Fulfilled",  value: String(MOCK_STATS.fulfilled), sub: "completed",      color: "text-green-600",  bg: "bg-green-50"  },
          { icon: Clock,       label: "Active",     value: String(MOCK_STATS.active),    sub: "in progress",    color: "text-amber-600",  bg: "bg-amber-50"  },
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

      {/* Personal info */}
      <div className="bg-white rounded-2xl border border-gray-100 px-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide pt-4 pb-2">Personal info</p>
        <Row icon={User}    label="Full name"    value={session.name} />
        <Row icon={Mail}    label="Email"        value={session.email} />
        <Row icon={Phone}   label="Phone"        value="+91 98765 43210" />
        <Row icon={Droplets}label="Blood group"  value={session.bloodGroup} sub="Your blood type on record" />
        <Row icon={MapPin}  label="City"         value="Mumbai, Maharashtra" />
        <div className="pb-2" />
      </div>

      {/* Saved hospitals */}
      <div className="bg-white rounded-2xl border border-gray-100 px-4">
        <div className="flex items-center justify-between pt-4 pb-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Saved Hospitals</p>
          <button className="text-xs font-semibold text-blue-600 hover:underline">+ Add</button>
        </div>
        {SAVED_HOSPITALS.map(h => (
          <div key={h.name} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <MapPin className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{h.name}</p>
              <p className="text-xs text-gray-400">{h.area}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-300 shrink-0" />
          </div>
        ))}
        <div className="pb-2" />
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-2xl border border-gray-100 px-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide pt-4 pb-2">Preferences</p>
        <div className="flex items-center gap-3 py-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
            <Bell className="h-4 w-4 text-gray-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">Push notifications</p>
            <p className="text-xs text-gray-400">{notifOn ? "Donor responses & status updates" : "Disabled"}</p>
          </div>
          <button
            onClick={() => setNotifOn(v => !v)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-300 shrink-0 ${notifOn ? "bg-blue-500" : "bg-gray-300"}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${notifOn ? "left-5" : "left-0.5"}`} />
          </button>
        </div>
        <SettingRow icon={Shield} label="Privacy & data" sub="Manage what you share" />
        <div className="pb-2" />
      </div>

      {/* Account */}
      <div className="bg-white rounded-2xl border border-gray-100 px-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide pt-4 pb-2">Account</p>
        <SettingRow icon={Shield} label="Change password" />
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 py-3 text-left hover:bg-red-50 -mx-1 px-1 rounded-xl transition-colors"
        >
          <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <LogOut className="h-4 w-4 text-red-500" />
          </div>
          <p className="text-sm font-semibold text-red-600">Log out</p>
        </button>
        <div className="pb-2" />
      </div>

    </div>
  )
}
