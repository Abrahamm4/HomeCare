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

      // Merge availableDays with appointments and attach patient/personnel info
      const merged: MergedSlot[] = availableDays.map((day) => {
        const appointment = appointments.find((a) => a.availableDayId === day.id);
        const patient = appointment
          ? patients.find((p) => p.patientId === appointment.patientId)
          : undefined;
        const person = personnel.find((p) => p.id === day.personnelId);

        return {
          availableDay: { ...day, personnel: person }, // Attach personnel object
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

  const tableData: Appointment[] = filteredSlots.map((slot) => ({
    appointmentId: slot.appointment?.appointmentId ?? 0,
    patientId: slot.appointment?.patientId ?? 0,
    personnelId: slot.availableDay.personnelId,
    availableDayId: slot.availableDay.id,
    date: slot.availableDay.date,
    notes: slot.appointment?.notes,
    patient: slot.appointment?.patient, // populated if booked
    personnel: slot.availableDay.personnel, // now correctly attached
    availableDay: slot.availableDay,
  }));

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Appointments & Available Slots</h1>

      <div className="mb-3">
        <Button className="me-2" onClick={() => navigate("/appointment/create")}>
          Create Appointment
        </Button>
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

      {error && <p style={{ color: "red" }}>{error}</p>}

      <AppointmentTable appointments={tableData} onBook={handleBook} />
    </div>
  );
};

export default AppointmentListPage;
