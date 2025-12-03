import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert } from "react-bootstrap";
import PatientForm from "./PatientForm";
import type { Patient } from "../types/Patient";
import * as PatientService from "./PatientService";

const PatientUpdatePage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      setError(null);

      try {
        if (!patientId) {
          setError("No patient ID provided");
          setLoading(false);
          return;
        }

        const data = await PatientService.fetchPatientById(patientId);
        setPatient(data);
      } catch (err) {
        console.error("Failed to fetch patient:", err);

        if (err instanceof Error) setError(err.message);
        else setError("Failed to fetch patient");
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId]);

  const handlePatientUpdated = async (updated: Patient) => {
    setError(null);
    try {
      await PatientService.updatePatient(Number(patientId), updated);
      navigate("/patients");
    } catch (err) {
      console.error("Failed to update patient:", err);

      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred while updating the patient.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Update Patient</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {!patient ? (
        <p>No patient found</p>
      ) : (
        <PatientForm
          onPatientChanged={handlePatientUpdated}
          patientId={patient.patientId}
          isUpdate={true}
          initialData={patient}
        />
      )}
    </div>
  );
};

export default PatientUpdatePage;
