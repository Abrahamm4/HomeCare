import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import "./App.css";
import NavMenu from "./shared/NavMenu";
import HomePage from "./Home/HomePage";

// Available Days
import AvailableDaysListPage from './AvailableDays/AvailableDayListPage'
import AvailableDayCreatePage from './AvailableDays/AvailableDayCreatePage'
import AvailableDayUpdatePage from './AvailableDays/AvailableDayUpdatePage'
import AvailableDayDeletePage from './AvailableDays/AvailableDayDeletePage'
import AvailableDayDetailsPage from './AvailableDays/AvailableDayDetailsPage'
// Appointment
import AppointmentListPage from './Appointment/AppointmentListPage'
import AppointmentBookPage from './Appointment/AppointmentBookPage'
import AppointmentUpdatePage from './Appointment/AppointmentUpdatePage'
import AppointmentManagePage from './Appointment/AppointmentManagePage'
import AppointmentDeletePage from './Appointment/AppointmentDeletePage'
import AppointmentDetailsPage from './Appointment/AppointmentDetailsPage'
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
                  <AvailableDaysListPage />
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
              path="/availabledaysupdate/:availableDayId"
              element={
                <ProtectedRoute>
                  <AvailableDayUpdatePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/availabledaysdelete/:availableDayId"
              element={<AvailableDayDeletePage/>}
            />
            <Route
              path="/availabledaysdetails/:availableDayId"
              element={<AvailableDayDetailsPage/>}
            />

            {/* Appointment pages */}
            <Route
              path="/appointment"
              element={
                  <AppointmentListPage />
              }
            />
            <Route
              path="/appointmentupdate/:appointmentId"
              element={
                <ProtectedRoute>
                  <AppointmentUpdatePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointment/book/:availableDayId"
              element={<AppointmentBookPage />}
            />
            <Route 
              path="/appointment/manage"
              element={<AppointmentManagePage />}
            />
            <Route
              path="/appointmentdelete/:appointmentId"
              element={<AppointmentDeletePage />}
            />
            <Route
              path="/appointmentdetails/:appointmentId"
              element={<AppointmentDetailsPage />}
            />

            {/* Patient pages */}
            <Route
              path="/patients"
              element={
                 <PatientListPage />
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
                  <PersonnelListPage />
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