import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";
import type { Appointment } from "../types/Appointment";
import type { AvailableDay } from "../types/AvailableDay";
import type { Patient } from "../types/Patient";
import type { Personnel } from "../types/Personnel";
import * as AppointmentService from "./AppointmentService";
import * as AvailableDayService from "../AvailableDays/AvailableDayService";
import * as PatientService from "../Patient/PatientService";
import * as PersonnelService from "../Personnel/PersonnelService";
import AppointmentForm from "./AppointmentForm";

const AppointmentUpdatePage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [availableDays, setAvailableDays] = useState<AvailableDay[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setError(null);

      try {
        if (!appointmentId) {
          setError("No appointment ID provided");
          setLoading(false);
          return;
        }

        const [
          appt,
          allDays,
          allPatients,
          allPersonnel
        ]: [Appointment, AvailableDay[], Patient[], Personnel[]] =
          await Promise.all([
            AppointmentService.fetchAppointmentById(Number(appointmentId)),
            AvailableDayService.fetchAvailableDays(),
            PatientService.fetchPatients(),
            PersonnelService.fetchPersonnels(),
          ]);

        setAppointment(appt);
        setPatients(allPatients);

        // attach personnel to availableDays
        const daysWithPersonnel = allDays.map((day) => {
          const person = allPersonnel.find((p) => p.id === day.personnelId);
          return { ...day, personnel: person };
        });

        // allow selecting current booked slot
        const unlockedDays = daysWithPersonnel.filter(
          (d) => !d.isBooked || d.id === appt.availableDayId
        );

        setAvailableDays(unlockedDays);
      } catch (err) {
        console.error("Failed to load appointment data:", err);
        if (err instanceof Error) setError(err.message);
        else setError("Failed to load appointment data");
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [appointmentId]);

  const handleUpdate = async (input: {
    patientId: number;
    availableDayId: number;
    notes?: string;
  }) => {
    setError(null);

    try {
      if (!appointment) {
        setError("Missing appointment data");
        return;
      }

      const selectedDay = availableDays.find((d) => d.id === input.availableDayId);

      if (!selectedDay || !selectedDay.personnel) {
        throw new Error("The selected slot does not have an assigned personnel");
      }

      await AppointmentService.updateAppointment(appointment.appointmentId, {
        patientId: input.patientId,
        availableDayId: input.availableDayId,
        notes: input.notes,
        personnelId: selectedDay.personnel.id,
        date: selectedDay.date,
      });

      navigate("/appointment/manage");
    } catch (err) {
      console.error("Failed to update appointment:", err);

      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred while updating appointment");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2>Update Appointment</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {!appointment ? (
        <p>No appointment found</p>
      ) : (
        <AppointmentForm
          appointment={appointment}
          availableDays={availableDays}
          patients={patients}
          onSubmit={handleUpdate}
        />
      )}

      <button
        className="mt-3 px-4 py-2 border rounded"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
    </div>
  );
};

export default AppointmentUpdatePage;
