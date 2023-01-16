import React, { useState } from 'react'
import { Card, Container, Button, Col, Row, CardGroup, Modal } from 'react-bootstrap';

import { capitalizeFirstLetter } from '../../utils/helpers';



function Gallery() {

  const [show, setLgShow] = useState(false);

  return (
    <Container fluid>
      <Row>
      <div>
      <>

      <Modal
        show={show}
        onHide={() => setLgShow(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Custom Modal Styling
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Ipsum molestiae natus adipisci modi eligendi? Debitis amet quae unde
            commodi aspernatur enim, consectetur. Cumque deleniti temporibus
            ipsam atque a dolores quisquam quisquam adipisci possimus
            laboriosam. Quibusdam facilis doloribus debitis! Sit quasi quod
            accusamus eos quod. Ab quos consequuntur eaque quo rem! Mollitia
            reiciendis porro quo magni incidunt dolore amet atque facilis ipsum
            deleniti rem!
          </p>
          <Card.Img src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Froutenote.com%2Fblog%2Fwp-content%2Fuploads%2F2017%2F09%2FDJ.jpg&f=1&nofb=1&ipt=ddb0176cf1104a4d07576f128b48c3797be67004d74087a891a247c025d50dfa&ipo=images/100px270" className="rounded" alt="Card image" />
        </Modal.Body>
      </Modal>
    </>
      </div>
  
      <h2 class="home_top"> Welcome to Foxy Gallery</h2>
      <p class="p_top"> Lorem ipsum dolor sit amet, consectetur adipiscing</p>
        <Col>
        <CardGroup>
        <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
          <Card.Img variant="top" src="https://images.unsplash.com/photo-1556911073-52527ac43761?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDE4NXxfaGItZGw0US00VXx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60/100px160" />
          <Card.Body>
            <Card.Title>Card title</Card.Title>
            <Card.Text>
              This is a wider card with supporting text below as a natural lead-in
              to additional content. This content is a little bit longer.
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <Button variant="outline-primary" size="sm" onClick={() => setLgShow(true)}>View here</Button>{' '}
            <small className="text-muted">Last updated 3 mins ago</small>
          </Card.Footer>

        </Card>
        <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
          <Card.Img variant="top" src="https://images.unsplash.com/photo-1663264891853-a32793671359?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDc0fF9oYi1kbDRRLTRVfHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60/100px160" />
          <Card.Body>
            <Card.Title>Card title</Card.Title>
            <Card.Text>
              This card has supporting text below as a natural lead-in to
              additional content.{' '}
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <Button variant="outline-primary" size="sm" onClick={() => setLgShow(true)}>View here</Button>{' '}
            <small className="text-muted">Last updated 3 mins ago</small>
          </Card.Footer>
        </Card>
        <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
          <Card.Img variant="top" src="https://images.unsplash.com/photo-1661246458236-0c9dc2f74672?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDkxfF9oYi1kbDRRLTRVfHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60/100px160" />
          <Card.Body>
            <Card.Title>Card title</Card.Title>
            <Card.Text>
              This is a wider card with supporting text below as a natural lead-in
              to additional content. This card has even longer content than the
              first to show that equal height action.
            </Card.Text>
          </Card.Body>
          <Card.Footer>
           <Button variant="outline-primary" size="sm" onClick={() => setLgShow(true)}>View here</Button>{' '}
            <small className="text-muted">Last updated 3 mins ago</small>
          </Card.Footer>
        </Card>
      </CardGroup>
        </Col>
      </Row>
    </Container>
  );
}

export default Gallery;