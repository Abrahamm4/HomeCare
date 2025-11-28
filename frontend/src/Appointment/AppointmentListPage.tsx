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
import { useAuth } from "../Auth/AuthContext";

interface MergedSlot {
  availableDay: AvailableDay;
  appointment?: Appointment;
}

const AppointmentListPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [slots, setSlots] = useState<MergedSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchSlots = async () => {
    setLoading(true);
    setError(null);

    try {
      const [appointments, availableDays, patients, personnels]: [
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
        const appointment = appointments.find(
          (a) => a.availableDayId === day.id
        );

        const patient = appointment
          ? patients.find((p) => p.patientId === appointment.patientId)
          : undefined;

        const personnel = personnels.find((p) => p.id === day.personnelId);

        return {
          availableDay: { ...day, personnel },
          appointment: appointment
            ? { ...appointment, patient, personnel }
            : undefined,
        };
      });

      setSlots(merged);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to fetch appointments or available slots.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchSlots();
  }, []);

  const handleBook = (availableDayId: number) => {
    navigate(`/appointment/book/${availableDayId}`);
  };

  const handleDelete = async (appointmentId: number) => {
    if (!window.confirm("Delete this appointment?")) return;

    try {
      await AppointmentService.deleteAppointment(appointmentId);
      fetchSlots();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to delete appointment.");
    }
  };

  // Filter based on date, patient name and personnel name
  const filtered = slots.filter((slot) => {
    const q = searchQuery.toLowerCase();

    const dateMatch = slot.availableDay.date.toLowerCase().includes(q);
    const personnelMatch = slot.availableDay.personnel?.name
      ?.toLowerCase()
      .includes(q);
    const patientMatch = slot.appointment?.patient?.name
      ?.toLowerCase()
      .includes(q);

    return dateMatch || personnelMatch || patientMatch;
  });

  const tableData: Appointment[] = filtered.map((slot) => ({
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
      isBooked: !!slot.appointment,
    },
  }));

  return (
    <div>
      <h1>Appointments & Available Slots</h1>

      <Button
        onClick={fetchSlots}
        className="btn btn-primary mb-3 me-2"
        disabled={loading}
      >
        {loading ? "Loading..." : "Refresh Appointments"}
      </Button>

      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by date, personnel, or patient"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Form.Group>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <AppointmentTable
        appointments={tableData}
        onBook={handleBook}
        onDelete={handleDelete}
      />

      {isLoggedIn && (
      <Button
        variant="warning"
        className="mb-3 me-2"
        onClick={() => navigate("/appointment/manage")}
      >
        Manage Appointments
      </Button>
      )}
    </div>
  );
};

export default AppointmentListPage;
