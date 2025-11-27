import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import type { Appointment } from "../types/Appointment";

interface AppointmentTableProps {
  appointments: Appointment[];
  onBook?: (availableDayId: number) => void;
  onEdit?: (appointmentId: number) => void;
  onDelete?: (appointmentId: number) => void;
  onDetails?: (appointmentId: number) => void;
  isManage?: boolean; // If true, show action buttons
}

const AppointmentTable: React.FC<AppointmentTableProps> = ({
  appointments,
  onBook,
  onEdit,
  onDelete,
  onDetails,
  isManage = false,
}) => {
  // Toggleable columns (same UX pattern as PatientTable)
  const [showTimes, setShowTimes] = useState<boolean>(true);
  const [showPatient, setShowPatient] = useState<boolean>(true);
  const [showPersonnel, setShowPersonnel] = useState<boolean>(true);

  return (
    <div>
      {/* === Column Toggles === */}
      <Button
        onClick={() => setShowTimes(prev => !prev)}
        className="btn btn-secondary mb-3 me-2"
      >
        {showTimes ? "Hide Times" : "Show Times"}
      </Button>

      <Button
        onClick={() => setShowPatient(prev => !prev)}
        className="btn btn-secondary mb-3 me-2"
      >
        {showPatient ? "Hide Patient" : "Show Patient"}
      </Button>

      <Button
        onClick={() => setShowPersonnel(prev => !prev)}
        className="btn btn-secondary mb-3"
      >
        {showPersonnel ? "Hide Personnel" : "Show Personnel"}
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>

            {showTimes && <th>Start</th>}
            {showTimes && <th>End</th>}
            {showPatient && <th>Patient</th>}
            {showPersonnel && <th>Personnel</th>}

            {(isManage || onBook) && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {appointments.map(a => (
            <tr key={`${a.appointmentId ?? "appt"}-${a.availableDayId ?? "day"}`}>
              <td>{a.appointmentId || "-"}</td>
              <td>
                {a.availableDay
                  ? new Date(a.availableDay.date).toLocaleDateString()
                  : "-"}
              </td>

              {showTimes && <td>{a.availableDay?.startTime || "-"}</td>}
              {showTimes && <td>{a.availableDay?.endTime || "-"}</td>}
              {showPatient && <td>{a.patient?.name || "-"}</td>}
              {showPersonnel && <td>{a.personnel?.name || "-"}</td>}

              {(isManage || onBook) && (
                <td className="text-center">
                  {isManage ? (
                    <>
                      {/* DETAILS */}
                      <Button
                        variant="info"
                        size="sm"
                        className="me-2"
                        onClick={() =>
                          a.appointmentId && onDetails && onDetails(a.appointmentId)
                        }
                      >
                        Details
                      </Button>

                      {/* EDIT */}
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() =>
                          a.appointmentId && onEdit && onEdit(a.appointmentId)
                        }
                      >
                        Edit
                      </Button>

                      {/* DELETE */}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() =>
                          a.appointmentId && onDelete && onDelete(a.appointmentId)
                        }
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
                      onClick={() =>
                        onBook &&
                        a.availableDay &&
                        onBook(a.availableDay.id)
                      }
                    >
                      Book
                    </Button>
                  )}
                </td>
              )}
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
    </div>
  );
};

export default AppointmentTable;
