import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';

const HomePage: React.FC=() => {
    const navigate=useNavigate();
    return (
        <Container className="mt-5 text-center">
            <h1 className="text-center">HomeCare Appointment</h1>
            <Row>
                {/*Appointments Card*/}
                <Col>
                <Card>
                <Card.Body>
                <Card.Title>Book Appointment</Card.Title>
                <Card.Text>Look through appointments and book</Card.Text>
                <Button onClick={()=>navigate("/appointment")}
                    >Go to Appointments
                </Button>
                </Card.Body>
                </Card>
                </Col>
                {/*Available Day card*/}
                <Col>
                <Card>
                <Card.Body>
                <Card.Title>Available Days</Card.Title>
                <Card.Text>View current available days, create new ones</Card.Text>
                <Button onClick={()=>navigate("/availabledays")}
                    >Go to Available Days
                </Button>
                </Card.Body>
                </Card>
                </Col>

            </Row>
        </Container>
    )
}
export default HomePage;