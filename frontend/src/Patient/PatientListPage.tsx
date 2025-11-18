import React, { useEffect, useState } from "react";
import { fetchPatients, type Patient } from "./PatientService";

const PatientListPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchPatients();
        setPatients(data);
      } catch (e: any) {
        console.error(e);
        setError(e.message || "Failed to load patients");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <h2>Loading patients...</h2>;
  if (error) return <h2 style={{ color: "red" }}>{error}</h2>;

  return (
    <div>
      <h1>Patients</h1>
      {patients.length === 0 && <p>No patients found.</p>}
      <ul>
        {patients.map((p) => (
          <li key={p.patientId}>
            <strong>{p.name}</strong>
            {p.phone && <> – {p.phone}</>}
            {p.email && <> – {p.email}</>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientListPage;
