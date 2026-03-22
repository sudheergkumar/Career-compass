import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
        AI-Powered Guidance
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
        Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">True Path</span>
      </h1>
      <p className="max-w-2xl text-lg md:text-xl text-gray-600 mb-10">
        Stop guessing. Let our AI analyze your personality, skills, and academic profile to suggest the perfect career trajectory and find scholarships to fund your journey.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/register" className="px-8 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-indigo-600 transition shadow-lg hover:shadow-xl hover:-translate-y-1 transform">
          Start Assessment Now
        </Link>
        <Link href="/careers" className="px-8 py-4 bg-white text-gray-800 rounded-full font-bold text-lg border border-gray-200 hover:border-gray-300 transition shadow hover:shadow-md">
          Explore Careers
        </Link>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        <FeatureCard 
          title="Psychometric AI" 
          desc="Takes your RIASEC traits to find domains that match your personality."
          icon="🧠"
        />
        <FeatureCard 
          title="Smart Scholarships" 
          desc="Finds financial aid and merit-based grants tailored for your profile."
          icon="🎓"
        />
        <FeatureCard 
          title="Skill Gap Analysis" 
          desc="Shows exactly what skills you need to learn to reach your dream job."
          icon="📈"
        />
      </div>
    </div>
  )
}

function FeatureCard({ title, desc, icon }: { title: string, desc: string, icon: string }) {
  return (
    <div className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition text-left">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  )
}
