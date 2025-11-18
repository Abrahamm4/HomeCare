import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PatientForm from './PatientForm';
import type { Patient } from '../types/Patient';
import * as PatientService from './PatientService';

const PatientUpdatePage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        if (!patientId) {
          setError('No patient id provided');
          setLoading(false);
          return;
        }
        const data = await PatientService.fetchPatientById(patientId);
        setPatient(data);
      } catch (error) {
        setError('Failed to fetch patient');
        console.error('There was a problem with the fetch operation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId]);

  const handlePatientUpdated = async (updated: Patient) => {
    try {
      const data = await PatientService.updatePatient(Number(patientId), updated);
      console.log('Patient updated successfully:', data);
      navigate('/patients');
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!patient) return <p>No patient found</p>;

  return (
    <div>
      <h2>Update Patient</h2>
      <PatientForm
        onPatientChanged={handlePatientUpdated}
        patientId={patient.patientId}
        isUpdate={true}
        initialData={patient}
      />
    </div>
  );
};

export default PatientUpdatePage;
