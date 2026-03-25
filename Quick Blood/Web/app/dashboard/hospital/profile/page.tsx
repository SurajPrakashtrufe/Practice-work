"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Droplets, CheckCircle2, Activity, Users, MapPin, Phone,
  Mail, Globe, Shield, LogOut, ChevronRight, Camera, Bell,
  Building, BadgeCheck, Clock,
} from "lucide-react"
import type { QBSession } from "../../layout"

const MOCK_STATS = { totalRequests: 28, fulfilled: 24, activeDonors: 142, avgResponseMin: 18 }

const HOSPITAL_INFO = {
  regNumber:   "MH-2019-HOS-4421",
  type:        "Multi-Specialty",
  nabh:        true,
  year:        "2019",
  address:     "Plot 14, Andheri East, Mumbai, Maharashtra 400069",
  phone:       "+91 22 6789 0000",
  emergency:   "+91 22 6789 0001",
  email:       "admin@apollo-andheri.com",
  website:     "www.apollohospitals.com",
  inCharge:    "Dr. Rajesh Kumar",
  beds:        320,
  hasBloodBank:true,
}

function Row({ icon: Icon, label, value, sub, verified }: {
  icon: React.ElementType; label: string; value: string; sub?: string; verified?: boolean
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="h-4 w-4 text-gray-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold text-gray-900">{value}</p>
          {verified && <BadgeCheck className="h-4 w-4 text-green-600 shrink-0" />}
        </div>
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

export default function HospitalProfile() {
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

      {/* Hospital card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-green-700 flex items-center justify-center text-white text-xl font-bold">
              {initials}
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
              <Camera className="h-3 w-3 text-white" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-gray-900 truncate">{session.name}</p>
              <BadgeCheck className="h-5 w-5 text-green-600 shrink-0" title="Verified" />
            </div>
            <p className="text-sm text-gray-500">{session.email}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">{HOSPITAL_INFO.type}</span>
              {HOSPITAL_INFO.nabh && (
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">NABH Accredited</span>
              )}
              {HOSPITAL_INFO.hasBloodBank && (
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Blood Bank</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Droplets,    label: "Requests",     value: String(MOCK_STATS.totalRequests), sub: "total posted",      color: "text-green-700",  bg: "bg-green-50"  },
          { icon: CheckCircle2,label: "Fulfilled",    value: String(MOCK_STATS.fulfilled),     sub: `${Math.round(MOCK_STATS.fulfilled/MOCK_STATS.totalRequests*100)}% success rate`, color: "text-blue-600", bg: "bg-blue-50" },
          { icon: Users,       label: "Pool donors",  value: String(MOCK_STATS.activeDonors),  sub: "compatible nearby", color: "text-purple-600", bg: "bg-purple-50" },
          { icon: Clock,       label: "Avg response", value: `${MOCK_STATS.avgResponseMin}m`,  sub: "donor response time",color: "text-amber-600",  bg: "bg-amber-50"  },
        ].map(({ icon: Icon, label, value, sub, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 space-y-2">
            <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
              <p className={`text-xl font-bold ${color}`}>{value}</p>
              <p className="text-[10px] text-gray-400">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Hospital info */}
      <div className="bg-white rounded-2xl border border-gray-100 px-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide pt-4 pb-2">Hospital details</p>
        <Row icon={Building} label="Registration number" value={HOSPITAL_INFO.regNumber} verified />
        <Row icon={Activity} label="Type"                value={HOSPITAL_INFO.type} sub={`Est. ${HOSPITAL_INFO.year}`} />
        <Row icon={MapPin}   label="Address"             value={HOSPITAL_INFO.address} />
        <Row icon={Users}    label="Bed capacity"        value={String(HOSPITAL_INFO.beds)} sub="Total beds" />
        <div className="pb-2" />
      </div>

      {/* Contact */}
      <div className="bg-white rounded-2xl border border-gray-100 px-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide pt-4 pb-2">Contact</p>
        <Row icon={Phone}  label="Primary"         value={HOSPITAL_INFO.phone} />
        <Row icon={Phone}  label="Emergency (24×7)" value={HOSPITAL_INFO.emergency} />
        <Row icon={Mail}   label="Email"            value={HOSPITAL_INFO.email} />
        <Row icon={Globe}  label="Website"          value={HOSPITAL_INFO.website} />
        <Row icon={Users}  label="Blood bank in-charge" value={HOSPITAL_INFO.inCharge} />
        <div className="pb-2" />
      </div>

      {/* Manager info */}
      <div className="bg-white rounded-2xl border border-gray-100 px-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide pt-4 pb-2">Account manager</p>
        <Row icon={Users} label="Name"  value={session.name} />
        <Row icon={Mail}  label="Email" value={session.email} />
        <Row icon={Phone} label="Phone" value="+91 98765 43210" />
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
            <p className="text-sm font-semibold text-gray-900">Donor alerts</p>
            <p className="text-xs text-gray-400">{notifOn ? "Receive alerts when donors respond" : "Disabled"}</p>
          </div>
          <button
            onClick={() => setNotifOn(v => !v)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-300 shrink-0 ${notifOn ? "bg-green-600" : "bg-gray-300"}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${notifOn ? "left-5" : "left-0.5"}`} />
          </button>
        </div>
        <SettingRow icon={Shield} label="Privacy & data" sub="Manage data shared with donors" />
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
