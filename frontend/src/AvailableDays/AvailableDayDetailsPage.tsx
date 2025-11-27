import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import type { AvailableDay } from '../types/AvailableDay';
import * as AvailableDayService from './AvailableDayService';
import { Button } from 'react-bootstrap';

const AvailableDayDetailsPage: React.FC = () => {
  const { availableDayId } = useParams<{ availableDayId: string }>();
  const navigate = useNavigate();

  const [day, setDay] = useState<AvailableDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDay = async () => {
      try {
        if (!availableDayId) {
          setError('No ID provided');
          setLoading(false);
          return;
        }
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

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!day) return <p>No AvailableDay found</p>;

  return (
    <div>
      <h2>Available Day Details</h2>
      <p><strong>Id:</strong> {day.id}</p>
      <p><strong>Personnel:</strong> {day.personnel?.name || 'Unknown'}</p>
      <p><strong>Date:</strong> {day.date.split('T')[0]}</p>
      <p><strong>Start Time:</strong> {day.startTime}</p>
      <p><strong>End Time:</strong> {day.endTime}</p>
      <p><strong>Status:</strong> {day.isBooked ? 'Booked' : 'Free'}</p>

      <div className="d-flex flex-wrap gap-2 mt-3">
        <Link to={`/availabledays/edit/${day.id}`} className="btn btn-primary btn-sm">
          Edit
        </Link>
        <Link to={`/availabledays/delete/${day.id}`} className="btn btn-danger btn-sm">
          Delete
        </Link>
        <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    </div>
  );
};

export default AvailableDayDetailsPage;
