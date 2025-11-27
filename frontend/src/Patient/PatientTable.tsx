import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import type { Patient } from "../types/Patient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";

interface PatientTableProps {
  patients: Patient[];
  onPatientDeleted?: (patientId: number) => void;
}

const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  onPatientDeleted,
}) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [showPhone, setShowPhone] = useState<boolean>(true);
  const [showEmail, setShowEmail] = useState<boolean>(true);

  const togglePhone = () => setShowPhone((prev) => !prev);
  const toggleEmail = () => setShowEmail((prev) => !prev);

  return (
    <div>
      <Button onClick={togglePhone} className="btn btn-secondary mb-3 me-2">
        {showPhone ? "Hide Phone" : "Show Phone"}
      </Button>

      <Button onClick={toggleEmail} className="btn btn-secondary mb-3">
        {showEmail ? "Hide Email" : "Show Email"}
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            {showPhone && <th>Phone</th>}
            {showEmail && <th>Email</th>}
            {isLoggedIn && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {patients.map((patient) => (
            <tr key={patient.patientId}>
              <td>{patient.patientId}</td>
              <td>{patient.name}</td>

              {showPhone && <td>{patient.phone}</td>}
              {showEmail && <td>{patient.email}</td>}

              {isLoggedIn && (
                <td className="text-center">
                  {/* Update */}
                  <Button
                    className="btn btn-primary me-2"
                    onClick={() =>
                      navigate(`/patientupdate/${patient.patientId}`)
                    }
                  >
                    Edit
                  </Button>

                  {/* Delete */}
                  <Button
                    variant="danger"
                    onClick={() =>
                      patient.patientId &&
                      onPatientDeleted &&
                      onPatientDeleted(patient.patientId)
                    }
                  >
                    Delete
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default PatientTable;
