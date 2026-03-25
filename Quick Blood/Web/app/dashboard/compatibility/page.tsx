"use client"

import { useState } from "react"
import { Droplets, CheckCircle2, XCircle, Info } from "lucide-react"

// ── Data ──────────────────────────────────────────────────────────────────────

const BLOOD_GROUPS = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]

// BLOOD_COMPAT[donor] = groups the donor CAN donate to
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

// RECEIVE_FROM[recipient] = groups the recipient can receive from
function getCompatibleDonors(recipient: string): string[] {
  return BLOOD_GROUPS.filter(donor => BLOOD_COMPAT[donor].includes(recipient))
}

const GROUP_INFO: Record<string, { rh: string; label: string; special: string; color: string; bg: string }> = {
  "O-":  { rh: "O Rh−", label: "Universal Donor",    special: "Can donate to ALL groups. Rare — only ~7% of population.", color: "text-red-700",    bg: "bg-red-50"    },
  "O+":  { rh: "O Rh+", label: "Most Common",         special: "Can donate to all Rh+ groups. ~38% of population.",       color: "text-red-600",    bg: "bg-red-50"    },
  "A-":  { rh: "A Rh−", label: "Rare",                special: "Can donate to A and AB groups (both Rh).",               color: "text-orange-600", bg: "bg-orange-50" },
  "A+":  { rh: "A Rh+", label: "Common",              special: "Second most common group. ~30% of population.",           color: "text-orange-500", bg: "bg-orange-50" },
  "B-":  { rh: "B Rh−", label: "Rare",                special: "Can donate to B and AB groups (both Rh).",               color: "text-amber-600",  bg: "bg-amber-50"  },
  "B+":  { rh: "B Rh+", label: "Common",              special: "~9% of population. Can donate to B+ and AB+.",           color: "text-amber-500",  bg: "bg-amber-50"  },
  "AB-": { rh: "AB Rh−",label: "Universal Plasma",    special: "Universal plasma donor. Can donate plasma to all groups.",color: "text-purple-600", bg: "bg-purple-50" },
  "AB+": { rh: "AB Rh+",label: "Universal Recipient", special: "Can receive from ALL groups. Only 3% of population.",    color: "text-purple-700", bg: "bg-purple-50" },
}

type ViewMode = "matrix" | "detail"

