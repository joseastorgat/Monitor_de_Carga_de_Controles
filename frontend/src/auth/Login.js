import React from "react";
import Header from "../Header";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../actions/auth"
import { Redirect } from 'react-router-dom';

export class LoginPage extends React.Component {

  state = {
    username: "",
    password: ""
  };


  onChange = e => {
    this.setState({
      [e.target.name]: 
      e.target.value
    })
  };

  onSubmit = e => {
    e.preventDefault();
    this.props.login(this.state.username, this.state.password);
  }

  static propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
  };

  render() {
      
    const {username, password} = this.state;
    
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }
  
    return(
        <div>
          <div>
          <Header />
          </div>
          <div className="wrap">
            <form class="login-form" name="form" onSubmit={this.onSubmit} >
              <div class="form-header">
                <h2>U-Calendar</h2>
              </div>
              <div class="form-group">
                <label htmlFor="username">Usuario</label>
                <input type="text" className="form-control" name="username" onChange={this.onChange} />
              </div>
              <div>
                <label htmlFor="password">Contraseña</label>
                <input type="password" className="form-control" name="password" onChange={this.onChange} />
              </div>
              <div className="form-group">
                <button className="form-button">Ingresar</button>
              </div>
            </form>
          </div>
        </div>
  )}
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {login})(LoginPage);