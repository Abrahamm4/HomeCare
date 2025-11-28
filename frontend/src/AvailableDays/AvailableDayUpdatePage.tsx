import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert } from "react-bootstrap";
import AvailableDaysForm from "./AvailableDayForm";
import type { AvailableDay, AvailableDayInput } from "../types/AvailableDay";
import type { Personnel } from "../types/Personnel";
import * as AvailableDayService from "./AvailableDayService";
import * as PersonnelService from "../Personnel/PersonnelService";

const AvailableDayUpdatePage: React.FC = () => {
  const { availableDayId } = useParams<{ availableDayId: string }>();
  const navigate = useNavigate();

  const [day, setDay] = useState<AvailableDay | null>(null);
  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setError(null);

      try {
        if (!availableDayId) {
          setError("No Available Day ID provided");
          setLoading(false);
          return;
        }

        const [dayData, personnelList] = await Promise.all([
          AvailableDayService.fetchAvailableDayById(Number(availableDayId)),
          PersonnelService.fetchPersonnels(),
        ]);

        setDay(dayData);
        setPersonnels(personnelList);
      } catch (err) {
        console.error("Failed to fetch available day:", err);

        if (err instanceof Error) setError(err.message);
        else setError("Failed to fetch available day");
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [availableDayId]);

  const handleAvailableDayUpdated = async (dayInput: AvailableDayInput) => {
    setError(null);

    try {
      if (!availableDayId) {
        setError("Missing availableDayId");
        return;
      }

      await AvailableDayService.updateAvailableDay(
        Number(availableDayId),
        dayInput
      );

      navigate("/availabledays");
    } catch (err) {
      console.error("Failed to update Available Day:", err);

      if (err instanceof Error) setError(err.message);
      else
        setError(
          "An unexpected error occurred while updating the available day."
        );
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Update Available Day</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {!day ? (
        <p>No Available Day found</p>
      ) : (
        <AvailableDaysForm
          isUpdate={true}
          initialData={day}
          onAvailableDayChanged={handleAvailableDayUpdated}
          personnels={personnels}
        />
      )}
    </div>
  );
};

export default AvailableDayUpdatePage;
