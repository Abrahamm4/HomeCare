import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import type { AppointmentInput} from "../types/Appointment";
import type { AvailableDay } from "../types/AvailableDay";
import type { Patient } from "../types/Patient";
import * as AppointmentService from "./AppointmentService";
import * as AvailableDayService from "../AvailableDays/AvailableDayService";
import * as PatientService from "../Patient/PatientService";

const AppointmentCreatePage: React.FC = () => {
  const { availableDayId } = useParams<{ availableDayId: string }>();
  const navigate = useNavigate();

  const [availableDay, setAvailableDay] = useState<AvailableDay | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number | "">("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!availableDayId) {
          setError("No AvailableDay ID provided");
          setLoading(false);
          return;
        }

        const day = await AvailableDayService.fetchAvailableDayById(Number(availableDayId));
        if (!day) {
          setError("Selected slot not found");
          setLoading(false);
          return;
        }

        if (day.isBooked) {
          setError("Selected slot is already booked");
          setLoading(false);
          return;
        }

        setAvailableDay(day);

        const patientsList = await PatientService.fetchPatients();
        setPatients(patientsList);
        if (patientsList.length > 0) setSelectedPatientId(patientsList[0].patientId ?? "");
      } catch (err) {
        console.error(err);
        setError("Failed to load data for appointment creation");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [availableDayId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!availableDay || selectedPatientId === "") return;

    const input: AppointmentInput = {
      availableDayId: availableDay.id,
      patientId: Number(selectedPatientId),
      notes,
    };

    try {
      await AppointmentService.createAppointment(input);
      navigate("/appointments/manage");
    } catch (err) {
      console.error(err);
      setError("Failed to create appointment");
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!availableDay) return null;

  return (
    <div>
      <h1>Book Appointment</h1>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Selected Slot</Form.Label>
          <Form.Control
            type="text"
            value={`${availableDay.personnel?.name} - ${new Date(availableDay.date).toLocaleDateString()} ${availableDay.startTime} - ${availableDay.endTime}`}
            readOnly
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Patient</Form.Label>
          <Form.Select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(Number(e.target.value))}
            required
          >
            {patients.map((p) => (
              <option key={p.patientId} value={p.patientId}>
                {p.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Notes / Tasks</Form.Label>
          <Form.Control
            as="textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Form.Group>

        <Button type="submit" variant="primary">
          Confirm Booking
        </Button>
        <Button variant="secondary" className="ms-2" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </Form>
    </div>
  );
};

export default AppointmentCreatePage;
