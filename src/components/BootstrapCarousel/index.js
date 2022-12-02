import Carousel from 'react-bootstrap/Carousel';
// import Fade from 'react-bootstrap/Fade';

function Navigation() {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100 h-100 carousel-fade" data-bs-interval="20000"
          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2Fc2%2F5f%2F88%2Fc25f88db65dcd9a9d940e990ca1a4912.jpg&f=1&nofb=1&ipt=9be6cb518eb2cb03e5259be2c2600afee2e00a60e70767ee222ece8edd1fcbf7&ipo=images"
          alt="First slide"
        />
        <Carousel.Caption>
          <h3>Wear the best brands</h3>
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
          <h3>Eat amazing food</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100 h-100 carousel-fade" data-bs-interval="10000"
          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fthewashingtonnote.com%2Fwp-content%2Fuploads%2F2020%2F09%2Flifestyle-1920x1279.jpeg&f=1&nofb=1&ipt=7787da3ada5200b6064f6a7de7cd83ffa45e4d4184172509e4add6867936ce51&ipo=images"
          alt="Third slide"
        />

        <Carousel.Caption>
          <h3>Enjoy the best life style</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default Navigation;