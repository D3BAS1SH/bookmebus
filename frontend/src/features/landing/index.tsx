import { Hero } from './components/Hero'
import { FeatureGrid } from './components/FeatureGrid'
import { Workflow } from './components/Workflow'
import { Testimonials } from './components/Testimonials'
import { Navbar } from '@/components/common/Navbar'
import { Footer } from '@/components/common/Footer'

export function LandingView() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FeatureGrid />
        <Workflow />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}

export * from './components/SearchBar'
export * from './components/Hero'
export * from './components/FeatureGrid'
export * from './components/Workflow'
export * from './components/Testimonials'