export default function CompatibilityPage() {
  const [selected, setSelected]   = useState<string | null>(null)
  const [viewMode, setViewMode]   = useState<ViewMode>("matrix")
  const [highlightDonor, setHighlightDonor] = useState(true) // true = show who donor can give to

  const info = selected ? GROUP_INFO[selected] : null

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Blood Compatibility</h1>
        <p className="text-sm text-gray-500 mt-0.5">Find which blood groups are compatible for donation and transfusion</p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-2xl p-3">
        <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
        <p className="text-xs text-blue-700">
          Tap any blood group to see its full compatibility details. The chart shows whole blood compatibility.
          Plasma and platelet rules differ — see your doctor for specifics.
        </p>
      </div>

      {/* Tab: Matrix / Detail */}
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
        {(["matrix","detail"] as ViewMode[]).map(m => (
          <button key={m} onClick={() => setViewMode(m)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors capitalize
              ${viewMode === m ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
            {m === "matrix" ? "Compatibility matrix" : "Group details"}
          </button>
        ))}
      </div>

      {/* ── MATRIX VIEW ── */}
      {viewMode === "matrix" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3 overflow-x-auto">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-gray-500">
              {highlightDonor ? "Donor → can donate to (columns)" : "Recipient → can receive from (columns)"}
            </p>
            <button
              onClick={() => setHighlightDonor(v => !v)}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Switch view
            </button>
          </div>

          <div className="min-w-[400px]">
            {/* Column headers */}
            <div className="grid grid-cols-9 gap-1 mb-1">
              <div className="text-[10px] text-gray-400 font-semibold flex items-end pb-1">
                {highlightDonor ? "Donor ↓" : "Recipient ↓"}
              </div>
              {BLOOD_GROUPS.map(g => (
                <div key={g} className="text-center text-[10px] font-bold text-gray-700">{g}</div>
              ))}
            </div>

            {/* Matrix rows */}
            {BLOOD_GROUPS.map(rowGroup => {
              const canTo = highlightDonor
                ? BLOOD_COMPAT[rowGroup]           // donor → can give to these
                : getCompatibleDonors(rowGroup)    // recipient → can receive from these

              return (
                <div key={rowGroup} className="grid grid-cols-9 gap-1 mb-1">
                  <button
                    onClick={() => { setSelected(rowGroup === selected ? null : rowGroup); setViewMode("detail") }}
                    className={`text-[11px] font-bold rounded-lg py-1.5 transition-colors
                      ${selected === rowGroup
                        ? `${GROUP_INFO[rowGroup].bg} ${GROUP_INFO[rowGroup].color} ring-2 ring-offset-1 ring-current`
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  >
                    {rowGroup}
                  </button>
                  {BLOOD_GROUPS.map(colGroup => {
                    const compat = highlightDonor
                      ? BLOOD_COMPAT[rowGroup].includes(colGroup)
                      : BLOOD_COMPAT[colGroup].includes(rowGroup)
                    return (
                      <div key={colGroup}
                        className={`rounded-lg flex items-center justify-center py-1.5
                          ${compat ? "bg-green-100" : "bg-gray-50"}`}>
                        {compat
                          ? <CheckCircle2 className="h-3 w-3 text-green-600" />
                          : <XCircle className="h-3 w-3 text-gray-300" />}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
            <span className="flex items-center gap-1.5 text-xs text-gray-500"><CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> Compatible</span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500"><XCircle className="h-3.5 w-3.5 text-gray-300" /> Not compatible</span>
          </div>
        </div>
      )}

      {/* ── DETAIL VIEW ── */}
      {viewMode === "detail" && (
        <div className="space-y-4">
          {/* Group picker */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">Select a blood group</p>
            <div className="grid grid-cols-4 gap-2">
              {BLOOD_GROUPS.map(g => {
                const inf = GROUP_INFO[g]
                return (
                  <button key={g} onClick={() => setSelected(g === selected ? null : g)}
                    className={`py-3 rounded-xl font-bold text-sm border-2 transition-colors
                      ${selected === g
                        ? `border-2 ${inf.bg} ${inf.color}`
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"}`}>
                    {g}
                  </button>
                )
              })}
            </div>
          </div>

          {selected && info ? (
            <div className="space-y-3">
              {/* Group card */}
              <div className={`rounded-2xl border p-5 space-y-3 ${info.bg} border-current/20`}>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex flex-col items-center justify-center">
                    <Droplets className={`h-6 w-6 ${info.color}`} />
                    <p className={`text-base font-black ${info.color}`}>{selected}</p>
                  </div>
                  <div>
                    <p className={`text-lg font-black ${info.color}`}>{info.rh}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white ${info.color}`}>{info.label}</span>
                    <p className="text-xs text-gray-600 mt-1.5 max-w-xs">{info.special}</p>
                  </div>
                </div>
              </div>

              {/* Can donate to */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  <span className={`font-black ${info.color}`}>{selected}</span> can donate to
                </p>
                <div className="flex flex-wrap gap-2">
                  {BLOOD_COMPAT[selected].map(g => (
                    <span key={g} className={`px-3 py-1.5 rounded-xl text-sm font-bold ${GROUP_INFO[g].bg} ${GROUP_INFO[g].color}`}>{g}</span>
                  ))}
                </div>
                <p className="text-xs text-gray-400">{BLOOD_COMPAT[selected].length} compatible recipient group{BLOOD_COMPAT[selected].length !== 1 ? "s" : ""}</p>
              </div>

              {/* Can receive from */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  <span className={`font-black ${info.color}`}>{selected}</span> can receive from
                </p>
                <div className="flex flex-wrap gap-2">
                  {getCompatibleDonors(selected).map(g => (
                    <span key={g} className={`px-3 py-1.5 rounded-xl text-sm font-bold ${GROUP_INFO[g].bg} ${GROUP_INFO[g].color}`}>{g}</span>
                  ))}
                </div>
                <p className="text-xs text-gray-400">{getCompatibleDonors(selected).length} compatible donor group{getCompatibleDonors(selected).length !== 1 ? "s" : ""}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 flex flex-col items-center gap-3 text-center">
              <Droplets className="h-8 w-8 text-gray-300" />
              <p className="text-sm text-gray-500">Select a blood group above to see full compatibility details</p>
            </div>
          )}
        </div>
      )}

      {/* Universal facts */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { group: "O-", label: "Universal Donor", desc: "O− whole blood safe for any recipient", color: "text-red-700", bg: "bg-red-50" },
          { group: "AB+",label: "Universal Recipient", desc: "AB+ can receive from any blood group", color: "text-purple-700", bg: "bg-purple-50" },
          { group: "AB-",label: "Universal Plasma", desc: "AB− plasma can be given to any patient", color: "text-purple-600", bg: "bg-purple-50" },
          { group: "O+", label: "Most Common", desc: "O+ is compatible with all Rh+ groups", color: "text-red-600", bg: "bg-red-50" },
        ].map(f => (
          <div key={f.group} className={`rounded-2xl border p-3 space-y-1 ${f.bg}`}>
            <p className={`text-xl font-black ${f.color}`}>{f.group}</p>
            <p className={`text-xs font-bold ${f.color}`}>{f.label}</p>
            <p className="text-xs text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
