"use client"

import { useState } from "react"
import { Droplets, Plus, Minus, Save, CheckCircle2, AlertTriangle, ChevronRight, RefreshCw } from "lucide-react"
import Link from "next/link"

// ── Types & constants ─────────────────────────────────────────────────────────

const BLOOD_GROUPS = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]

const LOW_THRESHOLD  = 3
const CRIT_THRESHOLD = 1

type InventoryMap = Record<string, number>

const INITIAL_INVENTORY: InventoryMap = {
  "O-": 4, "O+": 12, "A-": 2, "A+": 8,
  "B-": 1, "B+": 6, "AB-": 0, "AB+": 3,
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function status(units: number): "critical" | "low" | "ok" {
  if (units <= CRIT_THRESHOLD) return "critical"
  if (units <= LOW_THRESHOLD)  return "low"
  return "ok"
}

const STATUS_STYLE: Record<string, { color: string; bg: string; border: string; label: string }> = {
  critical: { color: "text-red-600",    bg: "bg-red-50",    border: "border-red-300",    label: "Critical" },
  low:      { color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-300",  label: "Low"      },
  ok:       { color: "text-green-700",  bg: "bg-green-50",  border: "border-green-300",  label: "OK"       },
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function HospitalInventory() {
  const [inventory, setInventory]   = useState<InventoryMap>(INITIAL_INVENTORY)
  const [editing, setEditing]       = useState<string | null>(null)
  const [saved, setSaved]           = useState(false)
  const [saving, setSaving]         = useState(false)
  const [lastUpdated]               = useState("25 Mar 2026, 9:00 AM")

  function adjust(group: string, delta: number) {
    setInventory(prev => ({
      ...prev,
      [group]: Math.max(0, Math.min(999, (prev[group] ?? 0) + delta)),
    }))
    setSaved(false)
    setEditing(group)
  }

  function setDirect(group: string, val: string) {
    const n = parseInt(val, 10)
    if (!isNaN(n) && n >= 0 && n <= 999) {
      setInventory(prev => ({ ...prev, [group]: n }))
      setSaved(false)
    }
  }

  function saveAll() {
    setSaving(true)
    // TODO: real API call
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setEditing(null)
    }, 800)
  }

  const totalUnits    = Object.values(inventory).reduce((a, b) => a + b, 0)
  const criticalGroups = BLOOD_GROUPS.filter(g => status(inventory[g]) === "critical")
  const lowGroups      = BLOOD_GROUPS.filter(g => status(inventory[g]) === "low")
  const hasChanges     = !saved

  return (
    <div className="max-w-lg mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Blood Inventory</h1>
          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
            <RefreshCw className="h-3 w-3" /> Last updated: {lastUpdated}
          </p>
        </div>
        <button
          onClick={saveAll}
          disabled={saving || !hasChanges}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors
            ${hasChanges && !saving
              ? "bg-green-700 hover:bg-green-800 text-white"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
        >
          {saving ? (
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          {saving ? "Saving…" : saved ? "Saved" : "Save"}
        </button>
      </div>

      {/* Alerts */}
      {criticalGroups.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-700">Critical: {criticalGroups.join(", ")}</p>
            <p className="text-xs text-red-500 mt-0.5">At or below 1 unit — post a donor request immediately.</p>
          </div>
          <Link
            href="/dashboard/hospital/request/new"
            className="shrink-0 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-red-700 transition-colors"
          >
            Post
          </Link>
        </div>
      )}

      {lowGroups.length > 0 && criticalGroups.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center gap-3">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-700 flex-1">Low stock: <strong>{lowGroups.join(", ")}</strong></p>
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total units", value: String(totalUnits), color: "text-green-700",  bg: "bg-green-50"  },
          { label: "Low / critical", value: String(criticalGroups.length + lowGroups.length), color: criticalGroups.length > 0 ? "text-red-600" : "text-amber-600", bg: criticalGroups.length > 0 ? "bg-red-50" : "bg-amber-50" },
          { label: "Blood groups", value: `${BLOOD_GROUPS.filter(g => inventory[g] > 0).length}/8`, color: "text-blue-600", bg: "bg-blue-50" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-3 border border-gray-100">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
            <p className={`text-xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Inventory grid */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-red-600" />
          <p className="text-sm font-bold text-gray-900">Stock levels</p>
          <p className="text-xs text-gray-400 ml-auto">Tap +/− or type to edit</p>
        </div>

        <div className="space-y-2">
          {BLOOD_GROUPS.map(group => {
            const units = inventory[group]
            const st    = status(units)
            const sty   = STATUS_STYLE[st]
            const isEditing = editing === group

            return (
              <div
                key={group}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border transition-colors
                  ${isEditing ? sty.border + " " + sty.bg : "border-gray-100 bg-gray-50"}`}
              >
                {/* Blood group label */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${sty.bg} ${sty.color} border ${sty.border}`}>
                  {group}
                </div>

                {/* Status label */}
                <div className="w-14 shrink-0">
                  <span className={`text-[10px] font-bold ${sty.color}`}>{sty.label}</span>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => adjust(group, -1)}
                    className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="h-3.5 w-3.5 text-gray-600" />
                  </button>

                  <input
                    type="number"
                    min={0}
                    max={999}
                    value={units}
                    onChange={e => { setDirect(group, e.target.value); setEditing(group) }}
                    onFocus={() => setEditing(group)}
                    className={`w-14 text-center text-lg font-bold border rounded-xl py-1 focus:outline-none focus:ring-2 focus:ring-green-500
                      ${sty.color} bg-white border-gray-200`}
                  />

                  <button
                    onClick={() => adjust(group, 1)}
                    className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5 text-gray-600" />
                  </button>
                </div>

                {/* Unit label */}
                <span className="text-xs text-gray-400 shrink-0 w-8">unit{units !== 1 ? "s" : ""}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Save banner */}
      {hasChanges && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
          <Save className="h-4 w-4 text-green-700 shrink-0" />
          <p className="text-sm text-green-700 flex-1 font-medium">You have unsaved changes.</p>
          <button
            onClick={saveAll}
            disabled={saving}
            className="bg-green-700 hover:bg-green-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save now"}
          </button>
        </div>
      )}

      {saved && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
          <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
          <p className="text-sm text-green-700 font-medium">Inventory saved and updated.</p>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 text-xs text-gray-400">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" /> Critical (≤1 unit)</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Low (≤3 units)</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> OK (&gt;3)</span>
      </div>

      {/* Quick action */}
      <Link
        href="/dashboard/hospital/request/new"
        className="flex items-center gap-3 bg-white border border-gray-200 hover:border-green-400 rounded-2xl px-4 py-3.5 transition-colors"
      >
        <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
          <Droplets className="h-5 w-5 text-green-700" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">Need more blood?</p>
          <p className="text-xs text-gray-400">Post a donor request to replenish stock</p>
        </div>
        <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
      </Link>

    </div>
  )
}
