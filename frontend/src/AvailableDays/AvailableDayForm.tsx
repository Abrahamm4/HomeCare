import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import type { AvailableDay, AvailableDayInput } from "../types/AvailableDay";
import type { Personnel } from "../types/Personnel";

interface AvailableDaysFormProps {
  onAvailableDayChanged: (newDay: AvailableDayInput) => void;
  isUpdate?: boolean;
  initialData?: AvailableDay;
  personnels?: Personnel[];
}

const AvailableDaysForm: React.FC<AvailableDaysFormProps> = ({
  onAvailableDayChanged,
  isUpdate = false,
  initialData,
  personnels = [],
}) => {
  const navigate = useNavigate();

  const [personnelId, setPersonnelId] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  useEffect(() => {
    // Ensure we pick a valid personnelId: initialData OR first option OR empty
    const resolvedPersonnelId =
      initialData?.personnelId?.toString() ||
      (personnels.length > 0 ? personnels[0].id.toString() : "");

    setPersonnelId(resolvedPersonnelId);

    setDate(initialData?.date ? initialData.date.split("T")[0] : "");
    setStartTime(initialData?.startTime || "");
    setEndTime(initialData?.endTime || "");
  }, [initialData, personnels]);

  const onCancel = () => navigate(-1);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const availableDayInput: AvailableDayInput & { id?: number } = {
      ...(isUpdate && initialData?.id ? { id: initialData.id } : {}),
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
        <Form.Label>Personnel</Form.Label>
        <Form.Select
          value={personnelId}
          onChange={(e) => setPersonnelId(e.target.value)}
          required
        >
          <option value="" disabled>
            Select Personnel
          </option>
          {personnels.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Form.Select>
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

      <Button
        variant="secondary"
        type="button" // prevents accidental submit
        onClick={onCancel}
        className="ms-2"
      >
        Cancel
      </Button>
    </Form>
  );
};

export default AvailableDaysForm;
