import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AvailableDaysForm from './AvailableDayForm';
import type { AvailableDayInput } from '../types/AvailableDay';
import type { Personnel } from '../types/Personnel';
import * as AvailableDayService from './AvailableDayService';
import * as PersonnelService from '../Personnel/PersonnelService';

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
    try {
      await AvailableDayService.createAvailableDay(dayInput);
      navigate('/availabledays');
    } catch (error) {
      console.error('Create AvailableDay failed:', error);
    }
  };

  if (loading) return <p>Loading personnels…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Create New Available Day</h2>
      <AvailableDaysForm
        onAvailableDayChanged={handleAvailableDayCreated}
        personnels={personnels}
      />
    </div>
  );
};

export default AvailableDayCreatePage;
