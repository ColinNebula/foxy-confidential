import { Card, Container, Button, Col, Row } from 'react-bootstrap';
import CardGroup from 'react-bootstrap/CardGroup';
// import Image from 'react-bootstrap/Image'


function Home() {
  return (
    <Container fluid>
    <Row>
    <Col ms={"auto"}>
    <CardGroup>
      <Card className="shadow-lg" style={{ color: "#000"}}>
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
      <Card>
        <Card.Img variant="top" src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fonmilwaukee.com%2Fimages%2Farticles%2Fgo%2Fgoodfoodcafemanna%2Fgoodfoodcafemanna_fullsize_story1.jpg%3F20120828153851&f=1&nofb=1&ipt=e9d01165d8490eb89e7e9e1ec52c0b3f789e94e993cb3eb9a21cea56e863ce8c&ipo=images/100px160" class="rounded" alt="food image" />
        <Card.Body>
          <Card.Title>Card title</Card.Title>
          <Card.Text>
            This is a wider card with supporting text below as a natural lead-in
            to additional content. This card has even longer content than the
            first to show that equal height action.
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

export default Home;