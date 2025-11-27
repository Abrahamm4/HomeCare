import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
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
      setError(null);

      try {
        if (!availableDayId) {
          setError("No available day ID provided");
          setLoading(false);
          return;
        }

        // Fetch the slot
        const day = await AvailableDayService.fetchAvailableDayById(Number(availableDayId));

        // Fetch personnel
        const personnelList: Personnel[] = await PersonnelService.fetchPersonnels();
        const person = personnelList.find((p) => p.id === day.personnelId);

        setAvailableDay({ ...day, personnel: person });

        // Fetch patients
        const allPatients = await PatientService.fetchPatients();
        setPatients(allPatients);

        if (allPatients.length > 0) {
          setSelectedPatientId(allPatients[0].patientId);
        }

      } catch (err) {
        console.error(err);
        setError("Failed to load booking data");
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [availableDayId]);

  const handleConfirmBooking = async () => {
    if (!availableDay || !selectedPatientId) return;

    setError(null);
    setBooking(true);

    const input: AppointmentInput = {
      availableDayId: availableDay.id,
      patientId: selectedPatientId,
      notes: notes,
    };

    try {
      await AppointmentService.createAppointment(input);
      navigate("/appointment");
    } catch (err) {
      console.error(err);
      setError("Failed to book appointment");
    } finally {
      setBooking(false);
    }
  };

  const handleCancel = () => navigate(-1);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Book Appointment</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {!availableDay ? (
        <p>No available slot found</p>
      ) : (
        <>
          {/* Display selected slot */}
          <div className="mb-3 p-3 border rounded bg-light">
            <strong>Selected Slot:</strong>
            <br />
            Personnel: {availableDay.personnel?.name ?? "Unknown"}
            <br />
            Date: {availableDay.date.split("T")[0]}
            <br />
            Time: {availableDay.startTime} - {availableDay.endTime}
          </div>

          {/* Patient selection */}
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

          {/* Buttons */}
          <div className="d-flex gap-2">
            <Button onClick={handleConfirmBooking} disabled={booking}>
              {booking ? "Booking..." : "Confirm Booking"}
            </Button>

            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AppointmentBookPage;
