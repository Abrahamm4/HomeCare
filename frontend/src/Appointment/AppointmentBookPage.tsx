import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import type { AvailableDay } from "../types/AvailableDay";
import type { Patient } from "../types/Patient";
import type { AppointmentInput } from "../types/Appointment";
import * as AvailableDayService from "../AvailableDays/AvailableDayService";
import * as PatientService from "../Patient/PatientService";
import * as AppointmentService from "./AppointmentService";

const AppointmentBookPage: React.FC = () => {
  const { availableDayId } = useParams<{ availableDayId: string }>();
  const navigate = useNavigate();

  const [availableDay, setAvailableDay] = useState<AvailableDay | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!availableDayId) return;
        const day = await AvailableDayService.fetchAvailableDayById(Number(availableDayId));
        setAvailableDay(day);
        const allPatients = await PatientService.fetchPatients();
        setPatients(allPatients);
        if (allPatients.length > 0) setSelectedPatientId(allPatients[0].patientId);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [availableDayId]);

  const handleConfirmBooking = async () => {
    if (!availableDay || !selectedPatientId) return;

    setBooking(true);
    const input: AppointmentInput = {
      availableDayId: availableDay.id,
      patientId: selectedPatientId,
      notes
    };

    try {
      await AppointmentService.createAppointment(input);
      navigate("/appointment"); // go back to appointment list
    } catch (err) {
      setError("Failed to book appointment");
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!availableDay) return <p>No available slot found</p>;

  return (
    <div>
      <h2>Book Appointment</h2>
      <p>
        <strong>Selected Slot:</strong> {availableDay.personnel?.name} - {new Date(availableDay.date).toLocaleDateString()}{" "}
        {availableDay.startTime} - {availableDay.endTime}
      </p>

      <Form.Group className="mb-3">
        <Form.Label>Patient</Form.Label>
        <Form.Select value={selectedPatientId} onChange={e => setSelectedPatientId(Number(e.target.value))}>
          {patients.map(p => (
            <option key={p.patientId} value={p.patientId}>{p.name}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Notes / Tasks</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
      </Form.Group>

      <Button onClick={handleConfirmBooking} disabled={booking}>
        {booking ? "Booking..." : "Confirm Booking"}
      </Button>
    </div>
  );
};

export default AppointmentBookPage;
