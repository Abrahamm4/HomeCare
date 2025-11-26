import React from "react";
import { Button, Table } from "react-bootstrap";
import type { Personnel } from "../types/Personnel";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";

interface PersonnelTableProps {
  personnels: Personnel[];
  onPersonnelDeleted: (id: number) => void;
}

const PersonnelTable: React.FC<PersonnelTableProps> = ({
  personnels,
  onPersonnelDeleted,
}) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
          {isLoggedIn && <th style={{ width: "220px" }}>Actions</th>}
        </tr>
      </thead>

      <tbody>
        {personnels.map((p) => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.name}</td>

            {isLoggedIn && (
              <td className="text-center">
                {/* Edit */}
                <Button
                  className="btn btn-primary me-2"
                  onClick={() => navigate(`/personnelupdate/${p.id}`)}
                >
                  Edit
                </Button>

                {/* Delete */}
                <Button variant="danger" onClick={() => onPersonnelDeleted(p.id)}>
                  Delete
                </Button>
              </td>
            )}
          </tr>
        ))}

        {personnels.length === 0 && (
          <tr>
            <td colSpan={isLoggedIn ? 3 : 2} className="text-center">
              No personnel found.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default PersonnelTable;
