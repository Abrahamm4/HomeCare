import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import type { AvailableDay } from "../types/AvailableDay";
import * as AvailableDayService from "./AvailableDayService";
import AvailableDayTable from "./AvailableDayTable";

const AvailableDayListPage: React.FC = () => {
  const [days, setDays] = useState<AvailableDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyFree, setShowOnlyFree] = useState(false);

  const navigate = useNavigate();

  const fetchDays = async () => {
    setLoading(true);
    setError(null);
    try {
      let data = await AvailableDayService.fetchAvailableDays();
      if (showOnlyFree) data = data.filter((d) => !d.isBooked);
      setDays(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch available days.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDays();
  }, [showOnlyFree]);

  const filteredDays = days.filter((d) => {
    const q = searchQuery.trim().toLowerCase();
    return (
      d.date.toLowerCase().includes(q) ||
      d.personnelId.toString().includes(q)
    );
  });

  const handleDayDeleted = async (id: number) => {
    if (!window.confirm(`Delete slot ${id}?`)) return;
    try {
      await AvailableDayService.deleteAvailableDay(id);
      setDays((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete available day.");
    }
  };

  return (
    <div>
      <h1>Available Days</h1>

      <div className="mb-3">
        <Button
          variant="primary"
          className="me-2"
          onClick={fetchDays}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </Button>
        <Button
          variant="secondary"
          onClick={() => navigate("/availabledayscreate")}
        >
          Add New Available Day
        </Button>
      </div>

      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by date or personnel ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Form.Group>

      <Form.Check
        type="checkbox"
        label="Show only free slots"
        checked={showOnlyFree}
        onChange={(e) => setShowOnlyFree(e.target.checked)}
        className="mb-3"
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <AvailableDayTable
        days={filteredDays}
        onDayDeleted={handleDayDeleted}
      />
    </div>
  );
};

export default AvailableDayListPage;
