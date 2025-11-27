import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
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

interface MergedSlot {
  availableDay: AvailableDay;
  appointment: Appointment;
}

const AppointmentManagePage: React.FC = () => {
  const [slots, setSlots] = useState<MergedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

      const bookedSlots: MergedSlot[] = appointments.map(a => {
        const day = availableDays.find(d => d.id === a.availableDayId)!;
        const patient = patients.find(p => p.patientId === a.patientId);
        const person = personnel.find(p => p.id === day.personnelId);

        return {
          availableDay: { ...day, personnel: person },
          appointment: { ...a, patient, personnel: person },
        };
      });

      setSlots(bookedSlots);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch booked appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookedAppointments();
  }, []);

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

  if (loading) return <p>Loading…</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Booked Appointments</h1>

      <Button className="mb-3" onClick={handleBack}>
        Back to All Slots
      </Button>

      {error && <p className="text-red-600">{error}</p>}

      <AppointmentTable
        appointments={slots.map(slot => ({
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
