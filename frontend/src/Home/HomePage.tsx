import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';

const HomePage: React.FC=() => {
    const navigate=useNavigate();
    return (
        <Container>
            <h1>HomeCare Appointment</h1>
            <Row>
                {/*Card?*/}
                <Col>
                <Card>
                <Card.Body>
                <Card.Title>Available Days</Card.Title>
                <Card.Text>View current available days, create new ones</Card.Text>
                <Button onClick={()=>navigate("/available-days")}
                    >Go to Available Days
                </Button>
                </Card.Body>
                </Card>
                </Col>

            </Row>

            <ul>
                <li>AvailableDays</li>
            </ul>
        </Container>
    )
}
export default HomePage;