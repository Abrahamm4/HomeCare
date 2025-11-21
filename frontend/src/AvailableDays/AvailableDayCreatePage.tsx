import React from 'react';
import { useNavigate } from 'react-router-dom';
import AvailableDaysForm from './AvailableDayForm';
import type{ AvailableDay } from '../types/AvailableDay';
import * as AvailableDayService from './AvailableDayService';

const AvailableDayCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const handleAvailableDayCreated = async (AvailableDay: AvailableDay) => {
    try {
      const data = await AvailableDayService.createAvailableDay(AvailableDay);
      console.log('AvailableDay created successfully:', data);
      navigate('/AvailableDays'); // tilbake til liste
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  return (
    <div>
      <h2>Create New AvailableDay</h2>
      <AvailableDaysForm onAvailableDayChanged={handleAvailableDayCreated} />
    </div>
  );
};

export default AvailableDayCreatePage;
