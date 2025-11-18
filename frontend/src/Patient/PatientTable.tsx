// src/patient/PatientTable.tsx
import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import type { Patient } from '../types/Patient';
import { Link } from 'react-router-dom';

interface PatientTableProps {
  patients: Patient[];
  onPatientDeleted?: (patientId: number) => void;
}

const PatientTable: React.FC<PatientTableProps> = ({ patients, onPatientDeleted }) => {
  const [showPhone, setShowPhone] = useState<boolean>(true);
  const [showEmail, setShowEmail] = useState<boolean>(true);

  const togglePhone = () => setShowPhone(prev => !prev);
  const toggleEmail = () => setShowEmail(prev => !prev);

  return (
    <div>
      <Button onClick={togglePhone} className="btn btn-secondary mb-3 me-2">
        {showPhone ? 'Hide Phone' : 'Show Phone'}
      </Button>
      <Button onClick={toggleEmail} className="btn btn-secondary mb-3">
        {showEmail ? 'Hide Email' : 'Show Email'}
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            {showPhone && <th>Phone</th>}
            {showEmail && <th>Email</th>}
            {onPatientDeleted && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {patients.map(patient => (
            <tr key={patient.patientId}>
              <td>{patient.patientId}</td>
              <td>{patient.name}</td>
              {showPhone && <td>{patient.phone}</td>}
              {showEmail && <td>{patient.email}</td>}
              {onPatientDeleted && (
                <td className="text-center">
                  <>
                    <Link
                      to={`/patientupdate/${patient.patientId}`}
                      className="me-2"
                    >
                      Update
                    </Link>
                    <Link
                      to="#"
                      onClick={() => patient.patientId && onPatientDeleted(patient.patientId)}
                      className="btn btn-link text-danger"
                    >
                      Delete
                    </Link>
                  </>
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
