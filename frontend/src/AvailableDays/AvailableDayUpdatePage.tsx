import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AvailableDaysForm from './AvailableDayForm';
import type { AvailableDay } from '../types/AvailableDay';
import * as AvailableDayService from './AvailableDayService';

const AvailableDayUpdatePage: React.FC = () => {
  const { availableDayId } = useParams<{ availableDayId: string }>();
  const navigate = useNavigate();
  const [day, setAvailableDay] = useState<AvailableDay | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDay = async () => {
      try {
        if (!availableDayId) {
          setError('No AvailableDay id provided');
          setLoading(false);
          return;
        }
        const data = await AvailableDayService.fetchAvailableDayById(Number(availableDayId));
        setAvailableDay(data);
      } catch (error) {
        setError('Failed to fetch AvailableDay');
        console.error('There was a problem with the fetch operation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDay();
  }, [availableDayId]);

  const handleAvailableDayUpdated = async (updated: AvailableDay) => {
    try {
      const data = await AvailableDayService.updateAvailableDay(Number(availableDayId), updated);
      console.log('AvailableDay updated successfully:', data);
      navigate('/AvailableDays');
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!day) return <p>No AvailableDay found</p>;

  return (
    <div>
      <h2>Update AvailableDay</h2>
      <AvailableDaysForm
        onAvailableDayChanged={handleAvailableDayUpdated}
        availableDayId={day.id}
        isUpdate={true}
        initialData={day}
      />
    </div>
  );
};

export default AvailableDayUpdatePage;
