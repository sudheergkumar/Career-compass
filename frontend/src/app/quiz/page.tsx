'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const questions = [
  { id: 'R1', trait: 'R', text: "I like working with tools, machines, or building things." },
  { id: 'I1', trait: 'I', text: "I enjoy solving complex math or science problems." },
  { id: 'A1', trait: 'A', text: "I like expressing my creativity through art, writing, or music." },
  { id: 'S1', trait: 'S', text: "I find fulfillment in helping, teaching, or caring for others." },
  { id: 'E1', trait: 'E', text: "I enjoy leading teams, selling ideas, or managing projects." },
  { id: 'C1', trait: 'C', text: "I prefer working with data, organizing files, or following clear procedures." },
  { id: 'R2', trait: 'R', text: "I prefer physical or outdoors work over sitting at a desk." },
  { id: 'I2', trait: 'I', text: "I like researching and exploring new ideas deeply." },
  { id: 'A2', trait: 'A', text: "I appreciate design and aesthetic beauty in products." },
  { id: 'S2', trait: 'S', text: "I am good at understanding other people's feelings." },
  { id: 'E2', trait: 'E', text: "I am competitive and like to persuade others to my viewpoint." },
  { id: 'C2', trait: 'C', text: "I am very detail-oriented and careful in my work." },
]

export default function Quiz() {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
    const id = localStorage.getItem('userId')
    if (id) setUserId(parseInt(id))
    else router.push('/register')
  }, [router])

  const handleSelect = (qId: string, value: number) => {
    setAnswers({ ...answers, [qId]: value })
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert("Please answer all questions")
      return
    }

    // Aggregate traits
    const traits = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
    questions.forEach(q => {
      // @ts-ignore
      traits[q.trait] += answers[q.id]
    })

    // Average them out of 10 since there are 2 questions per trait (max 10)
    // if value is 1-5, x2 = max 10
    const payload = {
      user_id: userId,
      R: traits.R,
      I: traits.I,
      A: traits.A,
      S: traits.S,
      E: traits.E,
      C: traits.C,
    }

    try {
      const res = await fetch('http://localhost:8000/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        const data = await res.json()
        localStorage.setItem('recommendations', JSON.stringify(data.recommended_domains))
        localStorage.setItem('confidence_scores', JSON.stringify(data.confidence_scores))
        router.push('/dashboard')
      } else {
        alert("Error submitting assessment")
      }
    } catch (err) {
      console.error(err)
      alert("Network error")
    }
  }

  if (!userId) return null

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-2xl border border-gray-100 mt-10 mb-20">
      <h2 className="text-3xl font-bold mb-2 text-center text-primary">Psychometric Assessment</h2>
      <p className="text-center text-gray-500 mb-8">Rate how much you agree with the following statements (1 = Strongly Disagree, 5 = Strongly Agree)</p>

      <div className="space-y-8">
        {questions.map((q, idx) => (
          <div key={q.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-lg font-medium text-gray-800 mb-4">{idx + 1}. {q.text}</p>
            <div className="flex justify-between items-center max-w-md mx-auto">
              {[1, 2, 3, 4, 5].map(val => (
                <button
                  key={val}
                  onClick={() => handleSelect(q.id, val)}
                  className={`w-12 h-12 rounded-full font-bold transition-all ${answers[q.id] === val ? 'bg-primary text-white scale-110 shadow-md' : 'bg-white text-gray-600 border border-gray-300 hover:bg-indigo-50'}`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 px-4">
        <button 
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-xl py-4 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
        >
          Get My Recommendations
        </button>
      </div>
    </div>
  )
}
