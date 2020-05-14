import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

function LogoutButton() {
  function handleClick() {
    // Por hacer
  }
}

class LogedInView extends React.Component {
  render() {
    const { user } = this.props;
    return (
      <NavDropdown
        alignRight
        title={user}
        id="navbar-dropdown"
      >
        <NavDropdown.Header>Ir a</NavDropdown.Header>
        <LinkContainer to="/semesters">
          <NavDropdown.Item>Semestres</NavDropdown.Item>
        </LinkContainer>
        <NavDropdown.Divider />
        <LinkContainer to="#" className="link-no-style">
          <LogoutButton />
        </LinkContainer>
      </NavDropdown>
    );
  }
}

class LogedOutView extends React.Component {
  render() {
    return (
      <LinkContainer to="/login">
        <Nav.Link><h5 style={{color:'Black'}}>Ingresar</h5></Nav.Link>
      </LinkContainer>
    );
  }
}


export default class Header extends React.Component {
    render() {
      // const { user } = this.props;
      return (
        <Navbar className="color-nav" variant="dark">
            <LinkContainer to="/">
            <Navbar.Brand className="mr-auto"><h4 style={{color:'Black'}}>U-Calendar</h4></Navbar.Brand>
            </LinkContainer>
            <Nav>
            <LogedInView user="yo" />
            </Nav>
            {/* <Nav>{user ? <LogedInView user={user} /> : <LogedOutView />}</Nav> */}
        </Navbar>
      );
    }
}
