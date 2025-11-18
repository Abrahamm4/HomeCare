import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import PersonnelTable from "./PersonnelTable";
import type { Personnel } from "../types/Personnel";
import * as PersonnelService from "./PersonnelService";

const PersonnelListPage: React.FC = () => {
  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchPersonnels = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await PersonnelService.fetchPersonnels();
      setPersonnels(data);
      console.log(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `There was a problem with the fetch operation: ${error.message}`
        );
      } else {
        console.error("Unknown error", error);
      }
      setError("Failed to fetch personnel.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonnels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredPersonnels = personnels.filter((p) =>
    (p.name?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const handlePersonnelDeleted = async (personnelId: number) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the personnel ${personnelId}?`
    );
    if (!confirmDelete) return;

    try {
      await PersonnelService.deletePersonnel(personnelId);
      setPersonnels((prev) => prev.filter((p) => p.id !== personnelId));
      console.log("Personnel deleted:", personnelId);
    } catch (error) {
      console.error("Error deleting personnel:", error);
      setError("Failed to delete personnel.");
    }
  };

  return (
    <div>
      <h1>Personnel</h1>

      <Button
        onClick={fetchPersonnels}
        className="btn btn-primary mb-3 me-2"
        disabled={loading}
      >
        {loading ? "Loading..." : "Refresh Personnel"}
      </Button>

      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Form.Group>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <PersonnelTable
        personnels={filteredPersonnels}
        onPersonnelDeleted={handlePersonnelDeleted}
      />

      <Button href="/personnelcreate" className="btn btn-secondary mt-3">
        Add New Personnel
      </Button>
    </div>
  );
};

export default PersonnelListPage;
