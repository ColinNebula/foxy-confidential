import React from 'react'
import { Card, Container, Button, Col, Row } from 'react-bootstrap';

function Blog () {
  return (
    <Container fluid>
      <Row>
        <Col>
          <div>
    <h2 class="blog_top">Welcome to my blog</h2>
    <p class="p_top"> Lorem ipsum dolor sit amet, consectetur adipiscing</p>

    <Card style={{ width: 'auto' }}>
    <Card.Body>
      <Card.Title>Card Title</Card.Title>
      <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
      <Card.Text>
        Some quick example text to build on the card title and make up the
        bulk of the cards content.
        Lorem ipsum dolor sit amet, consectet lorem ugsufops sois pj.o ifosifo. jefsuluf
        fjfhhf kfkklfkhbipei .jffhyehjkeuesru fjif efj  efeif jfjleo alot-rkjfjsef .
        yhsfefhfkhf efjfjfe efj f jf fj efokj fo
      </Card.Text>
      <Card.Link href="#">Card Link</Card.Link>
      <Card.Link href="#">Another Link</Card.Link>
    </Card.Body>
  </Card>
          </div>
          
        </Col>
      </Row>
    </Container>
  )
}

export default Blog;