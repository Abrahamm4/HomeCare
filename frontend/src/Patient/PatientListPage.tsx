import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PatientTable from "./PatientTable";
import type { Patient } from "../types/Patient";
import * as PatientService from "./PatientService";
import { useAuth } from "../Auth/AuthContext";

const PatientListPage: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await PatientService.fetchPatients();
      setPatients(data);
      console.log(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(
          `There was a problem with the fetch operation: ${err.message}`
        );
        setError(err.message);
      } else {
        console.error("Unknown error", err);
        setError("Failed to fetch patients.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchPatients();
  }, []);

  const filteredPatients = patients.filter((p) =>
    (
      (p.name?.toLowerCase() || "") +
      " " +
      (p.phone || "") +
      " " +
      (p.email || "")
    ).includes(searchQuery.toLowerCase())
  );

  const handlePatientDeleted = async (patientId: number) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the patient ${patientId}?`
    );
    if (!confirmDelete) return;

    try {
      await PatientService.deletePatient(patientId);
      setPatients((prev) => prev.filter((p) => p.patientId !== patientId));
      console.log("Patient deleted:", patientId);
    } catch (err) {
      console.error("Error deleting patient:", err);
      if (err instanceof Error) setError(err.message);
      else setError("Failed to delete patient.");
    }
  };

  return (
    <div>
      <h1>Patients</h1>

      <Button
        onClick={fetchPatients}
        className="btn btn-primary mb-3 me-2"
        disabled={loading}
      >
        {loading ? "Loading..." : "Refresh Patients"}
      </Button>

      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by name, phone or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Form.Group>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <PatientTable
        patients={filteredPatients}
        onPatientDeleted={handlePatientDeleted}
      />

      {isLoggedIn && (
        <Button
          variant="secondary"
          className="mt-3"
          onClick={() => navigate("/patientcreate")}
        >
          Add New Patient
        </Button>
      )}
    </div>
  );
};

export default PatientListPage;
