import React, { useEffect, useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AppointmentTable from "./AppointmentTable";
import type { Appointment } from "../types/Appointment";
import type { AvailableDay } from "../types/AvailableDay";
import type { Patient } from "../types/Patient";
import type { Personnel } from "../types/Personnel";
import * as AppointmentService from "./AppointmentService";
import * as AvailableDayService from "../AvailableDays/AvailableDayService";
import * as PatientService from "../Patient/PatientService";
import * as PersonnelService from "../Personnel/PersonnelService";
import { useAuth } from "../Auth/AuthContext";

interface MergedSlot {
  availableDay: AvailableDay;
  appointment: Appointment;
}

const AppointmentManagePage: React.FC = () => {
  const [slots, setSlots] = useState<MergedSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchBookedAppointments = async () => {
    setLoading(true);
    setError(null);

    try {
      const [appointments, availableDays, patients, personnel]: [
        Appointment[],
        AvailableDay[],
        Patient[],
        Personnel[]
      ] = await Promise.all([
        AppointmentService.fetchAppointments(),
        AvailableDayService.fetchAvailableDays(),
        PatientService.fetchPatients(),
        PersonnelService.fetchPersonnels(),
      ]);

      const bookedSlots: MergedSlot[] = appointments
        .filter((appt) => {
          // Patients only see their own appointments
          if (user?.role === "Patient") {
            const patient = patients.find((p) => p.patientId === appt.patientId);
            return patient?.authUserId === user.nameid;
          }
          // Admin and Personnel see all appointments
          return true;
        })
        .reduce((acc, apppt) => {
          const day = availableDays.find((d) => d.id === apppt.availableDayId);
          if (!day) return acc;

          const patient = patients.find((p) => p.patientId === apppt.patientId);
          const person = personnel.find((p) => p.id === day.personnelId);

          acc.push({
            availableDay: { ...day, personnel: person },
            appointment: { ...apppt, patient, personnel: person },
          });

          return acc;
        }, [] as MergedSlot[]);

      setSlots(bookedSlots);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch booked appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      void fetchBookedAppointments();
    }
  }, [user]);

  const handleEdit = (appointmentId: number) => {
    navigate(`/appointment/update/${appointmentId}`);
  };

  const handleDelete = (appointmentId: number) => {
    navigate(`/appointment/delete/${appointmentId}`);
  };

  const handleDetails = (appointmentId: number) => {
    navigate(`/appointment/details/${appointmentId}`);
  };

  const handleBack = () => {
    navigate("/appointment");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Booked Appointments</h1>

      <Button className="mb-3" onClick={handleBack}>
        Back to All Slots
      </Button>

      {error && <Alert variant="danger">{error}</Alert>}

      <AppointmentTable
        appointments={slots.map((slot) => ({
          ...slot.appointment,
          availableDay: slot.availableDay,
        }))}
        isManage={true}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDetails={handleDetails}
      />
    </div>
  );
};

export default AppointmentManagePage;
