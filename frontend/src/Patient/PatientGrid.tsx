import React from 'react';
import { Card, Col, Row, Button } from 'react-bootstrap';
import type { Patient } from './PatientService';

interface PatientGridProps {
  patients: Patient[];
  onPatientDeleted?: (patientId: number) => void;
}

const PatientGrid: React.FC<PatientGridProps> = ({
  patients,
  onPatientDeleted,
}) => {
  return (
    <div>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {patients.map((patient) => (
          <Col key={patient.patientId}>
            <Card className="h-100">
              <Card.Body className="d-flex flex-column">
                <Card.Title>
                  {patient.patientId}: {patient.name}
                </Card.Title>
                <Card.Text>
                  <strong>Phone:</strong> {patient.phone || '-'}
                </Card.Text>
                <Card.Text>
                  <strong>Email:</strong> {patient.email || '-'}
                </Card.Text>
                <div className="mt-auto d-flex justify-content-end gap-2">
                  {onPatientDeleted && (
                    <>
                      <Button
                        href={`/patientupdate/${patient.patientId}`}
                        variant="primary"
                      >
                        Update
                      </Button>
                      <Button
                        onClick={() =>
                          patient.patientId &&
                          onPatientDeleted(patient.patientId)
                        }
                        variant="danger"
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default PatientGrid;
