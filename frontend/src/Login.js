import React from "react";

export default class LoginPage extends React.Component {

    render() {
        return(
        <div className="wrap">
            <form class="login-form" name="form" >
              <div class="form-header">
                <h2>U-Calendar</h2>
              </div>
              <div class="form-group">
                <label htmlFor="username">Usuario</label>
                <input type="text" className="form-control" name="username"   />
              </div>
              <div>
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                />
              </div>
              <div className="form-group">
                <button className="form-button">Ingresar</button>
              </div>
            </form>
      </div>




    )}
}