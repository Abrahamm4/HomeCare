import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AvailableDaysForm from './AvailableDayForm';
import type { AvailableDay, AvailableDayInput } from '../types/AvailableDay';
import * as AvailableDayService from './AvailableDayService';

const AvailableDayUpdatePage: React.FC = () => {
  const { availableDayId } = useParams<{ availableDayId: string }>();
  const navigate = useNavigate();

  const [day, setDay] = useState<AvailableDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (!availableDayId) {
          setError("No ID provided");
          setLoading(false);
          return;
        }

        const data = await AvailableDayService.fetchAvailableDayById(Number(availableDayId));
        setDay(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load AvailableDay");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [availableDayId]);

  const handleAvailableDayUpdated = async (dayInput: AvailableDayInput) => {
    try {
      if (!availableDayId) return;
      const updated = await AvailableDayService.updateAvailableDay(Number(availableDayId), dayInput);
      console.log("Updated successfully:", updated);
      navigate('/availabledays');
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error) return <p>{error}</p>;
  if (!day) return <p>No AvailableDay found</p>;

  return (
    <div>
      <h2>Update Available Day</h2>
      <AvailableDaysForm
        isUpdate={true}
        initialData={day}
        onAvailableDayChanged={handleAvailableDayUpdated}
      />
    </div>
  );
};

export default AvailableDayUpdatePage;
