import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import type { Appointment } from '../types/Appointment';

interface Props {
  onAppointmentChanged: (updatedAppointment: Appointment) => void | Promise<void>;
  initialData?: Appointment;
  isUpdate?: boolean;
}

const AppointmentForm: React.FC<Props> = ({ onAppointmentChanged, initialData, isUpdate = false }) => {
  const [date, setDate] = useState<string>(initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : '');
  const [notes, setNotes] = useState<string>(initialData?.notes || '');
  const [patientId, setPatientId] = useState<number | ''>(initialData?.patientId || '');
  const [personnelId, setPersonnelId] = useState<number>(initialData?.personnelId || 0);
  const [availableDayId, setAvailableDayId] = useState<number>(initialData?.availableDayId || 0);

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const appointment: Appointment = {
      id: initialData?.id || 0,
      date,
      notes,
      patientId: patientId || null,
      personnelId,
      availableDayId,
    };
    onAppointmentChanged(appointment);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Date</Form.Label>
        <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Notes</Form.Label>
        <Form.Control type="text" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={200} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Patient ID</Form.Label>
        <Form.Control type="number" value={patientId} onChange={(e) => setPatientId(Number(e.target.value))} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Personnel ID</Form.Label>
        <Form.Control type="number" value={personnelId} onChange={(e) => setPersonnelId(Number(e.target.value))} required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Available Day ID</Form.Label>
        <Form.Control type="number" value={availableDayId} onChange={(e) => setAvailableDayId(Number(e.target.value))} required />
      </Form.Group>

      <Button variant="primary" type="submit">{isUpdate ? 'Update' : 'Create'}</Button>
      <Button variant="secondary" className="ms-2" onClick={() => navigate(-1)}>Cancel</Button>
    </Form>
  );
};

export default AppointmentForm;
