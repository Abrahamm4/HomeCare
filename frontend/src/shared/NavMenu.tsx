import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";

const NavMenu: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth();
  
  console.log("NavMenu - isLoggedIn:", isLoggedIn, "user:", user);
  
  const roles = user?.role ? (Array.isArray(user.role) ? user.role : [user.role]) : [];
  const roleLabel = roles.length > 0 ? roles.join(", ") : "";

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          HomeCare
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="nav" />

        <Navbar.Collapse id="nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/appointment">
              Appointment
            </Nav.Link>
            <Nav.Link as={Link} to="/availabledays">
              Available Days
            </Nav.Link>
            <Nav.Link as={Link} to="/patients">
              Patients
            </Nav.Link>
            <Nav.Link as={Link} to="/personnels">
              Personnel
            </Nav.Link>
          </Nav>

          <Nav className="ms-auto">
            {!isLoggedIn ? (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            ) : (
              <>
                <Navbar.Text className="me-2">
                  Logged in as: <strong>{user?.sub}</strong>
                  {roleLabel && <> <em>({roleLabel})</em></>}
                </Navbar.Text>
                <Nav.Link onClick={logout}>Logout</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavMenu;