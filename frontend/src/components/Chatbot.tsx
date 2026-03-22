'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{role: 'ai'|'user', text: string}[]>([
    { role: 'ai', text: "Hi! I'm your AI Career Guide. What would you like to know about your recommended path?" }
  ])
  const [input, setInput] = useState('')
  const [career, setCareer] = useState('your career')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const recs = localStorage.getItem('recommendations')
    if (recs) {
      setCareer(JSON.parse(recs)[0])
      setMessages([
        { role: 'ai', text: `Hi! I see your top match is ${JSON.parse(recs)[0]}. What would you like to know about it?` }
      ])
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setInput('')

    // Mock AI response
    setTimeout(() => {
      let aiResponse = "That's a great question! For " + career + ", focus on constantly building your portfolio and networking."
      
      const lower = userMsg.toLowerCase()
      if (lower.includes('salary') || lower.includes('pay')) {
        aiResponse = `The starting salary for ${career} varies, but with dedication and skill-building, it is one of the most highly rewarded domains!`
      } else if (lower.includes('day') || lower.includes('life')) {
        aiResponse = `A typical day in ${career} involves collaborating with teams, tackling complex problems, and continuous learning.`
      } else if (lower.includes('college') || lower.includes('degree')) {
        aiResponse = `While traditional degrees are great, showing practical skills and projects is often even more important for ${career}.`
      }
      
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }])
    }, 800)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 print:hidden">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-primary to-secondary p-4 rounded-full text-white shadow-xl hover:shadow-2xl hover:scale-110 transition duration-300"
        >
          <MessageCircle size={32} />
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-80 sm:w-96 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-4 text-white flex justify-between items-center shadow-md z-10">
            <div>
              <h3 className="font-bold text-lg">AI Career Guide</h3>
              <p className="text-xs text-white/80">Active now</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition">
              <X size={24} />
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 bg-gray-50 p-4 h-80 overflow-y-auto space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..." 
              className="flex-1 bg-gray-100 text-sm rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button 
              onClick={handleSend}
              className="bg-primary text-white p-2.5 rounded-full hover:bg-indigo-600 transition shadow-sm"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
