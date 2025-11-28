import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button } from "react-bootstrap";
import type { AvailableDay } from "../types/AvailableDay";
import * as AvailableDayService from "./AvailableDayService";

const AvailableDayDeletePage: React.FC = () => {
  const { availableDayId } = useParams<{ availableDayId: string }>();
  const navigate = useNavigate();

  const [day, setDay] = useState<AvailableDay | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    const loadDay = async () => {
      setError(null);

      try {
        if (!availableDayId) {
          setError("No available day ID provided");
          setLoading(false);
          return;
        }

        const data = await AvailableDayService.fetchAvailableDayById(
          Number(availableDayId)
        );
        setDay(data);
      } catch (err) {
        console.error("Failed to fetch available day:", err);

        if (err instanceof Error) setError(err.message);
        else setError("Failed to load available day");
      } finally {
        setLoading(false);
      }
    };

    void loadDay();
  }, [availableDayId]);

  const handleDelete = async () => {
    if (!day) return;
    if (!window.confirm(`Are you sure you want to delete slot ${day.id}?`)) return;

    try {
      setDeleting(true);
      await AvailableDayService.deleteAvailableDay(day.id);
      navigate("/availabledays");
    } catch (err) {
      console.error("Failed to delete:", err);

      if (err instanceof Error) setError(err.message);
      else setError("Failed to delete available day.");
      setDeleting(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Delete Available Day</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {!day ? (
        <p>No Available Day found</p>
      ) : (
        <>
          <p>Are you sure you want to delete this available day?</p>

          <p>
            <strong>ID:</strong> {day.id}
          </p>
          <p>
            <strong>Personnel:</strong> {day.personnel?.name || "Unknown"}
          </p>
          <p>
            <strong>Date:</strong> {day.date.split("T")[0]}
          </p>
          <p>
            <strong>Start Time:</strong> {day.startTime}
          </p>
          <p>
            <strong>End Time:</strong> {day.endTime}
          </p>

          <div className="d-flex flex-wrap gap-2 mt-3">
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Confirm Delete"}
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AvailableDayDeletePage;
