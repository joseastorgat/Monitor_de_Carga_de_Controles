import React from "react";
import Header from "../home/Header";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../actions/auth"
import { Redirect } from 'react-router-dom';


function ErrorMsg(props){
  
  const { error } = props;
  
  if (error) {
    if(error.error_msg){
    return (
      <span class="error text-danger"> {error.error_msg.non_field_errors} </span>
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

              <div class="form-group">
                <label htmlFor="password">Contraseña</label>
                <input type="password" className="form-control" name="password" onChange={this.onChange} />
              </div>
              
              <ErrorMsg error={this.props.error} /> 

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
  error: state.auth.error
});

export default connect(mapStateToProps, {login})(LoginPage);