import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!appointmentId) throw new Error("No appointment ID provided");

        const [appt, allDays, allPatients, allPersonnel]: [
          Appointment,
          AvailableDay[],
          Patient[],
          Personnel[]
        ] = await Promise.all([
          AppointmentService.fetchAppointmentById(Number(appointmentId)),
          AvailableDayService.fetchAvailableDays(),
          PatientService.fetchPatients(),
          PersonnelService.fetchPersonnels(),
        ]);

        setAppointment(appt);
        setPatients(allPatients);

        // Attach personnel objects to slots
        const daysWithPersonnel: AvailableDay[] = allDays.map((day) => {
          const person = allPersonnel.find((p) => p.id === day.personnelId);
          return { ...day, personnel: person };
        });

        // Include the current slot even if booked
        const filteredDays = daysWithPersonnel.filter(
          (d) => !d.isBooked || d.id === appt.availableDayId
        );

        setAvailableDays(filteredDays);
      } catch (err) {
        console.error(err);
        setError("Failed to load appointment data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [appointmentId]);

  const handleUpdate = async (input: {
    patientId: number;
    availableDayId: number;
    notes?: string;
  }) => {
    if (!appointment) return;

    try {
      const selectedDay = availableDays.find((d) => d.id === input.availableDayId);
      if (!selectedDay || !selectedDay.personnel) {
        throw new Error("Selected slot does not have a valid personnel assigned");
      }

      await AppointmentService.updateAppointment(appointment.appointmentId, {
        patientId: input.patientId,
        availableDayId: input.availableDayId,
        notes: input.notes,
        personnelId: selectedDay.personnel.id,
        date: selectedDay.date,
      });

      navigate("/appointment/manage");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update appointment");
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!appointment) return <p>No appointment found</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Update Appointment</h1>
      <AppointmentForm
        appointment={appointment}
        availableDays={availableDays}
        patients={patients}
        onSubmit={handleUpdate}
      />
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
