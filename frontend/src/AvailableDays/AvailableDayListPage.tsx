import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import type { AvailableDay } from "../types/AvailableDay";
import * as AvailableDayService from "./AvailableDayService";
import AvailableDayTable from "./AvailableDayTable";
import { useAuth } from "../Auth/AuthContext";

const AvailableDayListPage: React.FC = () => {
  const navigate = useNavigate();
  
  const { isLoggedIn, user } = useAuth();

  const [days, setDays] = useState<AvailableDay[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [showOnlyFree, setShowOnlyFree] = useState(false);
  const [showPersonnel, setShowPersonnel] = useState(true);
  const [showTimes, setShowTimes] = useState(true);

  const fetchDays = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await AvailableDayService.fetchAvailableDays();
      const filtered = showOnlyFree ? data.filter((d) => !d.isBooked) : data;
      setDays(filtered);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to fetch available days.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchDays();
  }, [showOnlyFree]);

  const filteredDays = days.filter((d) => {
    const q = searchQuery.toLowerCase();
    return (
      d.date.toLowerCase().includes(q) ||
      d.personnel?.name.toLowerCase().includes(q)
    );
  });

  const handleDayDeleted = async (id: number) => {

    // Block delete for patient
    if (user?.role === "Patient") {
      setError("Patients cannot delete available days.");
      return;
    }

    if (!window.confirm(`Delete slot ${id}?`)) return;

    try {
      await AvailableDayService.deleteAvailableDay(id);
      setDays((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to delete available day.");
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
        {loading ? "Loading..." : "Refresh Available Days"}
      </Button>

      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by date or personnel name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Form.Group>

      <div className="mb-3 d-flex flex-wrap gap-2">
        <Button
          onClick={() => setShowTimes((prev) => !prev)}
          className="btn btn-secondary"
        >
          {showTimes ? "Hide Times" : "Show Times"}
        </Button>

        <Button
          onClick={() => setShowPersonnel((prev) => !prev)}
          className="btn btn-secondary"
        >
          {showPersonnel ? "Hide Personnel" : "Show Personnel"}
        </Button>

        <Button
          onClick={() => setShowOnlyFree((prev) => !prev)}
          className="btn btn-secondary"
        >
          {showOnlyFree ? "Show Booked" : "Hide Booked"}
        </Button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <AvailableDayTable
        days={filteredDays}
        onDayDeleted={handleDayDeleted}
        showPersonnel={showPersonnel}
        showTimes={showTimes}
      />

      {/* Hide add button for patient */}
      {isLoggedIn && user?.role !== "Patient" && (
        <Button
          className="btn btn-primary mb-3 me-2"
          onClick={() => navigate("/availabledays/create")}
        >
          Add New Available Day
        </Button>
      )}
    </div>
  );
};

export default AvailableDayListPage;
