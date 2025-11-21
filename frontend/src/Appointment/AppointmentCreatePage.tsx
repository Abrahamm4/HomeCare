import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppointmentForm from './AppointmentForm';
import type { Appointment } from '../types/Appointment';
import * as AppointmentService from './AppointmentService';

const AppointmentCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const handleCreate = async (newAppointment: Appointment) => {
    try {
      await AppointmentService.createAppointment(newAppointment);
      navigate('/appointments'); // go back to list page
    } catch (error) {
      console.error('Failed to create appointment:', error);
      alert('Failed to create appointment.');
    }
  };

  return (
    <div>
      <h1>Create Appointment</h1>
      <AppointmentForm onAppointmentChanged={handleCreate} />
    </div>
  );
};

export default AppointmentCreatePage;
