import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppointmentForm from './AppointmentForm';
import type { Appointment } from '../types/Appointment';
import * as AppointmentService from './AppointmentService';

const AppointmentUpdatePage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!appointmentId) return;
    const fetchAppointment = async () => {
      try {
        const data = await AppointmentService.fetchAppointmentById(Number(appointmentId));
        setAppointment(data);
      } catch (error) {
        console.error('Failed to fetch appointment:', error);
        alert('Failed to fetch appointment.');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [appointmentId]);

  const handleUpdate = async (updatedAppointment: Appointment) => {
    if (!appointmentId) return;
    try {
      await AppointmentService.updateAppointment(Number(appointmentId), updatedAppointment);
      navigate('/appointments'); // back to list
    } catch (error) {
      console.error('Failed to update appointment:', error);
      alert('Failed to update appointment.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!appointment) return <p>Appointment not found.</p>;

  return (
    <div>
      <h1>Edit Appointment</h1>
      <AppointmentForm
        onAppointmentChanged={handleUpdate}
        initialData={appointment}
        isUpdate={true}
      />
    </div>
  );
};

export default AppointmentUpdatePage;
