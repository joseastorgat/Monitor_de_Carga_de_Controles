import React from "react";
import Header from "./Header";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../actions/auth"
import { Redirect } from 'react-router-dom';
import { Link } from "react-router-dom";


// function ErrorMsg(props){
  
//   const { error } = props;
  
//   if (error) {
//     if(error.error_msg){
//     return (
//       <span class="error text-danger"> {error.error_msg.non_field_errors} </span>
//     );}
//   }
//   return ("");
// }

export class LoginPage extends React.Component {

  state = {
    username: "",
    sent: false,
  };

  onChange = e => {
    this.setState({
      [e.target.name]: 
      e.target.value
    })
  };

  onSubmit = e => {
    e.preventDefault();
    this.setState({sent: true});
    // this.props.login(this.state.username, this.state.password);
  }

  static propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
  };

  render() {
      
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }

    if (this.state.sent){
      return (<div> 
        <div>
        <Header />
        </div>
        <div className="wrap">
          Hemos enviado un correo a tu mail asociado, revisa tu casilla y sigue las instrucciones.
          </div>
      </div>)

    }
    return(
        <div>
          <div>
          <Header />
          </div>
          <div className="wrap">
            <form class="login-form" name="form" onSubmit={this.onSubmit} >
          
              <div class="form-header">
                <h2>Recuperar Contraseña</h2>
              </div>

              <div class="form-group">
                <label htmlFor="username">Usuario</label>
                <input type="text" className="form-control" name="username" onChange={this.onChange} />
              </div>

              <div className="form-group">
                <button className="form-button">Enviar link de Recuperación</button>
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