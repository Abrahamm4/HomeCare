import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { AvailableDay } from '../types/AvailableDay';
import * as AvailableDayService from './AvailableDayService';
import { Button } from 'react-bootstrap';

const AvailableDayDeletePage: React.FC = () => {
  const { availableDayId } = useParams<{ availableDayId: string }>();
  const navigate = useNavigate();

  const [day, setDay] = useState<AvailableDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadDay = async () => {
      try {
        if (!availableDayId) {
          setError('No ID provided');
          setLoading(false);
          return;
        }
        // Fetch available day (personnel info included via service)
        const data = await AvailableDayService.fetchAvailableDayById(Number(availableDayId));
        setDay(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load available day');
      } finally {
        setLoading(false);
      }
    };
    loadDay();
  }, [availableDayId]);

  const handleDelete = async () => {
    if (!day) return;
    if (!window.confirm(`Are you sure you want to delete slot ${day.id}?`)) return;

    try {
      setDeleting(true);
      await AvailableDayService.deleteAvailableDay(day.id);
      navigate('/availabledays');
    } catch (err) {
      console.error(err);
      setError('Failed to delete available day');
      setDeleting(false);
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!day) return <p>No AvailableDay found</p>;

  return (
    <div>
      <h2>Delete Available Day</h2>
      <p>Are you sure you want to delete this available day?</p>
      <p><strong>Id:</strong> {day.id}</p>
      <p><strong>Personnel:</strong> {day.personnel?.name || 'Unknown'}</p>
      <p><strong>Date:</strong> {day.date.split('T')[0]}</p>
      <p><strong>Start Time:</strong> {day.startTime}</p>
      <p><strong>End Time:</strong> {day.endTime}</p>

      <div className="d-flex flex-wrap gap-2 mt-3">
        <Button variant="danger" size="sm" onClick={handleDelete} disabled={deleting}>
          {deleting ? 'Deleting…' : 'Confirm Delete'}
        </Button>
        <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AvailableDayDeletePage;
