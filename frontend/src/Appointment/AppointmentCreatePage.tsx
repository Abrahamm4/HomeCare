/*
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { AvailableDay } from "../types/AvailableDay";
import * as AvailableDayService from "../AvailableDays/AvailableDayService";
import * as AppointmentService from "./AppointmentService";
import AppointmentForm from "./AppointmentForm";

const AppointmentCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const [availableDays, setAvailableDays] = useState<AvailableDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDays = async () => {
      try {
        const days = await AvailableDayService.fetchAvailableDays();
        // Only show unbooked slots
        const unbookedDays = days.filter((d) => !d.isBooked);
        setAvailableDays(unbookedDays);
      } catch (err) {
        console.error(err);
        setError("Failed to load available slots");
      } finally {
        setLoading(false);
      }
    };

    loadDays();
  }, []);

  const handleCreate = async (input: {
    patientId: number;
    availableDayId: number;
    notes?: string;
  }) => {
    try {
      await AppointmentService.createAppointment(input);
      navigate("/appointments");
    } catch (err) {
      console.error(err);
      setError("Failed to create appointment");
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (availableDays.length === 0) return <p>No available slots found.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create Appointment</h1>

      <AppointmentForm
        availableDays={availableDays}
        onSubmit={handleCreate}
      />
    </div>
  );
};

export default AppointmentCreatePage;*/
