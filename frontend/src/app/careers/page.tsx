'use client'

import { useEffect, useState } from 'react'

interface Career {
  id: number
  domain: string
  title: string
  description: string
  skills: string[]
  salary: string
  growth: string
}

export default function Careers() {
  const [careers, setCareers] = useState<Career[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8000/api/careers')
      .then(r => r.json())
      .then(data => {
        setCareers(data)
        setLoading(false)
      })
      .catch(e => console.error(e))
  }, [])

  if (loading) return <div className="text-center mt-20 text-xl font-bold">Loading Library...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-center mb-12">Career Exploration Library</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {careers.map(c => (
          <div key={c.id} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-lg transition flex flex-col h-full">
            <div className="text-xs font-bold tracking-wide text-primary uppercase mb-2">{c.domain}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{c.title}</h2>
            <p className="text-gray-600 mb-4 flex-grow">{c.description}</p>
            
            <div className="flex justify-between items-center text-sm font-semibold text-gray-800 mb-4 bg-gray-50 p-3 rounded-lg">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Avg Salary</span>
                <span className="text-green-700">{c.salary}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Demand</span>
                <span className="text-primary">{c.growth}</span>
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-gray-800 mb-2">Key Skills:</div>
              <div className="flex flex-wrap gap-2">
                {c.skills.map(s => (
                  <span key={s} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">{s}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
