"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Zap, MapPin, Droplets, Phone, CheckCircle2,
  Users, Timer, ChevronRight, AlertTriangle, RefreshCw,
} from "lucide-react"
import type { QBSession } from "../layout"

// ── Blood compatibility ───────────────────────────────────────────────────────
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
const BLOOD_GROUPS = ["A+","A-","B+","B-","AB+","AB-","O+","O-"]

// ── SOS states ────────────────────────────────────────────────────────────────
type SosState = "idle" | "broadcasting" | "live"

interface LiveData {
  notified: number
  responded: number
  radius: number
  elapsedSec: number
}

// ── Nearby blood banks ────────────────────────────────────────────────────────
const BLOOD_BANKS = [
  { name: "Apollo Blood Bank",     area: "Andheri, Mumbai",    phone: "+91 22 6789 0001", distanceKm: 1.2, stock: true  },
  { name: "KEM Blood Bank",        area: "Parel, Mumbai",      phone: "+91 22 4152 0000", distanceKm: 3.8, stock: true  },
  { name: "Hinduja Blood Bank",    area: "Mahim, Mumbai",      phone: "+91 22 2444 9199", distanceKm: 4.0, stock: false },
  { name: "Lilavati Blood Bank",   area: "Bandra, Mumbai",     phone: "+91 22 2675 1000", distanceKm: 5.1, stock: true  },
]

