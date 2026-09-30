import TripProvider from './context/TripProvider'
import useTrip from './context/useTrip'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import Dashboard from './pages/Dashboard'
import Explore from './pages/Explore'
import TripWorkspace from './pages/TripWorkspace'
import PhaseFour from './pages/PhaseFour'
import './App.css'

function TripOS() {
  const { activeSection } = useTrip()

  const renderSection = () => {
    if (activeSection === 'overview') return <Dashboard />
    if (activeSection === 'explore') return <Explore />
    if (['memories', 'analytics', 'profile', 'admin'].includes(activeSection)) {
      return <PhaseFour sectionId={activeSection} />
    }
    return <TripWorkspace sectionId={activeSection} />
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <TopBar />
        <div className="page-content">{renderSection()}</div>
      </main>
    </div>
  )
}

function App() {
  return (
    <TripProvider>
      <TripOS />
    </TripProvider>
  )
}

export default App