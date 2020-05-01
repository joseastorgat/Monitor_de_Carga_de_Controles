import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

export default class Home extends React.Component {
render() {
    return (
    <div>
      <LinkContainer to="/login">
        <Nav.Link><h5>Iniciar Sesión</h5></Nav.Link>
      </LinkContainer>
        <div>
        <p>Hola</p>
        </div>
      </div>
    );
  }
}