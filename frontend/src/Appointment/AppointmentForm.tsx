// src/components/AppointmentForm.tsx

import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import type { Appointment, AppointmentInput } from "../types/Appointment";
import type { AvailableDay } from "../types/AvailableDay";
import type { Patient } from "../types/Patient";
import * as AvailableDayService from "../AvailableDays/AvailableDayService";
import * as PatientService from "../Patient/PatientService";

interface AppointmentFormProps {
  initialData?: Appointment;          // present if editing
  onSubmit: (input: AppointmentInput) => void;
  isUpdate?: boolean;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  initialData,
  onSubmit,
  isUpdate = false
}) => {
  const [availableDays, setAvailableDays] = useState<AvailableDay[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedAvailableDayId, setSelectedAvailableDayId] = useState<number | undefined>(
    initialData?.availableDayId
  );
  const [selectedPatientId, setSelectedPatientId] = useState<number | undefined>(
    initialData?.patientId
  );
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ------------------------------------------------------
  // Load AvailableDays
  // ------------------------------------------------------
  useEffect(() => {
    const loadAvailableDays = async () => {
      setLoading(true);
      try {
        let days = await AvailableDayService.fetchAvailableDays();

        if (isUpdate && initialData) {
          // Include current slot even if booked
          days = days.filter(d => !d.isBooked || d.id === initialData.availableDayId);
        } else {
          days = days.filter(d => !d.isBooked);
        }

        setAvailableDays(days);

        if (!selectedAvailableDayId && days.length > 0) {
          setSelectedAvailableDayId(days[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch available days:", err);
        setError("Failed to load available slots");
      } finally {
        setLoading(false);
      }
    };

    loadAvailableDays();
  }, [isUpdate, initialData]);

  // ------------------------------------------------------
  // Load Patients
  // ------------------------------------------------------
  useEffect(() => {
    const loadPatients = async () => {
      setLoading(true);
      try {
        const allPatients = await PatientService.fetchPatients();
        setPatients(allPatients);

        if (!selectedPatientId && allPatients.length > 0) {
          setSelectedPatientId(allPatients[0].patientId ?? undefined);
        }
      } catch (err) {
        console.error("Failed to fetch patients:", err);
        setError("Failed to load patients");
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, [selectedPatientId]);

  // ------------------------------------------------------
  // Submit handler
  // ------------------------------------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAvailableDayId || !selectedPatientId) {
      alert("Please select a slot and a patient");
      return;
    }

    const input: AppointmentInput = {
      availableDayId: selectedAvailableDayId,
      patientId: selectedPatientId,
      notes,
    };

    onSubmit(input);
  };

  // ------------------------------------------------------
  // UI States
  // ------------------------------------------------------
  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // ------------------------------------------------------
  // FORM RENDER
  // ------------------------------------------------------
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formAvailableDay">
        <Form.Label>Appointment Slot (Date - Personnel)</Form.Label>
        <Form.Select
          value={selectedAvailableDayId}
          onChange={(e) => setSelectedAvailableDayId(Number(e.target.value))}
          required
        >
          {availableDays.map((day) => (
            <option key={day.id} value={day.id}>
              {day.personnel?.name} - {new Date(day.date).toLocaleDateString()}{" "}
              {day.startTime}-{day.endTime} {day.isBooked ? "(Booked)" : ""}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formPatient">
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

      <Form.Group className="mb-3" controlId="formNotes">
        <Form.Label>Notes / Tasks</Form.Label>
        <Form.Control
          as="textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </Form.Group>

      <Button type="submit" variant="primary">
        {isUpdate ? "Update Appointment" : "Book Appointment"}
      </Button>
    </Form>
  );
};

export default AppointmentForm;
