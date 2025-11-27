import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import type { AvailableDay } from "../types/AvailableDay";
import type { Patient } from "../types/Patient";
import type { Personnel } from "../types/Personnel";
import type { AppointmentInput } from "../types/Appointment";
import * as AvailableDayService from "../AvailableDays/AvailableDayService";
import * as PatientService from "../Patient/PatientService";
import * as PersonnelService from "../Personnel/PersonnelService";
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

        // Fetch the slot
        const day = await AvailableDayService.fetchAvailableDayById(Number(availableDayId));

        // Fetch the personnel for this slot
        const allPersonnel: Personnel[] = await PersonnelService.fetchPersonnels();
        const person = allPersonnel.find((p) => p.id === day.personnelId);
        setAvailableDay({ ...day, personnel: person });

        // Fetch all patients
        const allPatients = await PatientService.fetchPatients();
        if (allPatients.length > 0) setSelectedPatientId(allPatients[0].patientId);
        setPatients(allPatients);

      } catch (err) {
        console.error(err);
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
      navigate("/appointment"); // back to list
    } catch (err) {
      console.error(err);
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

      {/* Display read-only slot */}
      <div className="mb-3 p-3 border rounded bg-light">
        <strong>Selected Slot:</strong><br />
        Personnel: {availableDay.personnel?.name ?? "Unknown"}<br />
        Date: {new Date(availableDay.date).toLocaleDateString()}<br />
        Time: {availableDay.startTime} - {availableDay.endTime}
      </div>

      {/* Patient selection */}
      <Form.Group className="mb-3">
        <Form.Label>Patient</Form.Label>
        <Form.Select
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(Number(e.target.value))}
        >
          {patients.map((p) => (
            <option key={p.patientId} value={p.patientId}>
              {p.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Notes */}
      <Form.Group className="mb-3">
        <Form.Label>Notes / Tasks</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </Form.Group>

      {/* Confirm booking */}
      <Button onClick={handleConfirmBooking} disabled={booking}>
        {booking ? "Booking..." : "Confirm Booking"}
      </Button>
    </div>
  );
};

export default AppointmentBookPage;
