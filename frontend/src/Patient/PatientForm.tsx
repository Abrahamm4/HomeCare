import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import type { Patient } from '../types/Patient';

interface PatientFormProps {
  onPatientChanged: (newPatient: Patient) => void;
  patientId?: number;
  isUpdate?: boolean;
  initialData?: Patient;
}

const PatientForm: React.FC<PatientFormProps> = ({
  onPatientChanged,
  patientId,
  isUpdate = false,
  initialData,
}) => {
  const [name, setName] = useState<string>(initialData?.name || '');
  const [phone, setPhone] = useState<string>(initialData?.phone || '');
  const [email, setEmail] = useState<string>(initialData?.email || '');
  const navigate = useNavigate();

  const onCancel = () => {
    navigate(-1);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const patient: Patient = {
      patientId,
      name,
      phone: phone || null,
      email: email || null,
    };

    onPatientChanged(patient);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formPatientName" className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter patient name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={50}
          pattern="[0-9a-zA-ZæøåÆØÅ. \-]{2,50}"
          title="The Name must be numbers or letters and between 2 to 50 characters."
        />
      </Form.Group>

      <Form.Group controlId="formPatientPhone" className="mb-3">
        <Form.Label>Phone</Form.Label>
        <Form.Control
          type="tel"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formPatientEmail" className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        {isUpdate ? 'Update Patient' : 'Create Patient'}
      </Button>
      <Button variant="secondary" onClick={onCancel} className="ms-2">
        Cancel
      </Button>
    </Form>
  );
};

export default PatientForm;
