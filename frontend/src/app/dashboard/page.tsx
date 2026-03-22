'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Download } from 'lucide-react'

interface Scholarship {
  id: number
  name: string
  domain_match: string
  min_score: number
  amount: string
  deadline: string
}

interface CareerMatch {
  domain: string
  score: number
}

interface CareerDetails {
  domain: string;
  title: string;
  salary: string;
  growth: string;
}

const ROADMAPS: Record<string, any[]> = {
  Software: [
    { month: 'Phase 1', title: 'Master Core Programming', desc: 'Focus on Python, JavaScript, and Object-Oriented paradigms.' },
    { month: 'Phase 2', title: 'Algorithms & Data Structures', desc: 'Understand lists, trees, and optimize code efficiency.' },
    { month: 'Phase 3', title: 'Build a Technical Portfolio', desc: 'Create 2-3 full-stack projects to showcase your abilities.' },
    { month: 'Phase 4', title: 'Internships & Open Source', desc: 'Network with developers and apply for entry-level roles.' },
  ],
  Design: [
    { month: 'Phase 1', title: 'Learn UI/UX Fundamentals', desc: 'Study color theory, typography, and wireframing basics.' },
    { month: 'Phase 2', title: 'Master Design Tools', desc: 'Become proficient in Figma by recreating popular apps.' },
    { month: 'Phase 3', title: 'Build Case Studies', desc: 'Create 2 comprehensive case studies detailing your UX process.' },
    { month: 'Phase 4', title: 'Freelance & Internships', desc: 'Take on small freelance gigs and apply for junior roles.' },
  ],
  Healthcare: [
    { month: 'Phase 1', title: 'Strong Science Foundation', desc: 'Focus heavily on Biology, Chemistry, and Anatomy classes.' },
    { month: 'Phase 2', title: 'Pre-Med / Internships', desc: 'Shadow doctors or volunteer at local clinics/hospitals.' },
    { month: 'Phase 3', title: 'Entrance Exams (MCAT/NEET)', desc: 'Prepare rigorously for medical entrance examinations.' },
    { month: 'Phase 4', title: 'Medical School', desc: 'Commit to the long-term education and residency process.' },
  ]
}

const defaultRoadmap = [
  { month: 'Phase 1', title: 'Foundational Knowledge', desc: 'Enroll in relevant degree programs or online certifications.' },
  { month: 'Phase 2', title: 'Practical Application', desc: 'Join industry clubs or work on related personal projects.' },
  { month: 'Phase 3', title: 'Networking & Mentorship', desc: 'Connect with professionals on LinkedIn to seek guidance.' },
  { month: 'Phase 4', title: 'Internships & Junior Roles', desc: 'Apply for entry-level positions to gain industry experience.' },
]

