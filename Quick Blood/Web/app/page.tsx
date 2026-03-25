import Link from "next/link"
import { Droplets, Zap, MapPin, Heart, Shield, Clock, ChevronRight, CheckCircle2 } from "lucide-react"

export const metadata = {
  title: "Quick Blood — Save Lives, One Drop at a Time",
  description: "Connect blood donors with patients and hospitals in real time. Register as a donor, request blood, or manage your hospital's inventory.",
}

const STATS = [
  { value: "12,400+", label: "Registered donors" },
  { value: "340+",    label: "Partner hospitals"  },
  { value: "8,900+",  label: "Lives saved"        },
  { value: "< 18 min",label: "Avg donor response" },
]

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Droplets,
    title: "Post a request",
    desc: "Patient or hospital posts an urgent blood request with blood group, units needed, and hospital location.",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    step: "02",
    icon: Zap,
    title: "Instant matching",
    desc: "Our engine finds compatible, available donors nearby — sorted by distance, reliability, and eligibility.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    step: "03",
    icon: Heart,
    title: "Donor responds",
    desc: "Matched donors get an instant push notification and can accept with one tap. You're notified immediately.",
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
  {
    step: "04",
    icon: CheckCircle2,
    title: "Blood is delivered",
    desc: "Donor arrives at the blood bank. Fulfillment is confirmed and donor's 90-day cooldown begins automatically.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
]

const ROLES = [
  {
    icon: Heart,
    role: "Donor",
    desc: "Register your blood group, set your availability, and get notified when a compatible patient nearby needs you.",
    cta: "Become a donor",
    color: "text-red-600",
    bg: "bg-red-600",
    border: "border-red-100",
    badge: "bg-red-50 text-red-600",
  },
  {
    icon: Droplets,
    role: "Patient / Family",
    desc: "Post an urgent or scheduled blood request. We'll match you with compatible donors and keep you updated in real time.",
    cta: "Request blood",
    color: "text-blue-600",
    bg: "bg-blue-600",
    border: "border-blue-100",
    badge: "bg-blue-50 text-blue-600",
  },
  {
    icon: MapPin,
    role: "Hospital",
    desc: "Manage blood inventory, post donor requests, verify your institution, and coordinate with donors — all from one dashboard.",
    cta: "Register hospital",
    color: "text-green-700",
    bg: "bg-green-700",
    border: "border-green-100",
    badge: "bg-green-50 text-green-700",
  },
]

const TRUST = [
  { icon: Shield,    title: "Verified donors",     desc: "All donors go through blood group verification and 90-day cooldown enforcement." },
  { icon: Clock,     title: "Real-time matching",  desc: "Requests are broadcast instantly. Average response time under 18 minutes." },
  { icon: MapPin,    title: "Location-aware",      desc: "GPS-based matching finds the nearest eligible donor first, every time." },
  { icon: CheckCircle2,title:"End-to-end tracking",desc: "From request creation to fulfillment — every step is tracked and confirmed." },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <path d="M12 2C12 2 4 10.5 4 15a8 8 0 0016 0C20 10.5 12 2 12 2z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-base">Quick Blood</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login"
              className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-xl hover:bg-gray-100">
              Sign in
            </Link>
            <Link href="/auth/register"
              className="text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors px-4 py-1.5 rounded-xl">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-pink-50">
        <div className="max-w-5xl mx-auto px-4 py-20 md:py-28 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 text-xs font-bold px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Live requests near you right now
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight">
            Blood when it{" "}
            <span className="text-red-600">matters most.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Quick Blood connects patients and hospitals with compatible blood donors in real time —
            cutting response time from hours to minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/auth/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-base px-6 py-3.5 rounded-2xl transition-colors shadow-lg shadow-red-100">
              <Heart className="h-5 w-5" />
              Register as a donor
            </Link>
            <Link href="/auth/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 font-bold text-base px-6 py-3.5 rounded-2xl transition-colors border-2 border-gray-200">
              Request blood
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-100 rounded-full opacity-40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-pink-100 rounded-full opacity-30 blur-3xl pointer-events-none" />
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(s => (
            <div key={s.label}>
              <p className="text-3xl md:text-4xl font-black text-red-600">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-5xl mx-auto px-4 py-20 space-y-12">
        <div className="text-center space-y-3">
          <p className="text-xs font-bold text-red-600 uppercase tracking-widest">How it works</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">From request to donation in minutes</h2>
          <p className="text-gray-500 max-w-lg mx-auto">No calls, no waiting lists. Just a fast, verified, location-aware matching system.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.step} className="relative space-y-3">
              {i < HOW_IT_WORKS.length - 1 && (
                <div className="hidden md:block absolute top-5 left-[60%] w-full h-px bg-gray-200 z-0" />
              )}
              <div className={`relative z-10 w-10 h-10 rounded-2xl ${step.bg} flex items-center justify-center`}>
                <step.icon className={`h-5 w-5 ${step.color}`} />
              </div>
              <p className="text-xs font-black text-gray-300">{step.step}</p>
              <h3 className="font-bold text-gray-900">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Role cards ── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-4 space-y-10">
          <div className="text-center space-y-3">
            <p className="text-xs font-bold text-red-600 uppercase tracking-widest">Who it&apos;s for</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Built for every role</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {ROLES.map(r => (
              <div key={r.role} className={`bg-white rounded-3xl border-2 ${r.border} p-6 space-y-4 hover:shadow-lg transition-shadow`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl ${r.badge} flex items-center justify-center`}>
                    <r.icon className={`h-5 w-5 ${r.color}`} />
                  </div>
                  <span className={`text-sm font-bold px-2.5 py-0.5 rounded-full ${r.badge}`}>{r.role}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{r.desc}</p>
                <Link href="/auth/register"
                  className={`flex items-center gap-1.5 text-sm font-bold ${r.color} hover:underline`}>
                  {r.cta} <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust signals ── */}
      <section className="max-w-5xl mx-auto px-4 py-20 space-y-10">
        <div className="text-center space-y-3">
          <p className="text-xs font-bold text-red-600 uppercase tracking-widest">Why Quick Blood</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">Safe, fast, and trusted</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {TRUST.map(t => (
            <div key={t.title} className="flex items-start gap-4 bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                <t.icon className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{t.title}</p>
                <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="bg-red-600 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-5">
          <h2 className="text-3xl md:text-4xl font-black text-white">One donor can save three lives.</h2>
          <p className="text-white/80 text-lg">Join thousands of donors already helping patients across India.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/auth/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-red-600 font-bold text-base px-6 py-3.5 rounded-2xl hover:bg-red-50 transition-colors">
              <Heart className="h-5 w-5" />
              Register now — it&apos;s free
            </Link>
            <Link href="/auth/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white font-semibold text-base px-6 py-3.5 rounded-2xl transition-colors border border-red-500">
              Already have an account
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5">
                <path d="M12 2C12 2 4 10.5 4 15a8 8 0 0016 0C20 10.5 12 2 12 2z" />
              </svg>
            </div>
            <span className="font-bold text-white">Quick Blood</span>
          </div>
          <p className="text-xs text-center">© 2026 Quick Blood. Saving lives across India.</p>
          <div className="flex items-center gap-5 text-xs">
            <Link href="/auth/login" className="hover:text-white transition-colors">Login</Link>
            <Link href="/auth/register" className="hover:text-white transition-colors">Register</Link>
            <Link href="/dashboard/compatibility" className="hover:text-white transition-colors">Compatibility</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
