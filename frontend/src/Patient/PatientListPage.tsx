import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import PatientTable from "./PatientTable";
import type { Patient } from "../types/Patient";
import * as PatientService from "./PatientService";

const PatientListPage: React.FC = () => {
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `There was a problem with the fetch operation: ${error.message}`
        );
      } else {
        console.error("Unknown error", error);
      }
      setError("Failed to fetch patients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    } catch (error) {
      console.error("Error deleting patient:", error);
      setError("Failed to delete patient.");
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

      <Button href="/patientcreate" className="btn btn-secondary mt-3">
        Add New Patient
      </Button>
    </div>
  );
};

export default PatientListPage;
