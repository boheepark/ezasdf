import React from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

const NavBar = (props) => (
  <Navbar inverse collapseOnSelect>
    <Navbar.Header>
      <Navbar.Brand>
        <span>{props.title}</span>
      </Navbar.Brand>
      <Navbar.Toggle/>
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
          <LinkContainer to="/">
              <NavItem eventKey={1}>Home</NavItem>
          </LinkContainer>
          <LinkContainer to="/about">
              <NavItem eventKey={2}>About</NavItem>
          </LinkContainer>
          {
              props.isAuthenticated &&
              <LinkContainer to="/profile">
                  <NavItem eventKey={3}>Profile</NavItem>
              </LinkContainer>
          }
      </Nav>
      <Nav pullRight>
        {
          !props.isAuthenticated &&
          <LinkContainer to="/signup">
            <NavItem eventKey={1}>Signup</NavItem>
          </LinkContainer>
        }
        {
          !props.isAuthenticated &&
          <LinkContainer to="/signin">
            <NavItem eventKey={2}>Signin</NavItem>
          </LinkContainer>
        }
        {
          props.isAuthenticated &&
          <LinkContainer to="/signout">
            <NavItem eventKey={3}>Signout</NavItem>
          </LinkContainer>
        }
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default NavBar;
