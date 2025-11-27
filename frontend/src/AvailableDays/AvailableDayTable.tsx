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
  const { isLoggedIn } = useAuth();

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

          {/* Hide Actions column if not logged in */}
          {isLoggedIn && <th>Actions</th>}
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

              {/* Actions visible only for logged-in users */}
              {isLoggedIn && (
                <td className="text-center">
                  {/* DETAILS always allowed */}
                  <Link
                    to={`/availabledays/details/${d.id}`}
                    className="btn btn-info btn-sm me-2"
                  >
                    Details
                  </Link>

                  {/* EDIT allowed if logged in */}
                  <Button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => window.location.assign(`/availabledays/edit/${d.id}`)}
                  >
                    Edit
                  </Button>

                  {/* DELETE disabled if booked */}
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
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
};

export default AvailableDayTable;
