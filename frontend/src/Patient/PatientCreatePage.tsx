import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";
import PatientForm from "./PatientForm";
import type { Patient } from "../types/Patient";
import * as PatientService from "./PatientService";

const PatientCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handlePatientCreated = async (patient: Patient) => {
    setError(null);

    try {
      const data = await PatientService.createPatient(patient);
      console.log("Patient created successfully:", data);
      navigate("/patients"); // back to list
    } catch (err) {
      console.error("There was a problem with the fetch operation:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred while creating the patient.");
      }
    }
  };

  return (
    <div>
      <h2>Create New Patient</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <PatientForm onPatientChanged={handlePatientCreated} />
    </div>
  );
};

export default PatientCreatePage;

