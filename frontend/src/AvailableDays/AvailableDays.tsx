import React, { useState, useEffect } from "react";
import { Button, Form, Table, Modal } from "react-bootstrap";
import type { AvailableDay } from "../types/AvailableDay";

const API_URL = import.meta.env.VITE_API_URL;

const AvailableDaysPage: React.FC = () => {
  const [days, setDays] = useState<AvailableDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Modal for creating a new AvailableDay
  const [showModal, setShowModal] = useState(false);
  const [newDay, setNewDay] = useState({
    personnelId: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  // ------------------------
  // Fetch AvailableDays
  // ------------------------
  const fetchDays = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/backend/HomeCareApi/AvailableDays`);
      if (!res.ok) throw new Error("Failed to fetch days");
      const data: AvailableDay[] = await res.json();
      setDays(data);
    } catch {
      setError("Could not load available days");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDays();
  }, []);

  // ------------------------
  // Create a new AvailableDay
  // ------------------------
  const handleCreate = async () => {
    try {
      const payload = {
        personnelId: Number(newDay.personnelId),
        date: newDay.date,
        startTime: newDay.startTime,
        endTime: newDay.endTime,
      };

      const res = await fetch(`${API_URL}/api/AvailableDays`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create day");

      setShowModal(false);
      fetchDays();
    } catch {
      setError("Could not create available day.");
    }
  };

  // ------------------------
  // Delete a day
  // ------------------------
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;

    try {
      const res = await fetch(`${API_URL}/api/AvailableDays/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setDays(days.filter((d) => d.id !== id));
    } catch {
      setError("Could not delete available day");
    }
  };

  const filtered = days.filter((d) =>
    d.date.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h1>Available Days</h1>

      <Button onClick={() => setShowModal(true)} className="me-3">
        Create Available Day
      </Button>

      <Button onClick={fetchDays} disabled={loading}>
        {loading ? "Loading..." : "Refresh"}
      </Button>

      <Form.Control
        className="mt-3"
        placeholder="Search by date (YYYY-MM-DD)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Personnel</th>
            <th>Date</th>
            <th>Start</th>
            <th>End</th>
            <th>Appointment?</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.personnelId}</td>
              <td>{d.date}</td>
              <td>{d.startTime}</td>
              <td>{d.endTime}</td>
              <td>{d.appointment ? "Booked" : "Available"}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(d.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Create modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Available Day</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Personnel ID</Form.Label>
              <Form.Control
                type="number"
                value={newDay.personnelId}
                onChange={(e) =>
                  setNewDay({ ...newDay, personnelId: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={newDay.date}
                onChange={(e) =>
                  setNewDay({ ...newDay, date: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                value={newDay.startTime}
                onChange={(e) =>
                  setNewDay({ ...newDay, startTime: e.target.value + ":00" })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                value={newDay.endTime}
                onChange={(e) =>
                  setNewDay({ ...newDay, endTime: e.target.value + ":00" })
                }
              />
            </Form.Group>

            <Button className="mt-3" onClick={handleCreate}>
              Create Day
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AvailableDaysPage;
