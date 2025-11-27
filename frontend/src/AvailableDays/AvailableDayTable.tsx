import React from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { AvailableDay } from "../types/AvailableDay";

interface AvailableDayTableProps {
  days: AvailableDay[];
  onDayDeleted?: (id: number) => void;
  showPersonnel?: boolean; // optional toggle
  showTimes?: boolean;     // optional toggle
}

const AvailableDayTable: React.FC<AvailableDayTableProps> = ({
  days,
  onDayDeleted,
  showPersonnel = true,
  showTimes = true,
}) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Id</th>
          {showPersonnel && <th>Personnel</th>}
          <th>Date</th>
          {showTimes && <>
            <th>Start Time</th>
            <th>End Time</th>
          </>}
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {days.length === 0 ? (
          <tr>
            <td colSpan={7} className="text-center">
              No available days found.
            </td>
          </tr>
        ) : (
          days.map(d => (
            <tr key={d.id}>
              <td>{d.id}</td>
              {showPersonnel && <td>{d.personnel?.name || "Unknown"}</td>}
              <td>{d.date.split("T")[0]}</td>
              {showTimes && <>
                <td>{d.startTime}</td>
                <td>{d.endTime}</td>
              </>}
              <td>{d.isBooked ? "Booked" : "Free"}</td>
              <td className="d-flex flex-wrap gap-1">
                <Link
                  to={`/availabledays/details/${d.id}`}
                  className="btn btn-sm btn-info"
                >
                  Details
                </Link>
                <Link
                  to={`/availabledays/edit/${d.id}`}
                  className="btn btn-sm btn-primary"
                >
                  Edit
                </Link>
                <button
                  className="btn btn-sm btn-danger"
                  disabled={d.isBooked}
                  onClick={() => onDayDeleted?.(d.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
};

export default AvailableDayTable;
