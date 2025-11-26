import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import type { AvailableDay, AvailableDayInput } from "../types/AvailableDay";

interface AvailableDaysFormProps {
  onAvailableDayChanged: (newDay: AvailableDayInput) => void;
  isUpdate?: boolean;
  initialData?: AvailableDay;
}

const AvailableDaysForm: React.FC<AvailableDaysFormProps> = ({
  onAvailableDayChanged,
  isUpdate = false,
  initialData,
}) => {
  const [personnelId, setPersonnelId] = useState<string>(
    initialData?.personnelId.toString() || ""
  );
  const [date, setDate] = useState<string>(
    initialData?.date ? initialData.date.split("T")[0] : ""
  );
  const [startTime, setStartTime] = useState<string>(initialData?.startTime || "");
  const [endTime, setEndTime] = useState<string>(initialData?.endTime || "");
  const navigate = useNavigate();

  const onCancel = () => navigate(-1);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

  const availableDayInput: AvailableDayInput & { id?: number } = {
    ... (isUpdate && { id: initialData?.id }),
    personnelId: Number(personnelId),
    date,
    startTime,
    endTime,
  };

    onAvailableDayChanged(availableDayInput);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formPersonnelId" className="mb-3">
        <Form.Label>Personnel ID</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter Personnel ID"
          value={personnelId}
          onChange={(e) => setPersonnelId(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="formDate" className="mb-3">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="formStartTime" className="mb-3">
        <Form.Label>Start Time</Form.Label>
        <Form.Control
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="formEndTime" className="mb-3">
        <Form.Label>End Time</Form.Label>
        <Form.Control
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        {isUpdate ? "Update Available Day" : "Create Available Day"}
      </Button>
      <Button variant="secondary" onClick={onCancel} className="ms-2">
        Cancel
      </Button>
    </Form>
  );
};

export default AvailableDaysForm;
