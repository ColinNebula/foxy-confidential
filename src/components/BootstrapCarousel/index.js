import Carousel from 'react-bootstrap/Carousel';

function Navigation() {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100 h-100 carousel-fade" data-bs-interval="10000"
          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ffoodsguy.com%2Fwp-content%2Fuploads%2F2020%2F11%2FThe-Best-Fruit-Snacks-Of-2020-1170x780.jpg&f=1&nofb=1&ipt=a767a82488f3c58c76727c0017ffbb18f7bb9619baa2d394e2ce0ebfa11495c4&ipo=images"
          alt="First slide"
        />
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100 h-100 carousel-fade" data-bs-interval="10000" 
          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.hWWj9MRB5OBndXiUCYUyJgHaE7%26pid%3DApi&f=1&ipt=079d0285f9d0d23c3e80a046dd17f82e9528555599f2ee509fe39b4fb0fa657e&ipo=images"
          alt="Second slide"
        />

        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100 h-100 carousel-fade" data-bs-interval="10000"
          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fassets.onyamagazine.com%2Fwp-content%2Fuploads%2F2019%2F07%2F28220251%2FScreen-Shot-2019-07-08-at-9.14.20-am-1024x678.png&f=1&nofb=1&ipt=2b9bd3720403a00383aeb4c44c8ce67b42cd22c64ceb7987808a4285dd93f8f5&ipo=images"
          alt="Third slide"
        />

        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default Navigation;