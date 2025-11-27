import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import type { Appointment } from "../types/Appointment";

interface AppointmentTableProps {
  appointments: Appointment[];
  onBook?: (availableDayId: number) => void;
  onEdit?: (appointmentId: number) => void;
  onDelete?: (appointmentId: number) => void;
  onDetails?: (appointmentId: number) => void;
  isManage?: boolean;
}

const AppointmentTable: React.FC<AppointmentTableProps> = ({
  appointments,
  onBook,
  onEdit,
  onDelete,
  onDetails,
  isManage = false,
}) => {
  const [showTimes, setShowTimes] = useState<boolean>(true);
  const [showPatient, setShowPatient] = useState<boolean>(true);
  const [showPersonnel, setShowPersonnel] = useState<boolean>(true);

  return (
    <div>
      {/* Column Toggle Buttons */}
      <Button
        onClick={() => setShowTimes((prev) => !prev)}
        className="btn btn-secondary mb-3 me-2"
      >
        {showTimes ? "Hide Times" : "Show Times"}
      </Button>

      <Button
        onClick={() => setShowPatient((prev) => !prev)}
        className="btn btn-secondary mb-3 me-2"
      >
        {showPatient ? "Hide Patient" : "Show Patient"}
      </Button>

      <Button
        onClick={() => setShowPersonnel((prev) => !prev)}
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
          {appointments.map((a) => {
            const isBooked = a.availableDay?.isBooked ?? false;

            return (
              <tr
                key={`${a.appointmentId ?? "none"}-${a.availableDayId ?? "slot"}`}
              >
                <td>{a.appointmentId || "-"}</td>

                <td>{a.date ? a.date.split("T")[0] : "-"}</td>

                {showTimes && <td>{a.availableDay?.startTime || "-"}</td>}
                {showTimes && <td>{a.availableDay?.endTime || "-"}</td>}

                {showPatient && <td>{a.patient?.name || "-"}</td>}
                {showPersonnel && <td>{a.personnel?.name || "-"}</td>}

                {(isManage || onBook) && (
                  <td className="text-center">
                    {/* Mange mode (Details/ Edit/ Delete) */}
                    {isManage ? (
                      <>
                        <Button
                          variant="info"
                          size="sm"
                          className="me-2"
                          disabled={!a.appointmentId}
                          onClick={() =>
                            a.appointmentId &&
                            onDetails &&
                            onDetails(a.appointmentId)
                          }
                        >
                          Details
                        </Button>

                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          disabled={!a.appointmentId}
                          onClick={() =>
                            a.appointmentId &&
                            onEdit &&
                            onEdit(a.appointmentId)
                          }
                        >
                          Edit
                        </Button>

                        <Button
                          variant="danger"
                          size="sm"
                          disabled={!a.appointmentId}
                          onClick={() =>
                            a.appointmentId &&
                            onDelete &&
                            onDelete(a.appointmentId)
                          }
                        >
                          Delete
                        </Button>
                      </>
                    ) : (
                      <>
                        {/* Book mode */}
                        {isBooked ? (
                          <Button variant="secondary" size="sm" disabled>
                            Booked
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="primary"
                            disabled={!a.availableDay}
                            onClick={() =>
                              onBook &&
                              a.availableDay &&
                              onBook(a.availableDay.id)
                            }
                          >
                            Book
                          </Button>
                        )}
                      </>
                    )}
                  </td>
                )}
              </tr>
            );
          })}

          {appointments.length === 0 && (
            <tr>
              <td
                colSpan={
                  2 + 
                  (showTimes ? 2 : 0) +
                  (showPatient ? 1 : 0) +
                  (showPersonnel ? 1 : 0) +
                  (isManage || onBook ? 1 : 0)
                }
                className="text-center"
              >
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
