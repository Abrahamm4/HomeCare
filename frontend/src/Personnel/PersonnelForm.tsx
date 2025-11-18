import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import type { Personnel } from "../types/Personnel";

interface PersonnelFormProps {
  onPersonnelChanged: (newPersonnel: Personnel) => void;
  personnelId?: number;
  isUpdate?: boolean;
  initialData?: Personnel;
}

const PersonnelForm: React.FC<PersonnelFormProps> = ({
  onPersonnelChanged,
  personnelId,
  isUpdate = false,
  initialData,
}) => {
  const [name, setName] = useState<string>(initialData?.name || "");
  const navigate = useNavigate();

  const onCancel = () => {
    navigate(-1);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const personnel: Personnel = {
      // ved update: bruker vi personnelId eller initialData.id
      // ved create: faller vi tilbake til 0 (EF/DB genererer ekte Id)
      id: personnelId ?? initialData?.id ?? 0,
      name,
    };

    onPersonnelChanged(personnel);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formPersonnelName" className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter personnel name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={50}
          pattern="[0-9a-zA-ZæøåÆØÅ. \-]{2,50}"
          title="The Name must be numbers or letters and between 2 to 50 characters."
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        {isUpdate ? "Update Personnel" : "Create Personnel"}
      </Button>
      <Button variant="secondary" onClick={onCancel} className="ms-2">
        Cancel
      </Button>
    </Form>
  );
};

export default PersonnelForm;
