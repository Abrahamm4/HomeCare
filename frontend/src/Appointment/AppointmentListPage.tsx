import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import AppointmentTable from './AppointmentTable';
import type { Appointment } from '../types/Appointment';
import * as AppointmentService from './AppointmentService';
import { useNavigate } from 'react-router-dom';

const AppointmentListPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await AppointmentService.fetchAppointments();
      setAppointments(data);
    } catch {
      setError('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await AppointmentService.deleteAppointment(id);
      setAppointments(prev => prev.filter(a => a.id !== id));
    } catch {
      setError('Failed to delete appointment');
    }
  };

  const filtered = appointments.filter(a =>
    a.date.includes(search)
  );

  return (
    <div>
      <h1>Appointments</h1>

      <Button className="me-2 mb-2" onClick={() => navigate('/appointments-create')}>
        Create Appointment
      </Button>
      <Button className="mb-2" onClick={fetchAppointments} disabled={loading}>
        {loading ? 'Loading...' : 'Refresh'}
      </Button>

      <Form.Control
        className="mb-3"
        placeholder="Search by date"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <AppointmentTable appointments={filtered} onAppointmentDeleted={handleDelete} />
    </div>
  );
};

export default AppointmentListPage;
