import React from 'react';
import { FaInstagram, FaFacebookF, FaTwitter, FaLinkedin } from "react-icons/fa";
import './Footer.css';


function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <span role="img" aria-label="fox">🦊</span> Foxy Confidential
                </div>
                <ul className="footer-social">
                    <li>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <FaInstagram />
                        </a>
                    </li>
                    <li>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <FaFacebookF />
                        </a>
                    </li>
                    <li>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <FaTwitter />
                        </a>
                    </li>
                    <li>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <FaLinkedin />
                        </a>
                    </li>
                </ul>
                <div className="footer-links">
                    <a href="/">Home</a>
                    <span className="footer-sep">|</span>
                    <a href="mailto:obdyer@rogers.com">Contact</a>
                </div>
            </div>
            <div className="footer-bottom">
                &copy; {new Date().getFullYear()} Foxy Confidential. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;