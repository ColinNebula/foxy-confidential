import React from "react";
import { Container } from 'react-bootstrap';
import logo from '../../assets/images/logo.png';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


function Navigation(props) {
  const { currentTab, setCurrentTab } = props;
  return (

    <Navbar bg="light" expand="md" variant="light" sticky="top" collapseOnSelect>
      <Container>
        <Navbar.Brand href="/home">
          <img src={logo} width="90px" height="40px" alt="logo" />
          Foxy Confidential
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarResponsive" />
        <Navbar.Collapse id="navbarResponsive">
          <Nav className="ms-auto">
            <Nav.Link className={currentTab === "/" ? "mx-2 navActive" : "mx-2"}>
              <span onClick={() => setCurrentTab("home")}>Home</span>
            </Nav.Link>

            <Nav.Link className={currentTab === "blog" ? "mx-2 navActive" : "mx-2"}>
              <span onClick={() => setCurrentTab("blog")}>Blog</span>

            </Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item className={currentTab === "food" ? "mx-2 navActive" : "mx-2"}>
                <span onClick={() => setCurrentTab("food")}>Food Binge</span>

              </NavDropdown.Item>
              <NavDropdown.Item className={currentTab === "wines" ? "mx-2 navActive" : "mx-2"}>
                <span onClick={() => setCurrentTab("wines")}>Wines</span>

              </NavDropdown.Item>
              <NavDropdown.Item className={currentTab === "foxy" ? "mx-2 navActive" : "mx-2"}>
                <span onClick={() => setCurrentTab("foxy")}>Foxy</span>

              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item className={currentTab === "gallery" ? "mx-2 navActive" : "mx-2"}>
                <span onClick={() => setCurrentTab("gallery")}>Gallery</span>

              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

  );
}

export default Navigation;