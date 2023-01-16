import React from "react";
import { Container } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import fc_logo from '../../assets/images/fc_logo.png';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function Navigation(props) {
    const { currentTab, setCurrentTab } = props;
  return (
    <Navbar bg="dark text-white"  variant="dark" expand="md"  sticky="top" collapseOnSelect>
      <Container>
        <Navbar.Brand href="/home">
        <img src={fc_logo} width="90px" height="40px" alt="logo" />
        Foxy Confidential 
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link className={currentTab === "/" ? "mx-2 navActive" : "mx-2"}>
            <span onClick={() => setCurrentTab("home")}>Home</span>
            </Nav.Link>

            <Nav.Link className={currentTab === "blog" ? "mx-2 navActive" : "mx-2"}>
            <span onClick={() => setCurrentTab("blog")}>Blog</span>
            </Nav.Link>

            <Nav.Link className={currentTab === "lifestyle" ? "mx-2 navActive" : "mx-2"}>
            <span onClick={() => setCurrentTab("lifestyle")}>Lifestyle</span>
            </Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item className={currentTab === "gallery" ? "mx-2 navActive" : "mx-2"}>
              <span onClick={() => setCurrentTab("gallery")}>Gallery</span>
              </NavDropdown.Item>
          
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Broadcast
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;