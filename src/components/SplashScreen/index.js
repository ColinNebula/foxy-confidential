import React, { useState, useEffect } from 'react';
import { Container, ProgressBar } from 'react-bootstrap';
import { FaUtensils, FaStar, FaHeart } from 'react-icons/fa';
import FoxyLogo from '../FoxyLogo';
import './SplashScreen.css';

const SplashScreen = ({ onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [showIcons, setShowIcons] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const loadingTexts = [
    'Preparing your culinary journey...',
    'Loading restaurant data...',
    'Gathering the finest reviews...',
    'Curating personalized recommendations...',
    'Setting up your taste experience...',
    'Almost ready to explore...'
  ];

  useEffect(() => {
    const duration = 3500; // Total splash duration
    const interval = 50; // Update interval
    const steps = duration / interval;
    const progressStep = 100 / steps;

    let currentStep = 0;
    let textIndex = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(currentStep * progressStep, 100);
      setProgress(newProgress);

      // Update loading text
      const textSteps = steps / loadingTexts.length;
      const newTextIndex = Math.floor(currentStep / textSteps);
      if (newTextIndex < loadingTexts.length && newTextIndex !== textIndex) {
        textIndex = newTextIndex;
        setCurrentText(loadingTexts[textIndex]);
      }

      // Show icons animation at 30%
      if (newProgress >= 30 && !showIcons) {
        setShowIcons(true);
      }

      // Start fade out at 90%
      if (newProgress >= 90 && !fadeOut) {
        setFadeOut(true);
      }

      // Complete loading
      if (newProgress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          onLoadComplete();
        }, 500);
      }
    }, interval);

    // Set initial text
    setCurrentText(loadingTexts[0]);

    return () => clearInterval(timer);
  }, [onLoadComplete, showIcons, fadeOut]);

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="splash-background">
        <div className="floating-elements">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="floating-element"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              <FaStar />
            </div>
          ))}
        </div>
      </div>

      <Container className="splash-content">
        <div className="splash-main">
          {/* Logo Section */}
          <div className="splash-logo">
            <div className="logo-container">
              <div className="logo-icon">
                <FoxyLogo width={120} height={120} className="foxy-logo-pulse" />
              </div>
              <div className="logo-text">
                <h1 className="brand-name">Foxy Confidential</h1>
                <p className="brand-tagline">Where Culinary Excellence Meets Honest Reviews</p>
              </div>
            </div>
          </div>

          {/* Animated Icons */}
          <div className={`feature-icons ${showIcons ? 'show' : ''}`}>
            <div className="feature-icon" style={{ animationDelay: '0.2s' }}>
              <FaUtensils />
              <span>Quality Food</span>
            </div>
            <div className="feature-icon" style={{ animationDelay: '0.4s' }}>
              <FaStar />
              <span>Expert Reviews</span>
            </div>
            <div className="feature-icon" style={{ animationDelay: '0.6s' }}>
              <FaHeart />
              <span>Curated Experience</span>
            </div>
          </div>

          {/* Loading Section */}
          <div className="loading-section">
            <div className="loading-text">
              <span className="loading-message">{currentText}</span>
            </div>
            
            <div className="progress-container">
              <ProgressBar 
                now={progress} 
                className="custom-progress"
                variant="warning"
                animated
              />
              <span className="progress-text">{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Restaurant Preview Cards */}
          <div className="preview-cards">
            <div className="preview-card" style={{ animationDelay: '1s' }}>
              <div className="preview-image"></div>
              <div className="preview-info">
                <div className="preview-name">Le Bernardin</div>
                <div className="preview-rating">
                  <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
                </div>
              </div>
            </div>
            <div className="preview-card" style={{ animationDelay: '1.3s' }}>
              <div className="preview-image"></div>
              <div className="preview-info">
                <div className="preview-name">Momofuku</div>
                <div className="preview-rating">
                  <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
                </div>
              </div>
            </div>
            <div className="preview-card" style={{ animationDelay: '1.6s' }}>
              <div className="preview-image"></div>
              <div className="preview-info">
                <div className="preview-name">Peter Luger</div>
                <div className="preview-rating">
                  <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Subtle particles effect */}
      <div className="particles">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SplashScreen;