"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Star, Heart, ChevronLeft, CheckCircle2, Loader2 } from "lucide-react"
import { toast } from "sonner"

const ASPECTS = [
  { key: "punctual",    label: "Arrived on time"         },
  { key: "cooperative", label: "Cooperative & helpful"   },
  { key: "healthy",     label: "Passed health screening" },
  { key: "calm",        label: "Calm under pressure"     },
]

const DONOR_NAME = "Arjun S."
const BLOOD_GROUP = "B+"
const HOSPITAL    = "Apollo Hospital"
const DATE        = "25 Mar 2026"

export default function DonorFeedbackPage() {
  const router  = useRouter()
  const [stars, setStars]       = useState(0)
  const [hovered, setHovered]   = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [comment, setComment]   = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone]         = useState(false)

  function toggleAspect(k: string) {
    setSelected(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k])
  }

  function submit() {
    if (stars === 0) return
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setDone(true)
      toast.success("Feedback submitted. Thank you!")
    }, 1000)
  }

  if (done) {
    return (
      <div className="max-w-sm mx-auto flex flex-col items-center text-center gap-5 py-16">
        <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
          <Heart className="h-10 w-10 text-amber-500 fill-amber-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Thank you!</h2>
          <p className="text-sm text-gray-500 mt-1.5">
            Your feedback for <strong>{DONOR_NAME}</strong> has been recorded. It helps build a trusted donor community.
          </p>
        </div>
        <div className="flex">
          {[1,2,3,4,5].map(i => (
            <Star key={i} className={`h-6 w-6 ${i <= stars ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
          ))}
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-2xl transition-colors"
        >
          Back to dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Rate Donor</h1>
      </div>

      {/* Donor card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-black text-lg">
          {DONOR_NAME.split(" ").map(w => w[0]).join("")}
        </div>
        <div>
          <p className="text-base font-bold text-gray-900">{DONOR_NAME}</p>
          <p className="text-sm text-gray-500">{BLOOD_GROUP} · {HOSPITAL}</p>
          <p className="text-xs text-gray-400">{DATE}</p>
        </div>
      </div>

      {/* Star rating */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3 text-center">
        <p className="text-sm font-bold text-gray-900">How was your experience?</p>
        <div className="flex justify-center gap-2">
          {[1,2,3,4,5].map(i => (
            <button
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setStars(i)}
              className="transition-transform hover:scale-110"
            >
              <Star className={`h-9 w-9 transition-colors
                ${i <= (hovered || stars) ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          {stars === 0 ? "Tap to rate" :
           stars === 1 ? "Poor" :
           stars === 2 ? "Fair" :
           stars === 3 ? "Good" :
           stars === 4 ? "Very good" :
           "Excellent!"}
        </p>
      </div>

      {/* Aspect tags */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
        <p className="text-sm font-bold text-gray-900">What went well? <span className="font-normal text-gray-400">(optional)</span></p>
        <div className="flex flex-wrap gap-2">
          {ASPECTS.map(a => (
            <button
              key={a.key}
              onClick={() => toggleAspect(a.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-colors
                ${selected.includes(a.key)
                  ? "border-amber-400 bg-amber-50 text-amber-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}
            >
              {selected.includes(a.key) && <CheckCircle2 className="h-3.5 w-3.5" />}
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
        <p className="text-sm font-bold text-gray-900">Additional comments <span className="font-normal text-gray-400">(optional)</span></p>
        <textarea
          rows={3}
          placeholder="Share your experience to help future patients and hospitals…"
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>

      {/* Submit */}
      <button
        onClick={submit}
        disabled={stars === 0 || submitting}
        className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-bold py-3.5 rounded-2xl transition-colors flex items-center justify-center gap-2"
      >
        {submitting ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</>
        ) : (
          <><Star className="h-4 w-4" /> Submit rating</>
        )}
      </button>

      {stars === 0 && (
        <p className="text-center text-xs text-gray-400">Please select a star rating to continue</p>
      )}
    </div>
  )
}
