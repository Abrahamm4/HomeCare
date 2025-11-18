import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import NavMenu from './shared/NavMenu'
import './App.css'
import AvailableDaysPage from './AvailableDays/AvailableDays'

const App: React.FC=() => {
  return(
    <>
    <NavMenu />
    <Container>
      <Router>
        <Routes>
          <Route path="/available-days" element={<AvailableDaysPage />} />
          <Route path="*" element={<Navigate to ="/" replace />} />
        </Routes>
      </Router>
    </Container>
    </>
  )
}
export default App
/*function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
*/