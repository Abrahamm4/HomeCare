import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert } from "react-bootstrap";
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
      setError(null);

      try {
        if (!personnelId) {
          setError("No personnel ID provided");
          setLoading(false);
          return;
        }

        const data = await PersonnelService.fetchPersonnelById(personnelId);
        setPersonnel(data);
      } catch (err) {
        console.error("Failed to fetch personnel:", err);

        if (err instanceof Error) setError(err.message);
        else setError("Failed to fetch personnel");
      } finally {
        setLoading(false);
      }
    };

    fetchPersonnel();
  }, [personnelId]);

  const handlePersonnelUpdated = async (updated: Personnel) => {
    setError(null);
    try {
      await PersonnelService.updatePersonnel(Number(personnelId), updated);
      navigate("/personnels");
    } catch (err) {
      console.error("Failed to update personnel:", err);

      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred while updating the personnel.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Update Personnel</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {!personnel ? (
        <p>No personnel found</p>
      ) : (
        <PersonnelForm
          onPersonnelChanged={handlePersonnelUpdated}
          personnelId={personnel.id}
          isUpdate={true}
          initialData={personnel}
        />
      )}
    </div>
  );
};

export default PersonnelUpdatePage;
