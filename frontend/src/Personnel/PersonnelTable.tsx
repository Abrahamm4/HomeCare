import React from "react";
import { Button, Table } from "react-bootstrap";
import type { Personnel } from "../types/Personnel";

interface PersonnelTableProps {
  personnels: Personnel[];
  onPersonnelDeleted: (id: number) => void;
}

const PersonnelTable: React.FC<PersonnelTableProps> = ({
  personnels,
  onPersonnelDeleted,
}) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th style={{ width: "220px" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {personnels.map((p) => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.name}</td>
            <td>
              <Button
                href={`/personnelupdate/${p.id}`}
                className="btn btn-primary me-2"
              >
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => onPersonnelDeleted(p.id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
        {personnels.length === 0 && (
          <tr>
            <td colSpan={3} className="text-center">
              No personnel found.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default PersonnelTable;
