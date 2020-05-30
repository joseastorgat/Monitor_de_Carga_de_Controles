import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { logout } from "../actions/auth"
import PropTypes from "prop-types";
import { connect } from "react-redux";

class LogedInView extends React.Component {
  render() {
    const { user, logout } = this.props;
    // console.log({user});
    return (
      <NavDropdown
        alignRight
        title={user ? `Bienvenido ${user.username}` : ''}
        id="navbar-dropdown"
      >
        <NavDropdown.Header>Ir a</NavDropdown.Header>
        
        <LinkContainer to="/semestres">
          <NavDropdown.Item>Semestres</NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/ramos">
          <NavDropdown.Item>Ramos</NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/fechas_especiales">
          <NavDropdown.Item>Feriados</NavDropdown.Item>
        </LinkContainer>
        <NavDropdown.Divider />

        <LinkContainer to="/" className="link-no-style">
        <NavDropdown.Item onClick={logout}>
          Cerrar Sesión
        </NavDropdown.Item>
        
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
      <Navbar className="color-nav" variant="dark">
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