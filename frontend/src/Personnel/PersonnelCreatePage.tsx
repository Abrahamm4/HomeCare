import React from "react";
import { useNavigate } from "react-router-dom";
import PersonnelForm from "./PersonnelForm";
import type { Personnel } from "../types/Personnel";
import * as PersonnelService from "./PersonnelService";

const PersonnelCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const handlePersonnelCreated = async (personnel: Personnel) => {
    try {
      const data = await PersonnelService.createPersonnel(personnel);
      console.log("Personnel created successfully:", data);
      navigate("/personnels"); // tilsvarer '/patients' for liste
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  return (
    <div>
      <h2>Create New Personnel</h2>
      <PersonnelForm onPersonnelChanged={handlePersonnelCreated} />
    </div>
  );
};

export default PersonnelCreatePage;
