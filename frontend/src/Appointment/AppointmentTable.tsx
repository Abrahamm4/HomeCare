// src/components/AppointmentTable.tsx

import React from "react";
import { Table, Button } from "react-bootstrap";
import type { Appointment } from "../types/Appointment";

interface AppointmentTableProps {
  appointments: Appointment[];
  onBook?: (availableDayId: number) => void;
  onEdit?: (appointmentId: number) => void;
  onDelete?: (appointmentId: number) => void;
  onDetails?: (appointmentId: number) => void;
  isManage?: boolean; // If true, show manage buttons
}

const AppointmentTable: React.FC<AppointmentTableProps> = ({
  appointments,
  onBook,
  onEdit,
  onDelete,
  onDetails,
  isManage = false,
}) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Date</th>
          <th>Start</th>
          <th>End</th>
          <th>Patient</th>
          <th>Personnel</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((a) => (
          <tr key={`${a.appointmentId ?? "appt"}-${a.availableDayId ?? "day"}`}>

            <td>{a.appointmentId || "-"}</td>
            <td>
              {a.availableDay
                ? new Date(a.availableDay.date).toLocaleDateString()
                : "-"}
            </td>
            <td>{a.availableDay?.startTime || "-"}</td>
            <td>{a.availableDay?.endTime || "-"}</td>
            <td>{a.patient?.name || "-"}</td>
            <td>{a.personnel?.name || "-"}</td>
            <td>
              {isManage ? (
                <>
                  <Button
                    size="sm"
                    variant="info"
                    className="me-1"
                    onClick={() => a.appointmentId && onDetails && onDetails(a.appointmentId)}
                  >
                    Details
                  </Button>
                  <Button
                    size="sm"
                    variant="warning"
                    className="me-1"
                    onClick={() => a.appointmentId && onEdit && onEdit(a.appointmentId)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => a.appointmentId && onDelete && onDelete(a.appointmentId)}
                  >
                    Delete
                  </Button>
                </>
              ) : a.availableDay?.isBooked ? (
                <Button size="sm" variant="secondary" disabled>
                  Booked
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onBook && a.availableDay && onBook(a.availableDay.id)}
                >
                  Book
                </Button>
              )}
            </td>
          </tr>
        ))}
        {appointments.length === 0 && (
          <tr>
            <td colSpan={7} className="text-center">
              No appointments or available slots found.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default AppointmentTable;
