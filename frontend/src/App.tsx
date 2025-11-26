import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import './App.css'
import NavMenu from './shared/NavMenu'
import HomePage from './Home/HomePage'
// Available Days
import AvailableDaysListPage from './AvailableDays/AvailableDayListPage'
import AvailableDayCreatePage from './AvailableDays/AvailableDayCreatePage'
import AvailableDayUpdatePage from './AvailableDays/AvailableDayUpdatePage'
// Appointment
import AppointmentListPage from './Appointment/AppointmentListPage'
import AppointmentBookPage from './Appointment/AppointmentBookPage'
import AppointmentCreatePage from './Appointment/AppointmentCreatePage'
import AppointmentUpdatePage from './Appointment/AppointmentUpdatePage'
import AppointmentManagePage from './Appointment/AppointmentManagePage'
import AppointmentDeletePage from './Appointment/AppointmentDeletePage'
import AppointmentDetailsPage from './Appointment/AppointmentDetailsPage'
// Patients
import PatientListPage from './Patient/PatientListPage'
import PatientCreatePage from './Patient/PatientCreatePage'
import PatientUpdatePage from './Patient/PatientUpdatePage'
// Personnel
import PersonnelListPage from './Personnel/PersonnelListPage'
import PersonnelCreatePage from './Personnel/PersonnelCreatePage'
import PersonnelUpdatePage from './Personnel/PersonnelUpdatePage'

const App: React.FC=() => {
  return(
    <Router>
    <NavMenu />
    <Container className="mt-3">
        <Routes>
          <Route path="/" element={<HomePage />} />
                    {/* Available Days pages */}
          <Route path="/availabledays" element={<AvailableDaysListPage />} />
          <Route path="/availabledayscreate" element={<AvailableDayCreatePage />} />
          <Route path="/availabledays/edit/:availableDayId" element={<AvailableDayUpdatePage />} />
                    {/* Appointment pages */}
          <Route path="/appointment" element={<AppointmentListPage />} />
          <Route path="/appointment/book/:availableDayId" element={<AppointmentBookPage />} />
          <Route path="/appointment/create" element={<AppointmentCreatePage />} />
          <Route path="/appointment/update/:appointmentId" element={<AppointmentUpdatePage />} />
          <Route path="/appointment/manage" element={<AppointmentManagePage />} />
          <Route path="/appointment/delete/:appointmentId" element={<AppointmentDeletePage />} />
          <Route path="/appointment/details/:appointmentId" element={<AppointmentDetailsPage />} />
                    {/* Patient pages */}
          <Route path="/patients" element={<PatientListPage />} />
          <Route path="/patientcreate" element={<PatientCreatePage />} />
          <Route path="/patientupdate/:patientId" element={<PatientUpdatePage />} />
                    {/* Personnel pages */}   
          <Route path="/personnels" element={<PersonnelListPage />} />
          <Route path="/personnelcreate" element={<PersonnelCreatePage />} />
          <Route path="/personnelupdate/:personnelId" element={<PersonnelUpdatePage />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </Container>
</Router>
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