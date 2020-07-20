import React from "react";
import Header from "../home/Header";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../actions/auth";
import ResetPass from "./ResetPass";
import {Link, Redirect } from "react-router-dom";


function ErrorMsg(props){
  
  const { error } = props;
  
  if (error) {
    if(error.error_msg){
    return (
      <span className="error text-danger"> {error.error_msg.non_field_errors} </span>
    );}
  }
  return ("");
}

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
    error: PropTypes.object,
  };

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }
    return(        
        <div>
          <div>
          <Header />
          </div>
          
          <div className="wrap">
            <form className="login-form" name="form" onSubmit={this.onSubmit} >
          
              <div className="form-header">
                <h2>Iniciar Sesión</h2>
              </div>

              <div className="form-group">
                <label htmlFor="username">Usuario</label>
                <input required type="text" className="form-control" name="username" onChange={this.onChange} />
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input required type="password" className="form-control" name="password" onChange={this.onChange} />
              </div>
              
              <ErrorMsg error={this.props.error} /> 

              <div className="form-group">
                <button className="form-button" >Ingresar</button>
              </div>
              
              <Link to={"/login/reset/"} >
                ¿Olvidaste tu Contraseña?
              </Link>
              

            </form>
          </div>
        </div>
  )}
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.auth.error
});

export default connect(mapStateToProps, {login})(LoginPage);