export default function SosPage() {
  const router  = useRouter()
  const [session, setSession]     = useState<QBSession | null>(null)
  const [sosState, setSosState]   = useState<SosState>("idle")
  const [bloodGroup, setBloodGroup] = useState("")
  const [units, setUnits]         = useState("2")
  const [hospital, setHospital]   = useState("")
  const [live, setLive]           = useState<LiveData>({ notified: 0, responded: 0, radius: 5, elapsedSec: 0 })
  const [cancelled, setCancelled] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem("qb_session")
    if (!raw) return
    const s = JSON.parse(raw) as QBSession
    setSession(s)
    setBloodGroup(s.bloodGroup)
  }, [])

  // Simulate live broadcast data
  useEffect(() => {
    if (sosState !== "live") return
    const iv = setInterval(() => {
      setLive(prev => {
        const elapsed = prev.elapsedSec + 1
        const notified = Math.min(24, Math.floor(elapsed * 1.2))
        const responded = Math.min(notified, Math.floor(elapsed * 0.3))
        const radius = elapsed > 120 ? 25 : elapsed > 60 ? 10 : 5
        return { notified, responded, radius, elapsedSec: elapsed }
      })
    }, 1000)
    return () => clearInterval(iv)
  }, [sosState])

  function launchSos() {
    if (!bloodGroup || !hospital.trim()) return
    setSosState("broadcasting")
    setTimeout(() => setSosState("live"), 2000)
  }

  function cancelSos() {
    setCancelled(true)
    setSosState("idle")
    setLive({ notified: 0, responded: 0, radius: 5, elapsedSec: 0 })
  }

  function formatElapsed(sec: number) {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return m > 0 ? `${m}m ${s}s` : `${s}s`
  }

  if (!session) return null

  const compatible = BLOOD_COMPAT[bloodGroup] ?? []

  return (
    <div className="max-w-lg mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500">
          <ChevronRight className="h-5 w-5 rotate-180" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="h-5 w-5 text-red-600" /> Emergency SOS
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Broadcast to all compatible donors instantly</p>
        </div>
      </div>

      {/* Cancelled banner */}
      {cancelled && (
        <div className="bg-gray-100 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-600 font-medium">
          SOS request cancelled.
        </div>
      )}

      {/* ── IDLE: Setup form ── */}
      {sosState === "idle" && !cancelled && (
        <>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">
              <strong>Use only in genuine emergencies.</strong> This broadcasts to all nearby donors immediately, triggering urgent notifications.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <h2 className="text-sm font-bold text-gray-900">Emergency details</h2>

            {/* Blood group */}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Blood group needed *</p>
              <div className="grid grid-cols-4 gap-2">
                {BLOOD_GROUPS.map(g => (
                  <button key={g} type="button" onClick={() => setBloodGroup(g)}
                    className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-colors
                      ${bloodGroup === g ? "border-red-600 bg-red-600 text-white" : "border-gray-200 bg-white text-gray-700 hover:border-red-300"}`}>
                    {g}
                  </button>
                ))}
              </div>
              {bloodGroup && (
                <p className="text-xs text-gray-500 mt-2">
                  Compatible donors: <strong>{compatible.join(", ")}</strong>
                </p>
              )}
            </div>

            {/* Units */}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Units needed *</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setUnits(u => String(Math.max(1, Number(u) - 1)))}
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-lg font-bold hover:bg-gray-50">−</button>
                <span className="text-2xl font-bold text-gray-900 w-8 text-center">{units}</span>
                <button onClick={() => setUnits(u => String(Math.min(10, Number(u) + 1)))}
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-lg font-bold hover:bg-gray-50">+</button>
                <span className="text-sm text-gray-400">unit{Number(units) > 1 ? "s" : ""}</span>
              </div>
            </div>

            {/* Hospital */}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1.5">Hospital location *</p>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="e.g. Apollo Hospital, Andheri"
                  value={hospital} onChange={e => setHospital(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
            </div>
          </div>

          {/* SOS trigger */}
          <button
            onClick={launchSos}
            disabled={!bloodGroup || !hospital.trim()}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-black text-lg py-4 rounded-2xl transition-colors flex items-center justify-center gap-3 shadow-lg shadow-red-200"
          >
            <Zap className="h-6 w-6" />
            SEND SOS NOW
          </button>

          {/* Also: 108 deeplink */}
          <a href="tel:108"
            className="flex items-center justify-center gap-2 w-full border-2 border-red-200 hover:border-red-400 text-red-600 font-semibold text-sm rounded-2xl py-3 transition-colors">
            <Phone className="h-4 w-4" /> Call 108 — Emergency Ambulance
          </a>

          {/* Nearby blood banks */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Nearby Blood Banks</p>
            {BLOOD_BANKS.map(bb => (
              <div key={bb.name} className="bg-white rounded-2xl border border-gray-100 p-3 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${bb.stock ? "bg-green-50" : "bg-gray-100"}`}>
                  <Droplets className={`h-4 w-4 ${bb.stock ? "text-green-600" : "text-gray-400"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{bb.name}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-0.5"><MapPin className="h-3 w-3" />{bb.area} · {bb.distanceKm} km</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${bb.stock ? "text-green-600 bg-green-50" : "text-gray-400 bg-gray-100"}`}>
                    {bb.stock ? "In stock" : "No stock"}
                  </span>
                  <a href={`tel:${bb.phone}`} className="block mt-1">
                    <Phone className="h-4 w-4 text-gray-400 hover:text-green-600 ml-auto transition-colors" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── BROADCASTING ── */}
      {sosState === "broadcasting" && (
        <div className="flex flex-col items-center gap-5 py-16">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center animate-ping absolute inset-0" />
            <div className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center relative z-10">
              <Zap className="h-10 w-10 text-white" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-gray-900">Broadcasting SOS…</p>
            <p className="text-sm text-gray-500 mt-1.5">Finding compatible donors near {hospital}</p>
          </div>
        </div>
      )}

      {/* ── LIVE tracker ── */}
      {sosState === "live" && (
        <>
          {/* Live card */}
          <div className="bg-red-600 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                <p className="text-white font-bold text-sm uppercase tracking-wide">Live SOS Active</p>
              </div>
              <p className="text-white/70 text-xs font-mono">{formatElapsed(live.elapsedSec)}</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Notified", value: live.notified, icon: Users  },
                { label: "Responded", value: live.responded, icon: CheckCircle2 },
                { label: "Radius",  value: `${live.radius} km`, icon: MapPin },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-white/20 rounded-xl p-2.5 text-center">
                  <Icon className="h-4 w-4 text-white mx-auto mb-1" />
                  <p className="text-white font-black text-lg">{value}</p>
                  <p className="text-white/70 text-[10px]">{label}</p>
                </div>
              ))}
            </div>

            {live.elapsedSec > 60 && live.radius === 10 && (
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                <RefreshCw className="h-4 w-4 text-white/80 shrink-0" />
                <p className="text-white/80 text-xs">No response in 1 min — radius expanded to 10 km</p>
              </div>
            )}
            {live.elapsedSec > 120 && live.radius === 25 && (
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                <RefreshCw className="h-4 w-4 text-white/80 shrink-0" />
                <p className="text-white/80 text-xs">Still searching — radius expanded to 25 km</p>
              </div>
            )}
          </div>

          {/* Request summary */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Active SOS request</p>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center font-bold text-red-600">{bloodGroup}</div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{units} unit{Number(units) > 1 ? "s" : ""} needed</p>
                <p className="text-xs text-gray-400 flex items-center gap-0.5"><MapPin className="h-3 w-3" />{hospital}</p>
              </div>
            </div>
          </div>

          {/* Responded donors */}
          {live.responded > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-green-600" />
                <p className="text-sm font-bold text-gray-900">{live.responded} donor{live.responded > 1 ? "s" : ""} responding</p>
              </div>
              {Array.from({ length: Math.min(live.responded, 3) }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
                    {["AS","MK","VP"][i]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{["Arjun S.","Meera K.","Vikram P."][i]}</p>
                    <p className="text-xs text-gray-400">{["B+","O-","B-"][i]} · {[1.2,2.1,3.8][i]} km away</p>
                  </div>
                  <div className="flex gap-1.5">
                    <a href="tel:+91" className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center hover:bg-green-100 transition-colors">
                      <Phone className="h-3.5 w-3.5 text-green-600" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <a href="tel:108" className="flex-1 flex items-center justify-center gap-2 border-2 border-red-200 hover:border-red-400 text-red-600 font-semibold text-sm rounded-2xl py-3 transition-colors">
              <Phone className="h-4 w-4" /> Call 108
            </a>
            <button
              onClick={cancelSos}
              className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-gray-400 text-gray-600 font-semibold text-sm rounded-2xl py-3 transition-colors"
            >
              Cancel SOS
            </button>
          </div>
        </>
      )}
    </div>
  )
}
