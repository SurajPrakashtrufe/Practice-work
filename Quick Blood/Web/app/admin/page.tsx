"use client"

import Link from "next/link"
import {
  Building, Users, Droplets, CheckCircle2, Clock,
  AlertTriangle, TrendingUp, XCircle, ChevronRight,
} from "lucide-react"

const STATS = [
  { icon: Users,       label: "Total donors",     value: "1,284", sub: "+12 today",         color: "text-blue-600",   bg: "bg-blue-50"   },
  { icon: Building,    label: "Hospitals",         value: "47",    sub: "3 pending review",  color: "text-green-700",  bg: "bg-green-50"  },
  { icon: Droplets,    label: "Active requests",   value: "38",    sub: "6 urgent",          color: "text-red-600",    bg: "bg-red-50"    },
  { icon: CheckCircle2,label: "Fulfilled today",   value: "21",    sub: "89% success rate",  color: "text-purple-600", bg: "bg-purple-50" },
]

const PENDING_HOSPITALS = [
  { id: "h1", name: "Sunrise Medical Centre", city: "Pune",    type: "Private",   submitted: "2 hrs ago"  },
  { id: "h2", name: "Green Valley Hospital",  city: "Nashik",  type: "Government",submitted: "5 hrs ago"  },
  { id: "h3", name: "Care & Cure Hospital",   city: "Mumbai",  type: "NGO",       submitted: "1 day ago"  },
]

const RECENT_ACTIVITY = [
  { type: "user",     text: "New donor registered",                 sub: "Priya M. — O+ · Mumbai",        time: "2 min ago",  color: "bg-blue-100 text-blue-600"   },
  { type: "request",  text: "Urgent request posted",                sub: "B+ · 2 units · Apollo Hospital", time: "5 min ago",  color: "bg-red-100 text-red-600"     },
  { type: "fulfilled",text: "Request fulfilled",                    sub: "A+ · KEM Hospital · Parel",      time: "12 min ago", color: "bg-green-100 text-green-600" },
  { type: "hospital", text: "Hospital verification submitted",      sub: "Sunrise Medical Centre · Pune",  time: "2 hrs ago",  color: "bg-indigo-100 text-indigo-600"},
  { type: "alert",    text: "Low stock alert: O- at Apollo Mumbai", sub: "Current stock: 1 unit",          time: "3 hrs ago",  color: "bg-amber-100 text-amber-600" },
  { type: "user",     text: "Suspicious account flagged",           sub: "Duplicate phone number detected",time: "4 hrs ago",  color: "bg-red-100 text-red-600"     },
]

const BLOOD_STATS = [
  { group: "O-",  donors: 34,  requests: 8  },
  { group: "O+",  donors: 312, requests: 14 },
  { group: "A-",  donors: 28,  requests: 3  },
  { group: "A+",  donors: 287, requests: 9  },
  { group: "B-",  donors: 41,  requests: 5  },
  { group: "B+",  donors: 201, requests: 12 },
  { group: "AB-", donors: 18,  requests: 2  },
  { group: "AB+", donors: 98,  requests: 6  },
]

export default function AdminOverview() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Admin Overview</h1>
        <p className="text-sm text-gray-500 mt-0.5">Quick Blood platform health and activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STATS.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
            <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center`}>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-gray-400">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Pending verifications */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" /> Pending Verifications
            </h2>
            <Link href="/admin/hospitals" className="text-xs text-indigo-600 font-semibold flex items-center gap-0.5">
              See all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          {PENDING_HOSPITALS.map(h => (
            <Link key={h.id} href={`/admin/hospitals/${h.id}`}
              className="flex items-center gap-3 bg-white rounded-2xl border border-amber-100 p-3 hover:border-amber-300 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <Building className="h-4 w-4 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{h.name}</p>
                <p className="text-xs text-gray-400">{h.type} · {h.city}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] text-gray-400">{h.submitted}</p>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">Pending</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Blood group stats */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-500" /> Blood Group Distribution
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
            {BLOOD_STATS.map(b => {
              const ratio = b.donors === 0 ? 0 : Math.round(b.donors / (b.donors + b.requests) * 100)
              const low = b.donors < 30
              return (
                <div key={b.group} className="flex items-center gap-3">
                  <span className={`w-8 text-xs font-bold text-right shrink-0 ${low ? "text-red-600" : "text-gray-700"}`}>{b.group}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${low ? "bg-red-400" : "bg-indigo-400"}`} style={{ width: `${ratio}%` }} />
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0 w-16 text-right">{b.donors} donors</span>
                  {low && <AlertTriangle className="h-3 w-3 text-red-400 shrink-0" />}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-gray-900">Recent Activity</h2>
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
          {RECENT_ACTIVITY.map((a, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <div className={`w-2 h-2 rounded-full shrink-0 ${a.color.split(" ")[0]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{a.text}</p>
                <p className="text-xs text-gray-400 truncate">{a.sub}</p>
              </div>
              <p className="text-[10px] text-gray-400 shrink-0">{a.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
