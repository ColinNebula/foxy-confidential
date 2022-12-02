import React from 'react'
import { Card, Container, Button, Col, Row } from 'react-bootstrap';

function Wines() {
    return (
        <Container>
            <Row>
                <Col>
                    <Card className="shadow-lg" style={{ color: "#000", width: "auto" }}>
                        <Card.Img variant="top" src="https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/07/Wine_Glasses_1296x728-header-1296x729.jpg?w=1155&h=2268/100px180" className="rounded" alt="wines" />
                        <Card.Title>Card title</Card.Title>
                        <Card.Body>
                            <Card.Text>
                                Some quick example text to build on the card title and make up the
                                bulk of the card's content.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Wines;