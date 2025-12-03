import React from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { AvailableDay } from "../types/AvailableDay";
import { useAuth } from "../Auth/AuthContext";

interface AvailableDayTableProps {
  days: AvailableDay[];
  onDayDeleted?: (id: number) => void;
  showPersonnel?: boolean;
  showTimes?: boolean;
}

const AvailableDayTable: React.FC<AvailableDayTableProps> = ({
  days,
  onDayDeleted,
  showPersonnel = true,
  showTimes = true,
}) => {

  // Get role
  const { isLoggedIn, user } = useAuth();

  // Simple boolean helpers
  const isPatient = user?.role === "Patient";
  const canModify = isLoggedIn && !isPatient; 
  // (Only Admin + Personnel can edit/delete)

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Id</th>
          {showPersonnel && <th>Personnel</th>}
          <th>Date</th>

          {showTimes && (
            <>
              <th>Start Time</th>
              <th>End Time</th>
            </>
          )}

          <th>Status</th>

          {/* Hide Actions column for patient */}
          {isLoggedIn && !isPatient && <th>Actions</th>}
        </tr>
      </thead>

      <tbody>
        {days.length === 0 ? (
          <tr>
            <td colSpan={showTimes ? 7 : 5} className="text-center">
              No available days found.
            </td>
          </tr>
        ) : (
          days.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>

              {showPersonnel && (
                <td>{d.personnel?.name || "Unknown"}</td>
              )}

              <td>{d.date.split("T")[0]}</td>

              {showTimes && (
                <>
                  <td>{d.startTime}</td>
                  <td>{d.endTime}</td>
                </>
              )}

              <td>{d.isBooked ? "Booked" : "Free"}</td>

              {/* Actions column only for Admin + Personnel */}
              {canModify && (
                <td className="text-center">
                  {/* Details is always allowed */}
                  <Link
                    to={`/availabledays/details/${d.id}`}
                    className="btn btn-info btn-sm me-2"
                  >
                    Details
                  </Link>

                  {/* Edit allowed for non-patient */}
                  <Button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => window.location.assign(`/availabledays/edit/${d.id}`)}
                  >
                    Edit
                  </Button>

                  {/* Delete allowed only for non-patient */}
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={d.isBooked}
                    onClick={() => onDayDeleted?.(d.id)}
                  >
                    Delete
                  </Button>
                </td>
              )}

              {/* patient view show only details button */}
              {isPatient && (
                <td className="text-center">
                  <Link
                    to={`/availabledays/details/${d.id}`}
                    className="btn btn-info btn-sm"
                  >
                    Details
                  </Link>
                </td>
              )}

            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
};

export default AvailableDayTable;
