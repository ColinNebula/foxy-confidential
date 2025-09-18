import React, { useRef } from 'react';
// import { NavLink } from 'react-router-dom';
import { Button, Container, Card, Col, Form, Row  } from 'react-bootstrap';
import { SocialIcon } from 'react-social-icons';



function Login () {
  const emailRef = useRef()
  const passwordRef = useRef()

  function onSubmit(e) {
    e.preventDefault()
    console.log({ email: emailRef.current.value, 
      password: passwordRef.current.value })
  } 
    return (
     
      <Container className="mt-3">
      <form onSubmit={onSubmit}>
      <Row>
      <Col>
      
      <div className="form">
      <div className="form-under">
      
      
<div className='login'>
      <h1> Login </h1>
      <div className='container'>
      <div className='top'>
      <SocialIcon url="https://github.com/" network="github" bgColor="#2a9d8f" />
      <SocialIcon url="https://github.com/" network="twitter" bgColor="#2a9d8f" />
      <SocialIcon url="https://github.com/" network="github" bgColor="#2a9d8f" />
      </div>
      <br/>
      
      <label>Email address</label>
      <Form.Control 
      ref={emailRef}
      type="email" id="email" placeholder="Enter email"  />
    
        <Form.Text className="text-muted">
        We will never share your email with anyone else.
        </Form.Text>
        </div>
        <div>
        <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" 
        ref={passwordRef} 
        
        id="password"
        />
      </Form.Group>
      </div>
      <div className="mb-3 form-check">
      <input type='checkbox' class="form-checked-input" id="rememberMe" />
      <label className="form-check-label" for="rememberMe"> Remember Me </label>
      </div>

      <Form.Group className="mb-3" controlId="formBasicEmail">
      <Button type="submit">Login</Button>
      <div className='bottom'>
      <br/>
      <p> Forgot your password? </p>
      <a href='/'> Reset password</a>
      </div>
      
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicEmail">
      <p className='create'> Create Account 
      <br />
      <a type="submit" href="/" target="blank"> <button class="btn">
      <span>Sign Up</span></button></a>
      </p>
    
    <a href={"/"} target="blank"> <button class="btn"> 
    <span>Go Home </span></button> </a>
    </Form.Group> 
      
      
      </div>
      </div>
      </div>
      </Col>
      </Row>
      </form>
      </Container>
    );
    
  }
  export default Login;