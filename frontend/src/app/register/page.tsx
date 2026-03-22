'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const INTEREST_TAGS = ['Technology', 'Art', 'Science', 'Business', 'Healthcare', 'Engineering', 'Design', 'Writing', 'Management', 'Finance', 'Education', 'Sports']
const SKILL_TAGS = {
  coding: ['Python', 'JavaScript', 'Web Dev', 'AI/ML', 'Data Analysis', 'Cloud', 'Mobile Dev'],
  communication: ['Public Speaking', 'Negotiation', 'Writing', 'Languages', 'Debate', 'Presentation', 'Client Relations'],
  analytical: ['Math', 'Problem Solving', 'Research', 'Statistics', 'Logic', 'Critical Thinking', 'Financial Analysis'],
  creative: ['UI/UX Design', 'Drawing', 'Music', 'Video Editing', 'Content Creation', 'Photography', 'Animation']
}

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    education_level: 'High School',
    academic_score: '',
  })
  
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [selectedSkills, setSelectedSkills] = useState<{
    coding: string[],
    communication: string[],
    analytical: string[],
    creative: string[]
  }>({
    coding: [],
    communication: [],
    analytical: [],
    creative: []
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const toggleInterest = (tag: string) => {
    if (selectedInterests.includes(tag)) {
      setSelectedInterests(selectedInterests.filter(t => t !== tag))
    } else {
      setSelectedInterests([...selectedInterests, tag])
    }
  }

  const toggleSkill = (category: keyof typeof SKILL_TAGS, tag: string) => {
    if (selectedSkills[category].includes(tag)) {
      setSelectedSkills({
        ...selectedSkills,
        [category]: selectedSkills[category].filter(t => t !== tag)
      })
    } else {
      setSelectedSkills({
        ...selectedSkills,
        [category]: [...selectedSkills[category], tag]
      })
    }
  }

  const calculateScore = (category: keyof typeof SKILL_TAGS) => {
    const total = SKILL_TAGS[category].length
    const selected = selectedSkills[category].length
    return Math.min(10, (selected / total) * 10 * 1.5) // scale up so they don't have to select all to get 10
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedInterests.length === 0) {
      alert("Please select at least one interest.")
      return
    }
    
    const payload = {
      name: formData.name,
      age: parseInt(formData.age),
      education_level: formData.education_level,
      academic_score: parseFloat(formData.academic_score),
      interests: selectedInterests,
      skills: {
        coding: calculateScore('coding'),
        communication: calculateScore('communication'),
        analytical: calculateScore('analytical'),
        creative: calculateScore('creative'),
      }
    }

    try {
      const res = await fetch('http://localhost:8000/api/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        const data = await res.json()
        localStorage.setItem('userId', data.id)
        router.push('/quiz')
      } else {
        alert('Failed to register')
      }
    } catch (err) {
      console.error(err)
      alert('Error connecting to backend')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 mt-10 mb-20">
      <h2 className="text-3xl font-bold mb-8 text-center text-primary">Student Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input required type="text" name="name" onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary h-10 px-3 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input required type="number" name="age" onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary h-10 px-3 border" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Education Level</label>
            <select name="education_level" value={formData.education_level} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary h-10 px-3 border">
              <option>High School</option>
              <option>Intermediate (10+2)</option>
              <option>Undergraduate</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Academic Score (%)</label>
            <input required type="number" step="0.1" name="academic_score" onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary h-10 px-3 border" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_TAGS.map(tag => (
              <button
                type="button"
                key={tag}
                onClick={() => toggleInterest(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${selectedInterests.includes(tag) ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Select Your Skills</h3>
          <p className="text-sm text-gray-500 mb-4">Choose the tags that apply to your current abilities. We'll automatically calculate your proficiency level.</p>
          
          <div className="space-y-6">
            {(Object.keys(SKILL_TAGS) as Array<keyof typeof SKILL_TAGS>).map(category => (
              <div key={category} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h4 className="text-md font-bold text-gray-700 capitalize mb-3">{category} Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {SKILL_TAGS[category].map(tag => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleSkill(category, tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${selectedSkills[category].includes(tag) ? 'bg-secondary text-white border-secondary' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-primary to-secondary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition transform hover:-translate-y-1">
          Continue to Psychometric Quiz
        </button>
      </form>
    </div>
  )
}
