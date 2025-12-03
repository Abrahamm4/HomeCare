import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import type { Appointment } from "../types/Appointment";
import type { AvailableDay } from "../types/AvailableDay";
import type { Patient } from "../types/Patient";

interface AppointmentFormProps {
  appointment: Appointment;
  availableDays: AvailableDay[];
  patients: Patient[];
  onSubmit: (input: {
    patientId: number;
    availableDayId: number;
    notes?: string;
  }) => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  appointment,
  availableDays,
  patients,
  onSubmit,
}) => {
  const navigate = useNavigate();

  const [patientId, setPatientId] = useState<number>(appointment.patientId);
  const [availableDayId, setAvailableDayId] = useState<number>(
    appointment.availableDayId
  );
  const [notes, setNotes] = useState<string>(appointment.notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ patientId, availableDayId, notes });
  };

  const onCancel = () => navigate(-1);

  return (
    <Form onSubmit={handleSubmit}>
      {/* Patient selection */}
      <Form.Group className="mb-3" controlId="patient">
        <Form.Label>Patient</Form.Label>
        <Form.Select
          value={patientId}
          onChange={(e) => setPatientId(Number(e.target.value))}
          required
        >
          <option value="" disabled>
            Select Patient
          </option>

          {patients.map((p) => (
            <option key={p.patientId} value={p.patientId}>
              {p.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Available slot selection */}
      <Form.Group className="mb-3" controlId="availableDay">
        <Form.Label>Appointment Slot</Form.Label>
        <Form.Select
          value={availableDayId}
          onChange={(e) => setAvailableDayId(Number(e.target.value))}
          required
        >
          <option value="" disabled>
            Select Appointment Slot
          </option>

          {availableDays.map((day) => {
            const date = day.date.split("T")[0];

            return (
              <option key={day.id} value={day.id}>
                {day.personnel?.name || "Unknown"} — {date}{" "}
                {day.startTime} - {day.endTime}{" "}
                {day.isBooked && "(Booked)"}
              </option>
            );
          })}
        </Form.Select>
      </Form.Group>

      {/* Notes */}
      <Form.Group className="mb-3" controlId="notes">
        <Form.Label>Notes / Tasks</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </Form.Group>

      <Button type="submit" variant="primary">
        Update Appointment
      </Button>

      <Button
        variant="secondary"
        type="button"
        onClick={onCancel}
        className="ms-2"
      >
        Cancel
      </Button>
    </Form>
  );
};

export default AppointmentForm;
