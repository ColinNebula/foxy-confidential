import Carousel from 'react-bootstrap/Carousel';
import food5 from '../../assets/images/food5.png';
import food6 from '../../assets/images/food6.png';
import food2 from '../../assets/images/food2.png';
// import Fade from 'react-bootstrap/Fade';

function Navigation() {
  return (
    <Carousel>

    <Carousel.Item>
        <img
          className="d-block w-100 h-100 carousel-fade" data-bs-interval="20000"
          src={food2}
          alt="First slide"
        />
        <Carousel.Caption>
          <h3>Wear the best brands</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>

    <Carousel.Item>
        <img
          className="d-block w-100 h-100 carousel-fade" data-bs-interval="20000"
          src={food5}
          alt="First slide"
        />
        <Carousel.Caption>
          <h3>Wear the best brands</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
      <img
        className="d-block w-100 h-100 carousel-fade" data-bs-interval="20000"
        src={food6}
        alt="First slide"
      />
      <Carousel.Caption>
        <h3>Wear the best brands</h3>
        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
      </Carousel.Caption>
    </Carousel.Item>


      <Carousel.Item>
        <img
          className="d-block w-100 h-100 carousel-fade" data-bs-interval="20000"
          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.womendailymagazine.com%2Fwp-content%2Fuploads%2F2020%2F06%2Fwhere-to-buy-wholesale-clothing-for-a-boutique-1.jpg&f=1&nofb=1&ipt=a7826d433c90784ab5923204caa8eca364c9bd4814293660139bc512c8a50be3&ipo=images"
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
          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.thenpclinic.com%2Fwp-content%2Fuploads%2F2019%2F12%2FPSYCHOLOGICAL-TOOLS-FOR-LIVING-HEALTHY-LIFESTYLE.jpg&f=1&nofb=1&ipt=f2d490c861e2e053b901f253e8a87f80dc81a67b432a92dd217ac08bc3a27563&ipo=images"
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