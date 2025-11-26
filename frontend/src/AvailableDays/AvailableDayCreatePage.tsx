import React from 'react';
import { useNavigate } from 'react-router-dom';
import AvailableDaysForm from './AvailableDayForm';
import type{ AvailableDay } from '../types/AvailableDay';
import * as AvailableDayService from './AvailableDayService';

const AvailableDayCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const handleAvailableDayCreated = async (day: AvailableDay) => {
    try {
      const created = await AvailableDayService.createAvailableDay(day);
      console.log('AvailableDay created successfully:', created);
      navigate('/availabledays');
    } catch (error) {
      console.error('Create AvailableDay failed:', error);
    }
  };

  return (
    <div>
      <h2>Create New Available Day</h2>
      <AvailableDaysForm onAvailableDayChanged={handleAvailableDayCreated} />
    </div>
  );
};

export default AvailableDayCreatePage;
