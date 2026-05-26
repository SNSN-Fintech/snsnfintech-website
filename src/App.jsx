import { lazy, Suspense } from 'react'
import Banner from './components/Banner'
import Header from './components/Header'
import Hero from './components/Hero'

// Lazy load below-the-fold components
const TrustBar = lazy(() => import('./components/TrustBar'))
const Services = lazy(() => import('./components/Services'))
const About = lazy(() => import('./components/About'))
const Process = lazy(() => import('./components/Process'))
const CTA = lazy(() => import('./components/CTA'))
const Contact = lazy(() => import('./components/Contact'))
const Footer = lazy(() => import('./components/Footer'))

function App() {
  return (
    <>
      <Banner />
      <Header />
      <main>
        <Hero />
        <Suspense fallback={null}>
          <TrustBar />
          <Services />
          <About />
          <Process />
          <CTA />
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  )
}

export default App
