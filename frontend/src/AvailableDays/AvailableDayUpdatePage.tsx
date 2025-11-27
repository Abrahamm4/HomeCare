import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AvailableDaysForm from './AvailableDayForm';
import type { AvailableDay, AvailableDayInput } from '../types/AvailableDay';
import type { Personnel } from '../types/Personnel';
import * as AvailableDayService from './AvailableDayService';
import * as PersonnelService from '../Personnel/PersonnelService';

const AvailableDayUpdatePage: React.FC = () => {
  const { availableDayId } = useParams<{ availableDayId: string }>();
  const navigate = useNavigate();

  const [day, setDay] = useState<AvailableDay | null>(null);
  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!availableDayId) {
          setError("No ID provided");
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
        console.error(err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [availableDayId]);

  const handleAvailableDayUpdated = async (dayInput: AvailableDayInput) => {
    try {
      if (!availableDayId) return;
      await AvailableDayService.updateAvailableDay(Number(availableDayId), dayInput);
      navigate('/availabledays');
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!day) return <p>No AvailableDay found</p>;

  return (
    <div>
      <h2>Update Available Day</h2>
      <AvailableDaysForm
        isUpdate={true}
        initialData={day}
        onAvailableDayChanged={handleAvailableDayUpdated}
        personnels={personnels}
      />
    </div>
  );
};

export default AvailableDayUpdatePage;