const TARGET_PROFILE: Record<string, any> = {
  Software: { coding: 9, analytical: 9, communication: 6, creative: 5 },
  Design: { coding: 3, analytical: 5, communication: 8, creative: 10 },
  Finance: { coding: 3, analytical: 10, communication: 8, creative: 4 },
  Healthcare: { coding: 2, analytical: 8, communication: 9, creative: 3 },
  Engineering: { coding: 5, analytical: 9, communication: 6, creative: 7 },
  Marketing: { coding: 3, analytical: 7, communication: 10, creative: 8 },
  Education: { coding: 2, analytical: 6, communication: 10, creative: 7 },
  'Civil Services': { coding: 1, analytical: 8, communication: 9, creative: 4 }
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<CareerMatch[]>([])
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [careerInfo, setCareerInfo] = useState<CareerDetails | null>(null)
  const [roadmap, setRoadmap] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    const recs = localStorage.getItem('recommendations')
    const scores = localStorage.getItem('confidence_scores')

    if (!userId) {
      router.push('/register')
      return
    }

    let topDomain = 'Software'
    if (recs && scores) {
      const parsedRecs = JSON.parse(recs)
      topDomain = parsedRecs[0]
      const parsedScores = JSON.parse(scores)
      const combined = parsedRecs.map((r: string, index: number) => ({
        domain: r,
        score: parsedScores[index]
      }))
      setRecommendations(combined)
      setRoadmap(ROADMAPS[topDomain] || defaultRoadmap)
    }

    const fetchData = async () => {
      try {
        const uRes = await fetch(`http://localhost:8000/api/users/${userId}`)
        if (uRes.ok) {
          const uData = await uRes.json()
          setUser(uData)
          
          const sRes = await fetch(`http://localhost:8000/api/scholarships?academic_score=${uData.academic_score}&domain=${recs ? JSON.parse(recs)[0] : 'All'}`)
          if (sRes.ok) setScholarships(await sRes.json())
          
          const cRes = await fetch(`http://localhost:8000/api/careers?domain=${topDomain}`)
          if (cRes.ok) {
             const cData = await cRes.json()
             if (cData && cData.length > 0) setCareerInfo(cData[0])
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) return <div className="text-center mt-20 text-xl font-bold">Loading Your Results...</div>

  const topDomain = recommendations[0]?.domain || 'Unknown'
  const customTarget = TARGET_PROFILE[topDomain] || { coding: 7, analytical: 7, communication: 7, creative: 7 }
  
  const chartData = [
    { subject: 'Coding', A: user?.skills?.coding || 0, B: customTarget.coding, fullMark: 10 },
    { subject: 'Communication', A: user?.skills?.communication || 0, B: customTarget.communication, fullMark: 10 },
    { subject: 'Analytical', A: user?.skills?.analytical || 0, B: customTarget.analytical, fullMark: 10 },
    { subject: 'Creative', A: user?.skills?.creative || 0, B: customTarget.creative, fullMark: 10 },
  ]

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="max-w-7xl mx-auto p-6 mt-6 mb-20 font-sans print:m-0 print:p-0">
      
      <div className="flex justify-between items-center mb-8 print:hidden">
        <h1 className="text-4xl font-extrabold text-gray-800">Hello, {user?.name}!</h1>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 shadow-sm transition"
        >
          <Download size={18} /> Download PDF Report
        </button>
      </div>

      {/* Print Only Header */}
      <div className="hidden print:block mb-8 text-center border-b-2 border-primary pb-4">
        <h1 className="text-3xl font-extrabold text-primary">Career Compass Official Report</h1>
        <p className="text-gray-500 mt-2 font-medium">Prepared exclusively for: {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recommendations & Scholarships */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          {/* Career Recommendations */}
          <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col print:shadow-none print:border-gray-200">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><span className="text-primary print:hidden">🎯</span> Top Matches</h2>
            
            {careerInfo && (
              <div className="mb-6 bg-gradient-to-br from-indigo-50 to-pink-50 p-4 rounded-xl border border-indigo-100 print:bg-none print:bg-white print:border-gray-200">
                <div className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-2">Market Insights: {careerInfo.domain}</div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xs font-semibold text-gray-600">Avg Salary</div>
                    <div className="text-md font-bold text-green-700">{careerInfo.salary}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-gray-600">Demand</div>
                    <div className="text-md font-bold text-primary">{careerInfo.growth}</div>
                  </div>
                </div>
              </div>
            )}

            {recommendations.length > 0 ? (
              <div className="space-y-4 flex-grow">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{rec.domain}</h3>
                      <div className="text-primary font-bold bg-primary/10 px-3 py-1 rounded-full text-sm print:bg-transparent">
                        {(rec.score * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1 print:hidden">
                      <div className="bg-gradient-to-r from-primary to-secondary h-1.5 rounded-full" style={{ width: `${rec.score * 100}%` }}></div>
                    </div>
                  </div>
                ))}
                <Link href="/careers" className="block text-center mt-4 p-3 rounded-xl text-primary font-bold hover:bg-gray-100 transition print:hidden">
                  Explore Career Library →
                </Link>
              </div>
            ) : (
              <p className="text-gray-500">No recommendations found.</p>
            )}
          </div>

          {/* Scholarships */}
          <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-sm border border-gray-100 print:shadow-none print:border-gray-200 pt-2 pb-2">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><span className="text-secondary print:hidden">🎓</span> Scholarships</h2>
            {scholarships.length > 0 ? (
              <div className="space-y-4">
                {scholarships.map(s => (
                  <div key={s.id} className="p-4 bg-secondary/5 rounded-xl border border-secondary/20 transition print:border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800">{s.name}</h3>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold print:bg-transparent print:border print:border-green-800">{s.amount}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Domain: <span className="font-medium text-gray-700">{s.domain_match}</span></span>
                      <span>Deadline: <span className="font-medium text-gray-700">{s.deadline}</span></span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No matching scholarships currently.</p>
            )}
          </div>
        </div>

        {/* Right Column: Roadmap & Skills */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Visual Skill Gap Analysis */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center gap-8 print:bg-none print:bg-white print:text-black print:border print:border-gray-200 print:shadow-none">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/5 blur-3xl print:hidden"></div>
            
            <div className="flex-1 relative z-10 w-full text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">Skill Gap Analysis</h2>
              <p className="text-gray-300 print:text-gray-600 mb-6 text-sm">Compare your current abilities against the ideal {topDomain} profile.</p>
              
              <div className="grid grid-cols-2 gap-4 text-left">
                {chartData.map(item => (
                  <div key={item.subject} className="bg-white/10 print:bg-gray-50 p-3 rounded-lg border border-white/10 print:border-gray-200">
                    <div className="text-xs font-medium text-gray-300 print:text-gray-500 mb-1">{item.subject}</div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xl font-bold">{item.A.toFixed(1)} <span className="text-xs text-secondary print:text-gray-500 font-normal">You</span></span>
                      <span className="text-md font-bold text-primary print:text-gray-800">{item.B} <span className="text-xs text-gray-400 font-normal">Req</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full md:w-64 h-64 relative z-10 bg-white/5 print:bg-white rounded-xl flex items-center justify-center p-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                  <PolarGrid stroke="#ffffff33" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#e5e7eb', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                  <Radar name="You" dataKey="A" stroke="#ec4899" fill="#ec4899" fillOpacity={0.6} />
                  <Radar name="Ideal Profile" dataKey="B" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                  <Tooltip wrapperClassName="print:hidden" itemStyle={{ color: 'black' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Learning Roadmap */}
          <div className="bg-white/80 backdrop-blur rounded-2xl p-8 shadow-sm border border-gray-100 flex-grow print:shadow-none print:p-0 print:border-none pt-2">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><span className="text-primary print:hidden">🗺️</span> Actionable Roadmap</h2>
            <p className="text-gray-500 mb-8 text-sm">Your step-by-step path to becoming a {careerInfo?.title || topDomain}</p>
            
            <div className="relative border-l-2 border-primary/30 ml-3 md:ml-6 space-y-8 print:space-y-4">
              {roadmap.map((step, index) => (
                <div key={index} className="relative pl-8 md:pl-10">
                  <div className="absolute w-6 h-6 bg-primary rounded-full left-[-13px] top-1 border-4 border-white shadow print:bg-white print:border-gray-500"></div>
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 hover:shadow-md transition print:bg-transparent print:border-gray-200 print:p-3">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider mb-1 block">{step.month}</span>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
      
      {/* Print Footer */}
      <div className="hidden print:block mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
        Generated by Career Compass AI System - Elevating Student Potential
      </div>
    </div>
  )
}
