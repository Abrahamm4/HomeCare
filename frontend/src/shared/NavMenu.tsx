import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";

const NavMenu: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          HomeCare
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>

            {isLoggedIn && (user?.role === "Admin" || user?.role === "Personnel") && (
              <Nav.Link as={Link} to="/availabledays">
                Available Days
              </Nav.Link>
            )}

            {isLoggedIn && (user?.role === "Admin" || user?.role === "Patient") && (
              <Nav.Link as={Link} to="/appointment">
                Appointments
              </Nav.Link>
            )}

            {isLoggedIn && user?.role === "Admin" && (
              <>
                <Nav.Link as={Link} to="/patients">
                  Patients
                </Nav.Link>
                <Nav.Link as={Link} to="/personnels">
                  Personnel
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {isLoggedIn ? (
              <>
                <Navbar.Text className="me-2">
                  Signed in as: {user?.sub} ({user?.role})
                </Navbar.Text>
                <Button variant="outline-light" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavMenu;