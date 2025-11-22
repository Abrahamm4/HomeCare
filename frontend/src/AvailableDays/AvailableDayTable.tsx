import React from "react";
import { Button, Table } from "react-bootstrap";
import type { AvailableDay } from "../types/AvailableDay";

interface AvailableDayTableProps {
  days: AvailableDay[];
  onDayDeleted?: (id: number) => void;
}
const AvailableDayTable: React.FC<AvailableDayTableProps> = ({
  days,
  onDayDeleted,
}) => {
  return (
    <Table striped bordered hover>
        <thead>
            <tr>
                <th>Id</th>
                <th>Personnel Id</th>
                <th>Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                </tr>
        </thead>
        <tbody>
            {days.map((d) => (
                <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.personnelId}</td>
                    <td>{d.date}</td>
                    <td>{d.startTime}</td>
                    <td>{d.endTime}</td>
                    <td>
                        <Button href={`/availabledays/edit/${d.id}`} className="btn btn-sm btn-primary me-2"
                        >
                            Edit
                            </Button>
                        <Button variant="danger" onClick={()=> d.id && onDayDeleted?.(d.id)}
                        >
                            Delete
                        </Button>
                        </td>
                        </tr>
            ))}
            {days.length === 0 && (
                <tr>
                    <td colSpan={6} className="text-center">
                        No available days found.
                    </td>
                </tr>
            )}
            </tbody>
                            
                        
        </Table>
    );
};
export default AvailableDayTable;