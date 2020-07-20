import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import {NavLink, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { logout } from "../actions/auth"
import PropTypes from "prop-types";
import { connect } from "react-redux";

class LogedInView extends React.Component {
  render() {
    const { user, logout } = this.props;
    // console.log({user});
    return (
      <Navbar.Collapse className="mr-auto">
      <Nav className="ml-auto" >
     
      <LinkContainer to="/semestres/">
        <Nav.Link eventKey="1">
          
            <h5 >Semestres</h5>
         
        </Nav.Link>
        </LinkContainer>
      
        <LinkContainer to="/ramos/">
        <NavLink eventKey="2" >
      
            <h5>Ramos</h5>
         
        </NavLink>
        </LinkContainer>
        <LinkContainer to="/profesores/">
        <NavLink eventKey="3">
         
            <h5>Profesores</h5>
          
        </NavLink>
        </LinkContainer>
        <LinkContainer to="/fechas_especiales/">
        <NavLink  eventKey="4" >
          
            <h5>Fechas especiales</h5>
        
        </NavLink>
        </LinkContainer>
        <LinkContainer to="/evaluaciones/">
        <NavLink eventKey="5">
            <h5>Evaluaciones</h5>
        </NavLink>
        </LinkContainer>
     <NavDropdown style={{fontSize:"1.8em !important"}} alignRight title={user ? `${user.username}` : ''} >
          <NavDropdown.Item eventKey="6">
           <LinkContainer to="/acerca-de/">
            <div>Acerca de</div>
          </LinkContainer>
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={logout}>  Cerrar Sesión  </NavDropdown.Item>
          
      </NavDropdown> 
      </Nav>
      </Navbar.Collapse>
    );
  }
}

class LogedOutView extends React.Component {
  render() {
    return (
      <Navbar.Collapse className="mr-auto">
        <Nav className="ml-auto" >
        <LinkContainer to="/acerca-de/" >
            <Nav.Link><h5 style={{color:'white'}}>Acerca de</h5></Nav.Link>
        </LinkContainer>
        <LinkContainer to="/login/">
          <Nav.Link><h5 style={{color:'white'}}>Ingresar</h5></Nav.Link>
        </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    );
  }
}

class Header extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
  };  

    
  render() {
    const { isAuthenticated, user } = this.props.auth;
    const { logout } = this.props;

    const authLinks = (
      <LogedInView user={user} logout={logout} />
    );
    const guestLinks = (
      <LogedOutView />
    );
    return (
      <Navbar collapseOnSelect expand="lg" className="navbar sticky-top color-nav" variant="dark">
        <LinkContainer to="/">
          <Navbar.Brand className="mr-auto"><h4 style={{color:'White'}}>U-Calendar</h4></Navbar.Brand>
        </LinkContainer>  
        <Navbar.Toggle aria-controls="basic-navbar-nav" />  
       
        {isAuthenticated ? authLinks : guestLinks}
        
      </Navbar>
      );
    }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Header);