import React from 'react';
import { Table, Button } from 'react-bootstrap';
import type { Appointment } from '../types/Appointment';

interface AppointmentProps {
  appointments: Appointment[];
  onAppointmentDeleted?: (id: number) => void;
}

const AppointmentTable: React.FC<AppointmentProps> = ({ appointments, onAppointmentDeleted }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Date</th>
          <th>Notes</th>
          <th>Patient</th>
          <th>Personnel</th>
          <th>Available Day</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map(a => (
          <tr key={a.id}>
            <td>{a.id}</td>
            <td>{a.date}</td>
            <td>{a.notes || '-'}</td>
            <td>{a.patientName || a.patientId}</td>
            <td>{a.personnelName || a.personnelId}</td>
            <td>
              {onAppointmentDeleted && (
                <Button variant="danger" size="sm" onClick={() => onAppointmentDeleted(a.id)}>
                  Delete
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default AppointmentTable;
