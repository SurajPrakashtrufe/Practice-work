"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ChevronLeft, Phone, Send, MapPin, Clock, CheckCheck } from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────────

interface Message {
  id: string
  from: "me" | "them"
  text: string
  time: string
  read: boolean
}

// ── Mock conversation data ─────────────────────────────────────────────────────

const CONTACTS: Record<string, { name: string; role: string; bloodGroup: string; distanceKm: number; isOnline: boolean }> = {
  d1: { name: "Arjun S.",  role: "Donor",   bloodGroup: "B+", distanceKm: 1.2, isOnline: true  },
  d2: { name: "Meera K.",  role: "Donor",   bloodGroup: "O-", distanceKm: 2.1, isOnline: false },
  d3: { name: "Vikram P.", role: "Donor",   bloodGroup: "B-", distanceKm: 3.8, isOnline: true  },
  h1: { name: "Apollo Hospital", role: "Hospital", bloodGroup: "B+", distanceKm: 1.2, isOnline: true },
}

const INITIAL_MESSAGES: Message[] = [
  { id: "m1", from: "them", text: "Hello! I saw your blood request. I'm available and nearby.", time: "9:42 AM", read: true },
  { id: "m2", from: "me",   text: "Thank you so much! We urgently need 2 units of B+.", time: "9:43 AM", read: true },
  { id: "m3", from: "them", text: "I can be at the hospital in about 20 minutes. Which blood bank window?", time: "9:44 AM", read: true },
  { id: "m4", from: "me",   text: "Please go to Blood Bank Window 3, Ground Floor. Ask for Dr. Sharma.", time: "9:45 AM", read: true },
  { id: "m5", from: "them", text: "Got it. On my way! 🚗", time: "9:46 AM", read: true },
]

const QUICK_REPLIES = [
  "Thank you for responding!",
  "Please head to the blood bank window.",
  "What's your ETA?",
  "We're at Apollo Hospital, Andheri.",
  "Please call us when you arrive.",
]

function formatTime(d: Date) {
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
}

export default function ChatPage() {
  const router  = useRouter()
  const params  = useParams()
  const id      = String(params.id)
  const contact = CONTACTS[id] ?? { name: "Unknown", role: "User", bloodGroup: "?", distanceKm: 0, isOnline: false }

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput]       = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function send(text: string) {
    const t = text.trim()
    if (!t) return
    const msg: Message = {
      id: `m${Date.now()}`,
      from: "me",
      text: t,
      time: formatTime(new Date()),
      read: false,
    }
    setMessages(prev => [...prev, msg])
    setInput("")

    // Simulate a reply after a short delay
    const replies = [
      "Okay, I'll be there shortly.",
      "Understood!",
      "On my way.",
      "I'm at the reception now.",
      "Thanks for the update.",
    ]
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `m${Date.now() + 1}`,
        from: "them",
        text: replies[Math.floor(Math.random() * replies.length)],
        time: formatTime(new Date()),
        read: true,
      }])
    }, 1200 + Math.random() * 800)
  }

  return (
    <div className="max-w-lg mx-auto flex flex-col h-[calc(100vh-8rem)]">

      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 shrink-0">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
              {contact.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
            </div>
            {contact.isOnline && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{contact.name}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <span className="font-semibold text-red-600">{contact.bloodGroup}</span>
              <span>·</span>
              <MapPin className="h-3 w-3" />{contact.distanceKm} km
              <span>·</span>
              <span className={contact.isOnline ? "text-green-600 font-medium" : "text-gray-400"}>
                {contact.isOnline ? "Online" : "Last seen recently"}
              </span>
            </p>
          </div>
        </div>
        <a href="tel:+91" className="p-2 rounded-xl hover:bg-green-50 text-green-600 transition-colors shrink-0">
          <Phone className="h-5 w-5" />
        </a>
      </div>

      {/* Message thread */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3">
        {/* Privacy notice */}
        <div className="flex justify-center">
          <span className="text-[10px] text-gray-400 bg-gray-100 rounded-full px-3 py-1">
            Phone numbers are masked for privacy until donation is confirmed.
          </span>
        </div>

        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 space-y-1
              ${msg.from === "me"
                ? "bg-blue-600 text-white rounded-br-sm"
                : "bg-white border border-gray-100 text-gray-900 rounded-bl-sm"}`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <div className={`flex items-center gap-1 justify-end ${msg.from === "me" ? "text-white/60" : "text-gray-400"}`}>
                <Clock className="h-3 w-3" />
                <span className="text-[10px]">{msg.time}</span>
                {msg.from === "me" && <CheckCheck className={`h-3 w-3 ${msg.read ? "text-white" : "text-white/40"}`} />}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {QUICK_REPLIES.map(r => (
          <button
            key={r}
            onClick={() => send(r)}
            className="shrink-0 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-full px-3 py-1.5 transition-colors"
          >
            {r}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
        <input
          type="text"
          placeholder="Type a message…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send(input)}
          className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => send(input)}
          disabled={!input.trim()}
          className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 flex items-center justify-center transition-colors shrink-0"
        >
          <Send className="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  )
}
