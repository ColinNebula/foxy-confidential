import React, { useState } from "react";
import { Container } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import fc_logo from '../../assets/images/fc_logo.png';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FaHome, FaBlog, FaUtensils, FaImages, FaSignInAlt, FaStar, FaChevronDown } from 'react-icons/fa';
import './Nav.css';

function Navigation(props) {
    const { currentTab, setCurrentTab } = props;
    const [expanded, setExpanded] = useState(false);
    
    const navItems = [
      { key: 'home', label: 'Home', icon: <FaHome />, ariaLabel: 'Navigate to Home page' },
      { key: 'blog', label: 'Reviews', icon: <FaBlog />, ariaLabel: 'Navigate to Reviews page' },
      { key: 'lifestyle', label: 'Restaurants', icon: <FaUtensils />, ariaLabel: 'Navigate to Restaurants page' }
    ];
    
    const dropdownItems = [
      { key: 'gallery', label: 'Gallery', icon: <FaImages />, ariaLabel: 'Navigate to Gallery page' },
      { key: 'login', label: 'Login', icon: <FaSignInAlt />, ariaLabel: 'Navigate to Login page' }
    ];
    
    const handleNavItemClick = (key) => {
      setCurrentTab(key);
      setExpanded(false); // Close mobile menu
    };
    
  return (
    <Navbar 
      bg="dark" 
      variant="dark" 
      expand="lg" 
      sticky="top" 
      collapseOnSelect 
      className="foxy-navbar"
      expanded={expanded}
      onToggle={(expanded) => setExpanded(expanded)}
      fluid
    >
      <Container fluid className="nav-container">
        <Navbar.Brand 
          href="/home" 
          className="brand-enhanced"
          onClick={(e) => {
            e.preventDefault();
            handleNavItemClick('home');
          }}
          aria-label="Foxy Confidential - Navigate to Home"
        >
          <img 
            src={fc_logo} 
            width="90" 
            height="40" 
            alt="Foxy Confidential Logo" 
            className="brand-logo"
            loading="lazy"
          />
          <span className="brand-text">
            <span className="brand-name">Foxy Confidential</span>
            <span className="brand-tagline">Restaurant Ratings</span>
          </span>
        </Navbar.Brand>
        
        <Navbar.Toggle 
          aria-controls="enhanced-navbar-nav" 
          className="custom-toggler"
          aria-label="Toggle navigation menu"
        />
        
        <Navbar.Collapse id="enhanced-navbar-nav">
          <Nav className="ms-auto align-items-center" role="navigation">
            {navItems.map(item => (
              <Nav.Link 
                key={item.key}
                className={`nav-item-enhanced ${currentTab === item.key ? "nav-active" : ""}`}
                onClick={() => handleNavItemClick(item.key)}
                aria-label={item.ariaLabel}
                aria-current={currentTab === item.key ? "page" : undefined}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleNavItemClick(item.key);
                  }
                }}
              >
                <div className="nav-content">
                  <span className="nav-icon" aria-hidden="true">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </div>
              </Nav.Link>
            ))}
            
            <NavDropdown 
              title={
                <div className="nav-content dropdown-toggle-content">
                  <span className="nav-icon" aria-hidden="true"><FaStar /></span>
                  <span className="nav-label">More</span>
                  <FaChevronDown className="dropdown-arrow ms-1" aria-hidden="true" />
                </div>
              } 
              id="enhanced-nav-dropdown"
              className="nav-dropdown-enhanced"
              aria-label="More navigation options"
            >
              {dropdownItems.map(item => (
                <NavDropdown.Item 
                  key={item.key}
                  className={`dropdown-item-enhanced ${currentTab === item.key ? "dropdown-active" : ""}`}
                  onClick={() => handleNavItemClick(item.key)}
                  aria-label={item.ariaLabel}
                  aria-current={currentTab === item.key ? "page" : undefined}
                >
                  <div className="dropdown-content">
                    <span className="dropdown-icon" aria-hidden="true">{item.icon}</span>
                    <span className="dropdown-label">{item.label}</span>
                  </div>
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;