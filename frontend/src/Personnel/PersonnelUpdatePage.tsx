import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PersonnelForm from "./PersonnelForm";
import type { Personnel } from "../types/Personnel";
import * as PersonnelService from "./PersonnelService";

const PersonnelUpdatePage: React.FC = () => {
  const { personnelId } = useParams<{ personnelId: string }>();
  const navigate = useNavigate();
  const [personnel, setPersonnel] = useState<Personnel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPersonnel = async () => {
      try {
        if (!personnelId) {
          setError("No personnel id provided");
          setLoading(false);
          return;
        }
        const data = await PersonnelService.fetchPersonnelById(personnelId);
        setPersonnel(data);
      } catch (error) {
        setError("Failed to fetch personnel");
        console.error(
          "There was a problem with the fetch operation:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPersonnel();
  }, [personnelId]);

  const handlePersonnelUpdated = async (updated: Personnel) => {
    try {
      const data = await PersonnelService.updatePersonnel(
        Number(personnelId),
        updated
      );
      console.log("Personnel updated successfully:", data);
      navigate("/personnels");
    } catch (error) {
      console.error(
        "There was a problem with the fetch operation:",
        error
      );
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!personnel) return <p>No personnel found</p>;

  return (
    <div>
      <h2>Update Personnel</h2>
      <PersonnelForm
        onPersonnelChanged={handlePersonnelUpdated}
        personnelId={personnel.id}
        isUpdate={true}
        initialData={personnel}
      />
    </div>
  );
};

export default PersonnelUpdatePage;
