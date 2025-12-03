import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";
import PersonnelForm from "./PersonnelForm";
import type { Personnel } from "../types/Personnel";
import * as PersonnelService from "./PersonnelService";

const PersonnelCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handlePersonnelCreated = async (personnel: Personnel) => {
    setError(null);

    try {
      const data = await PersonnelService.createPersonnel(personnel);
      console.log("Personnel created successfully:", data);
      navigate("/personnels"); // back to list
    } catch (err) {
      console.error("There was a problem with the fetch operation:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred while creating the personnel.");
      }
    }
  };

  return (
    <div>
      <h2>Create New Personnel</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <PersonnelForm onPersonnelChanged={handlePersonnelCreated} />
    </div>
  );
};

export default PersonnelCreatePage;
