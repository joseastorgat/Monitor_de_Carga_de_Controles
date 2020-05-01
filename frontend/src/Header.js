import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav} from "react-bootstrap";


export default class Header extends React.Component {
    render() {
      return (
        <Navbar className="color-nav" variant="dark">
            <LinkContainer to="/">
            <Navbar.Brand className="mr-auto"><h4 style={{color:'Black'}}>U-Calendar</h4></Navbar.Brand>
            </LinkContainer>
            <LinkContainer to="/login">
            <Nav.Link><h5 style={{color:'Black'}}>Ingresar</h5></Nav.Link>
            </LinkContainer>
        </Navbar>
      );
    }
  }
