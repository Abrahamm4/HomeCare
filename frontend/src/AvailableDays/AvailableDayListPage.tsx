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

  // Column and filter toggles
  const [showOnlyFree, setShowOnlyFree] = useState(false);
  const [showPersonnel, setShowPersonnel] = useState(true);
  const [showTimes, setShowTimes] = useState(true);

  const navigate = useNavigate();

  const fetchDays = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await AvailableDayService.fetchAvailableDays();
      setDays(showOnlyFree ? data.filter(d => !d.isBooked) : data);
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

  const filteredDays = days.filter(d => {
    const q = searchQuery.trim().toLowerCase();
    return (
      d.date.toLowerCase().includes(q) ||
      d.personnel?.name.toLowerCase().includes(q)
    );
  });

  const handleDayDeleted = async (id: number) => {
    if (!window.confirm(`Delete slot ${id}?`)) return;
    try {
      await AvailableDayService.deleteAvailableDay(id);
      setDays(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete available day.");
    }
  };

  return (
    <div>
      <h1>Available Days</h1>

      <div className="mb-3 d-flex flex-wrap gap-2">
        <Button
          variant="primary"
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

      <Form.Control
        className="mb-3"
        type="text"
        placeholder="Search by date or personnel name"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />

      <div className="mb-3 d-flex flex-wrap gap-2">
  <Button
    onClick={() => setShowTimes(prev => !prev)}
    className="btn btn-secondary mb-3 me-2"
  >
    {showTimes ? "Hide Times" : "Show Times"}
  </Button>

  <Button
    onClick={() => setShowPersonnel(prev => !prev)}
    className="btn btn-secondary mb-3"
  >
    {showPersonnel ? "Hide Personnel" : "Show Personnel"}
  </Button>

  <Button
    onClick={() => setShowOnlyFree(prev => !prev)}
    className="btn btn-secondary mb-3 me-2"
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
    </div>
  );
};

export default AvailableDayListPage;
