import React, { useState } from 'react'
import { CardGroup, Card, Container, Button, NavDropdown, Col, Row, Modal } from 'react-bootstrap';
import food from '../../assets/images/food.png';
import food2 from '../../assets/images/food2.png';
import food3 from '../../assets/images/food3.png';
import food6 from '../../assets/images/food6.png';
// import Image from 'react-bootstrap/Image'


function Home() {
  const [lgShow, setLgShow] = useState(false);
  return (

    
    <Container fluid>
      <Row>
      <div>
      <>
      <Modal
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            What we do
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Nibh cras pulvinar mattis nunc. Mollis aliquam ut porttitor leo a. 
          Mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget. 
          Volutpat diam ut venenatis tellus in metus vulputate.

          </p>
          <Card.Img src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Froutenote.com%2Fblog%2Fwp-content%2Fuploads%2F2017%2F09%2FDJ.jpg&f=1&nofb=1&ipt=ddb0176cf1104a4d07576f128b48c3797be67004d74087a891a247c025d50dfa&ipo=images/100px270" className="rounded" alt="Card image" />
          <a href="https://react-bootstrap.github.io/components/modal/"></a>
        
        </Modal.Body>
      </Modal>
    </>
      </div>
      <h2 class="home_top"> Welcome to Foxy Confidential</h2>
      <p class="p_top"> Welcome to our fluffy world where we strive
      to make your taste buds thrive and satisfy those intellectual demands to see what’s at the forefront, 
      <br />
      the cutting edge if you will.
      Check our winners in the list of worthwhile endeavours who get awarded 1, 2, or 3 
      fluffy wags of our tails and deserve your hard earned credit card tap.</p>

      <NavDropdown.Divider />

        <Col ms={"auto"}>
        <Card className="bg-dark text-white shadow-lg" style={{ color: "#000", width: "auto" }}>
      <Card.Img src={food} className="rounded" alt="Card image" />
      <Card.ImgOverlay>
        <Card.Title>Party In NYC</Card.Title>
        <Card.Text>
        We are FOXY CONFIDENTIAL and this is your scoop on what’s fluffy and what’s not.
        </Card.Text>
        <Button variant="outline-primary" onClick={() => setLgShow(true)}>Read more</Button>{' '}
        <Card.Text></Card.Text>
      </Card.ImgOverlay>
    </Card>
        </Col>
      </Row>
      <h2 class="home_top"> Welcome to Foxy Confidential</h2>
      <p class="p_top"> As we search far and wide, high and low, wagging this way and that,
      we come upon a few pretty spots
      that deserve a mention.</p>
      <NavDropdown.Divider />
      <br />

      <CardGroup>
      <Card>
        <Card.Img variant="top" src={food3} />
        <Card.Body>
          <Card.Title>Card title</Card.Title>
          <Card.Text>
            This is a wider card with supporting text below as a natural lead-in
            to additional content. This content is a little bit longer.
          </Card.Text>
        </Card.Body>
        <Card.Footer>
        <Button variant="outline-primary" onClick={() => setLgShow(true)}>Read more</Button>{' '}
          <small className="text-muted">Last updated 3 mins ago</small>
        </Card.Footer>
      </Card>

      <Card>
        <Card.Img variant="top" src={food2} />
        <Card.Body>
          <Card.Title>Card title</Card.Title>
          <Card.Text>
            This card has supporting text below as a natural lead-in to
            additional content.{' '}
          </Card.Text>
        </Card.Body>
        <Card.Footer>
          <Button variant="outline-primary" onClick={() => setLgShow(true)}>Read more</Button>{' '}
          <small className="text-muted">Last updated 3 mins ago</small>
        </Card.Footer>
      </Card>

      <Card>
        <Card.Img variant="top" src={food6} />
        <Card.Body>
          <Card.Title>Card title</Card.Title>
          <Card.Text>
            This is a wider card with supporting text below as a natural lead-in
            to additional content. This card has even longer content than the
            first to show that equal height action.
          </Card.Text>
        </Card.Body>
        <Card.Footer>
        <Button variant="outline-primary" onClick={() => setLgShow(true)}>Read more</Button>{' '}
          <small className="text-muted">Last updated 3 mins ago</small>
        </Card.Footer>
      </Card>
    </CardGroup>
    <br />
    <NavDropdown.Divider />
    <br />
    </Container>


    

  );

}

export default Home;