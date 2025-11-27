// src/components/AppointmentDetailsPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Appointment } from "../types/Appointment";
import * as AppointmentService from "./AppointmentService";
import * as PatientService from "../Patient/PatientService";
import * as PersonnelService from "../Personnel/PersonnelService";
import * as AvailableDayService from "../AvailableDays/AvailableDayService";

const AppointmentDetailsPage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!appointmentId) throw new Error("No appointment ID provided");

        // Fetch appointment
        const appt = await AppointmentService.fetchAppointmentById(Number(appointmentId));

        // Fetch related data
        const [patients, personnelList, availableDays] = await Promise.all([
          PatientService.fetchPatients(),
          PersonnelService.fetchPersonnels(),
          AvailableDayService.fetchAvailableDays(),
        ]);

        // Attach patient and personnel objects
        const patient = patients.find((p) => p.patientId === appt.patientId);
        const day = availableDays.find((d) => d.id === appt.availableDayId);
        const personnel = day ? personnelList.find((p) => p.id === day.personnelId) : undefined;

        setAppointment({
          ...appt,
          patient,
          availableDay: day ? { ...day, personnel } : undefined,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load appointment details");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [appointmentId]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!appointment || !appointment.availableDay) return <p>No appointment found</p>;

  const { availableDay } = appointment;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Appointment Details</h1>

      <p>
        <strong>Patient:</strong> {appointment.patient?.name || "Unknown"}
      </p>
      <p>
        <strong>Personnel:</strong> {availableDay.personnel?.name || "Unknown"}
      </p>
      <p>
        <strong>Date:</strong> {new Date(availableDay.date).toLocaleDateString()}
      </p>
      <p>
        <strong>Time:</strong> {`${availableDay.startTime} - ${availableDay.endTime}`}
      </p>
      <p>
        <strong>Notes:</strong> {appointment.notes || "-"}
      </p>

      <button
        className="mt-4 px-4 py-2 border rounded"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
    </div>
  );
};

export default AppointmentDetailsPage;
