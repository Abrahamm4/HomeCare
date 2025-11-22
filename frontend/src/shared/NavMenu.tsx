//currently unedited style
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

const NavMenu: React.FC = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand href="/">HomeCare</Navbar.Brand>

        <Navbar.Toggle aria-controls="nav" />

        <Navbar.Collapse id="nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/appointment">Appointment</Nav.Link>
            <Nav.Link href="/availabledays">Available Days</Nav.Link>
            <Nav.Link href="/patients">Patients</Nav.Link>
            <Nav.Link href="/personnels">Personnel</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavMenu;
