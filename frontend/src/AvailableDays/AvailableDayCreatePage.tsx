import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";
import AvailableDaysForm from "./AvailableDayForm";
import type { AvailableDayInput } from "../types/AvailableDay";
import type { Personnel } from "../types/Personnel";
import * as AvailableDayService from "./AvailableDayService";
import * as PersonnelService from "../Personnel/PersonnelService";

const AvailableDayCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPersonnels = async () => {
      try {
        const list = await PersonnelService.fetchPersonnels();
        setPersonnels(list);
      } catch (err) {
        console.error(err);
        setError("Failed to load personnel list");
      } finally {
        setLoading(false);
      }
    };

    loadPersonnels();
  }, []);

  const handleAvailableDayCreated = async (dayInput: AvailableDayInput) => {
    setError(null);

    try {
      await AvailableDayService.createAvailableDay(dayInput);
      navigate("/availabledays"); // back to list
    } catch (err) {
      console.error("Create AvailableDay failed:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred while creating available day.");
      }
    }
  };

  if (loading) return <p>Loading personnels…</p>;

  return (
    <div>
      <h2>Create New Available Day</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <AvailableDaysForm
        onAvailableDayChanged={handleAvailableDayCreated}
        personnels={personnels}
      />
    </div>
  );
};

export default AvailableDayCreatePage;
