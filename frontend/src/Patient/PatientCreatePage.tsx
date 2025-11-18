import React from 'react';
import { useNavigate } from 'react-router-dom';
import PatientForm from './PatientForm';
import type { Patient } from './PatientService';
import * as PatientService from './PatientService';

const PatientCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const handlePatientCreated = async (patient: Patient) => {
    try {
      const data = await PatientService.createPatient(patient);
      console.log('Patient created successfully:', data);
      navigate('/patients');
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  return (
    <div>
      <h2>Create New Patient</h2>
      <PatientForm onPatientChanged={handlePatientCreated} />
    </div>
  );
};

export default PatientCreatePage;
