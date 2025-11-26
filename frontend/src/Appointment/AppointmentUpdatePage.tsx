import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import type { Appointment, AppointmentInput } from "../types/Appointment";
import type { AvailableDay } from "../types/AvailableDay";
import type { Patient } from "../types/Patient";
import * as AppointmentService from "./AppointmentService";
import * as AvailableDayService from "../AvailableDays/AvailableDayService";
import * as PatientService from "../Patient/PatientService";
import * as PersonnelService from "../Personnel/PersonnelService";

const AppointmentUpdatePage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState<Appointment & { patient?: Patient } | null>(null);
  const [availableDays, setAvailableDays] = useState<AvailableDay[]>([]);
  const [selectedAvailableDayId, setSelectedAvailableDayId] = useState<number | "">("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!appointmentId) throw new Error("No appointment ID provided");

        // Fetch appointment
        const appt = await AppointmentService.fetchAppointmentById(Number(appointmentId));
        if (!appt) throw new Error("Appointment not found");

        // Fetch patients, available days, and personnel
        const [allPatients, allDays, allPersonnel] = await Promise.all([
          PatientService.fetchPatients(),
          AvailableDayService.fetchAvailableDays(),
          PersonnelService.fetchPersonnels(),
        ]);

        // Assign patient object
        const patient = allPatients.find((p) => p.patientId === appt.patientId);

        // Only show unbooked days or current appointment slot
        const filteredDays = allDays.filter(
          (d) => !d.isBooked || d.id === appt.availableDayId
        );

        // Attach personnel to each available day
        const daysWithPersonnel = filteredDays.map((d) => ({
          ...d,
          personnel: allPersonnel.find((p) => p.id === d.personnelId),
        }));

        setAppointment({ ...appt, patient });
        setSelectedAvailableDayId(appt.availableDayId);
        setNotes(appt.notes || "");
        setAvailableDays(daysWithPersonnel);
      } catch (err) {
        console.error(err);
        setError((err as Error).message || "Failed to load appointment data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [appointmentId]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!appointment || selectedAvailableDayId === "" || isNaN(Number(selectedAvailableDayId))) {
    setError("Invalid timeslot selected");
    return;
  }

  const input: AppointmentInput & { appointmentId: number } = {
    appointmentId: appointment.appointmentId, // add ID in payload
    patientId: appointment.patientId,        // patient is locked
    availableDayId: Number(selectedAvailableDayId),
    notes,
  };

  try {
    await AppointmentService.updateAppointment(appointment.appointmentId, input);
    navigate("/appointment/manage");
  } catch (err: any) {
    console.error(err);
    setError(err.message || "Failed to update appointment");
  }
};



  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!appointment) return null;

  return (
    <div>
      <h1>Edit Appointment</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Patient</Form.Label>
          <Form.Control
            type="text"
            readOnly
            value={appointment.patient?.name || "Unknown"}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Appointment Slot</Form.Label>
          <Form.Select
            value={selectedAvailableDayId}
            onChange={(e) => setSelectedAvailableDayId(Number(e.target.value))}
            required
          >
            {availableDays.map((d) => (
              <option key={d.id} value={d.id}>
                {`${d.personnel?.name || "Unknown"} - ${new Date(d.date).toLocaleDateString()} ${d.startTime} - ${d.endTime}`}
              </option>
            ))}
          </Form.Select>
          <Form.Text className="text-muted">
            Selecting a different slot will change the appointment's date/time and personnel.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Notes / Tasks</Form.Label>
          <Form.Control
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Form.Group>

        <Button type="submit" variant="primary">Save</Button>
        <Button variant="secondary" className="ms-2" onClick={() => navigate(-1)}>Cancel</Button>
      </Form>
    </div>
  );
};

export default AppointmentUpdatePage;
