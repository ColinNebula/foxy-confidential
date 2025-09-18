import React, { useRef, useState } from 'react';
import { Button, Container, Card, Form, Alert } from 'react-bootstrap';
import { SocialIcon } from 'react-social-icons';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaUtensils } from 'react-icons/fa';

function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      console.log({ 
        email: emailRef.current.value, 
        password: passwordRef.current.value 
      });
      setShowAlert(true);
      setIsLoading(false);
      
      // Hide alert after 3 seconds
      setTimeout(() => setShowAlert(false), 3000);
    }, 1000);
  }

  return (
    <Container className="login-container">
      <div className="login-wrapper">
        <Card className="login-card">
          <Card.Body>
            {/* Header */}
            <div className="login-header">
              <div className="login-icon">
                <FaUtensils size={40} />
              </div>
              <h2 className="login-title">Welcome Back</h2>
              <p className="login-subtitle">Sign in to your Foxy Restaurant account</p>
            </div>

            {/* Social Login */}
            <div className="social-login">
              <p className="social-text">Continue with</p>
              <div className="social-icons">
                <SocialIcon 
                  url="https://google.com" 
                  network="google" 
                  bgColor="#ff6b6b"
                  style={{ height: 45, width: 45 }}
                />
                <SocialIcon 
                  url="https://facebook.com" 
                  network="facebook" 
                  bgColor="#4ecdc4"
                  style={{ height: 45, width: 45 }}
                />
                <SocialIcon 
                  url="https://twitter.com" 
                  network="twitter" 
                  bgColor="#45b7d1"
                  style={{ height: 45, width: 45 }}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="divider">
              <span>or</span>
            </div>

            {/* Alert */}
            {showAlert && (
              <Alert variant="success" className="login-alert">
                Login successful! Welcome to Foxy Restaurant Reviews.
              </Alert>
            )}

            {/* Login Form */}
            <Form onSubmit={onSubmit} className="login-form">
              <Form.Group className="mb-3">
                <Form.Label className="form-label">
                  <FaUser className="label-icon" /> Email Address
                </Form.Label>
                <Form.Control
                  ref={emailRef}
                  type="email"
                  placeholder="Enter your email"
                  className="form-input"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="form-label">
                  <FaLock className="label-icon" /> Password
                </Form.Label>
                <div className="password-input-wrapper">
                  <Form.Control
                    ref={passwordRef}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="form-input password-input"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </Form.Group>

              <div className="form-options">
                <Form.Check
                  type="checkbox"
                  id="rememberMe"
                  label="Remember me"
                  className="remember-check"
                />
                <a href="#" className="forgot-link">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="login-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </Form>

            {/* Footer */}
            <div className="login-footer">
              <p>
                Don't have an account?{' '}
                <a href="#" className="signup-link">
                  Create one here
                </a>
              </p>
              <div className="back-home">
                <a href="/" className="home-link">
                  ← Back to Home
                </a>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
  export default Login;