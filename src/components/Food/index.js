import { Card, Container, Col, Row } from 'react-bootstrap';
import CardGroup from 'react-bootstrap/CardGroup';
// import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

function Food() {
  return (
    <Container fluid>
    <Row>
    <Col md={"auto"}>
    <CardGroup>
      <Card className="shadow-lg">
        <Card.Img variant="top" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.yO_oWdXO2qCADpbD-Eb-WQHaFl%26pid%3DApi&f=1&ipt=6e7c514c9c3ac5abc8a764a3b26023e3e8999d18b007585d75166ac9cc146d8f&ipo=images/100px160" class="rounded" alt="food image" />
        <Card.Body>
          <Card.Title>Eat Like Foxy</Card.Title>
          <Card.Text>
            Eat like foxy queens and kings at some of the best and well renowns Restaurants city and around the the world 
            with foxy. Join us on social media or come with your friends to one of our events.
            
          </Card.Text>
        </Card.Body>
        <Card.Footer>
        <Button variant="outline-primary">Primary</Button>{' '}
          <small className="text-muted">Last updated 3 mins ago</small>
        </Card.Footer>
      </Card>
      <Card>
        <Card.Img variant="top" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.fDEDDwwgtCyI194bhdvcjQHaFu%26pid%3DApi&f=1&ipt=d3b34306d1aaebffed6f305ecadb6ce4c26f0722f71b7dc0277244e22f86b9ba&ipo=images/100px160 rounded" class="rounded" alt="food image" />
        <Card.Body>
          <Card.Title>Card title</Card.Title>
          <Card.Text>
          Eat like foxy queens and kings at some of the best and well renowns 
          Restaurants city and around the the world 
          with foxy. Join us on social media or come with your friends to one of our events.{' '}
          </Card.Text>
        </Card.Body>
        <Card.Footer>
        <Button variant="outline-primary">Primary</Button>{' '}
          <small className="text-muted">Last updated 3 mins ago</small>
        </Card.Footer>
      </Card>
    </CardGroup>
    </Col>
    </Row>
    </Container>

    
  );
  
}

export default Food;