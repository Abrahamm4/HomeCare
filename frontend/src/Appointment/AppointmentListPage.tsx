import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
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
  appointment?: Appointment;
}

const AppointmentListPage: React.FC = () => {
  const [slots, setSlots] = useState<MergedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchSlots = async () => {
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

      const merged: MergedSlot[] = availableDays.map((day) => {
        const appointment = appointments.find((a) => a.availableDayId === day.id);
        const patient = appointment
          ? patients.find((p) => p.patientId === appointment.patientId)
          : undefined;
        const person = personnel.find((p) => p.id === day.personnelId);

        return {
          availableDay: { ...day, personnel: person },
          appointment: appointment ? { ...appointment, patient } : undefined,
        };
      });

      setSlots(merged);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch appointments or slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleBook = (availableDayId: number) => {
    navigate(`/appointment/book/${availableDayId}`);
  };

  const handleManage = () => {
    navigate("/appointment/manage");
  };

  const filteredSlots = slots.filter((slot) =>
    slot.availableDay.date.includes(search)
  );

  // Explicitly mark booked slots
  const tableData: Appointment[] = filteredSlots.map((slot) => ({
    appointmentId: slot.appointment?.appointmentId ?? 0,
    patientId: slot.appointment?.patientId ?? 0,
    personnelId: slot.availableDay.personnelId,
    availableDayId: slot.availableDay.id,
    date: slot.availableDay.date,
    notes: slot.appointment?.notes,
    patient: slot.appointment?.patient,
    personnel: slot.availableDay.personnel,
    availableDay: {
      ...slot.availableDay,
      isBooked: !!slot.appointment, // mark booked slots
    },
  }));

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Appointments & Available Slots</h1>

      <div className="mb-3">
        <Button className="me-2" variant="warning" onClick={handleManage}>
          Manage Appointments
        </Button>
        <Button onClick={fetchSlots} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      <Form.Control
        className="mb-3"
        placeholder="Search by date"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && <p className="text-red-600">{error}</p>}

      <AppointmentTable appointments={tableData} onBook={handleBook} />
    </div>
  );
};

export default AppointmentListPage;
