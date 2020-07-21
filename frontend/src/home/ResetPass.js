import React from "react";
import Header from "./Header";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Redirect } from 'react-router-dom';
import { Link } from "react-router-dom";
import queryString from 'query-string';
import axios from 'axios';


export class ResetPass extends React.Component {
  constructor(props) {
    super(props);
  
    let token = queryString.parse(this.props.location.search).token;
    token = token === undefined? "": token;
    
    this.state = {
      email: "",
      sent: false,
      checking_token: token!=="",
      valid_token: false,
      invalid_token: false,
      token: token,
      change_success: false,
      pass: "",
      confirmation: "",
    };
  }

  onChange = e => {
    this.setState({
      [e.target.name]: 
      e.target.value
    })
  };

  onSubmit = e => {
    e.preventDefault();
    axios.post( process.env.REACT_APP_API_URL +"/auth/password_reset/",
      { email: this.state.email},
      { headers: {'Content-Type': 'application/json'}})
    .then( (res) => this.setState({
      sent: true
    }))
    .catch((err) => console.log(err))
  }

  onChangePasswordSubmit = e => {
    e.preventDefault();
    axios.post(process.env.REACT_APP_API_URL + "/auth/password_reset/confirm/",
    { password: this.state.pass,
      token: this.state.token,
    },
    { headers: {'Content-Type': 'application/json'}})
    .then( (res) => this.setState({
      change_success: true
    }))
    .catch((err) => {
      console.log(err); 
      alert("Error - pruebe denuevo")})
  }

  componentDidMount(){
    if(this.state.checking_token){
      axios.post(process.env.REACT_APP_API_URL + "/auth/password_reset/validate_token/",
      { token: this.state.token},
      { headers: {'Content-Type': 'application/json'},
      })
      .then( (res) => {
        console.log(res);
        this.setState({
          valid_token: true,
          checking_token: false});
        })
      .catch( (err) => {
        this.setState({
          invalid_token: true,
          checking_token: false,
        })
      }) 
    }
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool,
  };

  render() {
      
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }
    if (this.state.checking_token){
      return ( 
        <div>
        <Header />
        </div>) 
    }
    
    if (this.state.change_success){
      return ( 
        <div>
        <div> <Header /> </div>
        <div className="wrap">
           Cambio de contraseña exitoso: <Link to="/login/"> Ingrese aquí </Link>
         </div>
        </div>) 
    }

    if(this.state.valid_token){
      return (
        <div>
        <div>
        <Header />
        </div>
        <div className="wrap">
          <form className="login-form" name="form" onSubmit={this.onChangePasswordSubmit} >
        
            <div className="form-header">
              <h2>Recuperar Contraseña</h2>
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input required type="password" className="form-control" name="pass" onChange={this.onChange} />
            </div>

            <div className="form-group">
              <label htmlFor="password">Confirmar Contraseña</label>
              <input required type="password" className="form-control" name="confirmation" onChange={this.onChange} />
            </div>

            <div className="form-group">
              <button className="form-button">Restablecer contraseña</button>
            </div>

          </form>
        </div>
      </div>
    )}

    if(this.state.invalid_token) {
      return (<div> 
        <div>
        <Header />
        </div>
        <div className="wrap">
          Token inválido: es posible que haya expirado o hayas ingresado mal la url en tu navegador. 
         </div>
      </div>) 
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
            <form className="login-form" name="form" onSubmit={this.onSubmit} >
          
              <div className="form-header">
                <h2>Recuperar Contraseña</h2>
              </div>

              <div className="form-group">
                <label htmlFor="username">E-Mail</label>
                <input required type="text" className="form-control" name="email" onChange={this.onChange} />
              </div>

              <div className="form-group">
                <button className="form-button">Restablecer contraseña</button>
              </div>

            </form>
          </div>
        </div>
  )}
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(ResetPass);