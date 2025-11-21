import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import "./App.css";
import NavMenu from "./shared/NavMenu";
import HomePage from "./Home/HomePage";

// Available Days
import AvailableDaysListPage from "./AvailableDays/AvailableDayListPage";
import AvailableDayCreatePage from "./AvailableDays/AvailableDayCreatePage";
import AvailableDayUpdatePage from "./AvailableDays/AvailableDayUpdatePage";

// Appointment
import AppointmentListPage from "./Appointment/AppointmentListPage";
import AppointmentCreatePage from "./Appointment/AppointmentCreatePage";
import AppointmentUpdatePage from "./Appointment/AppointmentUpdatePage";

// Patients
import PatientListPage from "./Patient/PatientListPage";
import PatientCreatePage from "./Patient/PatientCreatePage";
import PatientUpdatePage from "./Patient/PatientUpdatePage";

// Personnel
import PersonnelListPage from "./Personnel/PersonnelListPage";
import PersonnelCreatePage from "./Personnel/PersonnelCreatePage";
import PersonnelUpdatePage from "./Personnel/PersonnelUpdatePage";

// Auth
import { AuthProvider } from "./Auth/AuthContext";
import ProtectedRoute from "./Auth/ProtectedRoute";
import LoginPage from "./Auth/LoginPage";
import RegisterPage from "./Auth/RegisterPage";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <NavMenu />
        <Container className="mt-3">
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Available Days pages */}
            <Route
              path="/availabledays"
              element={
                <ProtectedRoute>
                  <AvailableDaysListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/availabledayscreate"
              element={
                <ProtectedRoute>
                  <AvailableDayCreatePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/availabledaysupdate"
              element={
                <ProtectedRoute>
                  <AvailableDayUpdatePage />
                </ProtectedRoute>
              }
            />

            {/* Appointment pages */}
            <Route
              path="/appointment"
              element={
                <ProtectedRoute>
                  <AppointmentListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointmentcreate"
              element={
                <ProtectedRoute>
                  <AppointmentCreatePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointmentupdate"
              element={
                <ProtectedRoute>
                  <AppointmentUpdatePage />
                </ProtectedRoute>
              }
            />

            {/* Patient pages */}
            <Route
              path="/patients"
              element={
                <ProtectedRoute>
                  <PatientListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patientcreate"
              element={
                <ProtectedRoute>
                  <PatientCreatePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patientupdate/:patientId"
              element={
                <ProtectedRoute>
                  <PatientUpdatePage />
                </ProtectedRoute>
              }
            />

            {/* Personnel pages */}
            <Route
              path="/personnels"
              element={
                <ProtectedRoute>
                  <PersonnelListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/personnelcreate"
              element={
                <ProtectedRoute>
                  <PersonnelCreatePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/personnelupdate/:personnelId"
              element={
                <ProtectedRoute>
                  <PersonnelUpdatePage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
};

export default App;
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