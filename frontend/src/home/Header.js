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
      <Nav>
        <NavLink className="inactive" activeClassName="active">
          <LinkContainer to="/semestres">
            <h5 style={{color:"white"}}>Semestres</h5>
          </LinkContainer>
        </NavLink>
        <NavLink  className="inactive" activeClassName="active">
          <LinkContainer to="/ramos">
            <h5>Ramos</h5>
          </LinkContainer>
        </NavLink>
        <NavLink  className="inactive" activeClassName="active">
          <LinkContainer to="/fechas_especiales">
            <h5>Fechas especiales</h5>
          </LinkContainer>
        </NavLink>
        <NavLink  className="inactive" activeClassName="active">
          <LinkContainer to="/profesores">
            <h5>Profesores</h5>
          </LinkContainer>
        </NavLink>
      
     <NavDropdown
        alignRight
        title={user ? `${user.username}` : ''}
        id="navbar-dropdown"
      >
        <LinkContainer to="/" activeClassName="" >
          <NavDropdown.Item onClick={logout}>  Cerrar Sesión  </NavDropdown.Item>
        </LinkContainer>

      </NavDropdown> 
      </Nav>
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

class Header extends React.Component {
  
  static propTypes = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
  };  

    
  render() {
    const { isAuthenticated, user } = this.props.auth;
    const { logout } = this.props;

    console.log(this.props.auth.user);

    const authLinks = (
      <LogedInView user={user} logout={logout} />
    );
    const guestLinks = (
      <LogedOutView />
    );
    return (
      <Navbar className="navbar sticky-top color-nav" variant="dark">
        <LinkContainer to="/">
          <Navbar.Brand className="mr-auto"><h4 style={{color:'White'}}>U-Calendar</h4></Navbar.Brand>
        </LinkContainer>    
        <Nav>
        {isAuthenticated ? authLinks : guestLinks}
        </Nav>
      </Navbar>
      );
    }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Header);