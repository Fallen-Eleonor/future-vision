import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { VoiceAssistantLayer } from './components/voice-assistant/VoiceAssistantLayer'
import { VoiceAssistantProvider } from './components/voice-assistant/VoiceAssistantProvider'
import { AppProvider } from './context/AppContext'
import { DashboardPage } from './pages/DashboardPage'
import { LandingPage } from './pages/LandingPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { OptimizerPage } from './pages/OptimizerPage'
import { RevealPage } from './pages/RevealPage'

export default function App() {
  return (
    <AppProvider>
      <VoiceAssistantProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/reveal" element={<RevealPage />} />
            <Route path="/optimizer" element={<OptimizerPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <VoiceAssistantLayer />
        </BrowserRouter>
      </VoiceAssistantProvider>
    </AppProvider>
  )
}
