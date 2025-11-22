import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import type { AvailableDay } from "../types/AvailableDay";
import * as AvailableDayService from "./AvailableDayService";
import AvailableDayTable from "./AvailableDayTable";

const AvailableDayListPage: React.FC = () => {
  const [days, setDays] = useState<AvailableDay[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchDays = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await AvailableDayService.fetchAvailableDays();
      setDays(data);
      console.log(data);
    } catch (error: unknown) {
      console.error(error);
      setError("Failed to fetch available days.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDays();
  }, []);

const filteredDays = days.filter((d) => {
  const q = searchQuery.trim().toLowerCase();

  if (/^\d$/.test(q)) {
    return d.personnelId === Number(q);
  }

  return d.date.toLowerCase().includes(q);
});

  const handleDayDeleted = async (id: number) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete AvailableDay ${id}?`
    );
    if (!confirmDelete) return;

    try {
      await AvailableDayService.deleteAvailableDay(id);
      setDays((prev) => prev.filter((d) => d.id !== id));
      console.log("Deleted AvailableDay:", id);
    } catch (error) {
      console.error("Error deleting AvailableDay:", error);
      setError("Failed to delete AvailableDay.");
    }
  };

  return (
    <div>
      <h1>Available Days</h1>

      <Button
        onClick={fetchDays}
        className="btn btn-primary mb-3 me-2"
        disabled={loading}
      >
        {loading ? "Loading..." : "Refresh"}
      </Button>

      <Form.Group className="mb-3">
        <Form.Control
          id="availableDaySearch"
          type="text"
          name="availableDaySearch"
          placeholder="Search by date or personnel ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Form.Group>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <AvailableDayTable
        days={filteredDays}
        onDayDeleted={handleDayDeleted}
      />

      <Button href="/availabledayscreate" className="btn btn-secondary mt-3">
        Add New Available Day
      </Button>
    </div>
  );
};

export default AvailableDayListPage;
