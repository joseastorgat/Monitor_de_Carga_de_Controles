import React from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "../common/PrivateRoute"
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Link } from "react-router-dom";
import administrar from "./Administrar";
import Header from "./Header";
import {nuevo_semestre , lista_semestres,editar_semestre, ver_semestre} from "../semestre/index_semestre";
import {nuevo_curso , ver_curso, editar_curso} from "../curso/index_curso";
import {nuevo_ramo ,editar_ramo, lista_ramos} from "../ramo/index_ramo";


class Bloque_Calendario extends React.Component {
  
  static propTypes = {
    auth: PropTypes.object.isRequired,
  };

  render() {
    const { isAuthenticated} = this.props.auth;
    
    const authLinks = (
      <Link to="/administrar">
        <div className="rectangulo_azul" style={{ backgroundColor: "gray"}} >Administrar</div>
      </Link>
    );

    return (
      <div>
      <div className="centrar">
          <h1>Monitor de Carga de Controles</h1>
          <p style={{marginTop: '66px',fontSize:'25px'}}>Bienvenido, el semestre actual es ...</p>
      </div>
      <div className="centrar">
        <div className="rectangulo_azul" >Ver Semestre Otoño 2020</div>
        <div className="rectangulo_azul" >Ver Semestre Primavera 2020</div>
        
        {isAuthenticated ? authLinks: '' }
      </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const Bloque_Calendario_con = connect(mapStateToProps)(Bloque_Calendario);

export default class Home extends React.Component {
  render() {
    return (
    <div>
      <Header />
      <div>
        <Switch>
          <Route exact path="/" component={Bloque_Calendario_con} />

          {/* VISTAS DE ADMINISTRAR */}
          <PrivateRoute exact path="/administrar" component={administrar} />

          {/* VISTAS DE SEMESTRE */}
          <PrivateRoute exact path="/semestres" component={lista_semestres} />
          <PrivateRoute exact path="/semestres/nuevo_semestre" component={nuevo_semestre} />
          <PrivateRoute exact path="/semestres/:ano/:semestre" component={ver_semestre}  />
          <PrivateRoute exact path="/semestres/:ano/:semestre/editar" component={editar_semestre} />

          {/* VISTAS DE CURSO */}
          <PrivateRoute exact path="/semestres/:ano/:semestre/nuevo_curso" component={nuevo_curso} />
          <PrivateRoute exact path="/semestres/:ano/:semestre/:cod/:seccion" component={ver_curso} />
          <PrivateRoute exact  path="/semestres/:ano/:semestre/:cod/:seccion/editar"  component={editar_curso}  />

          {/* VISTAS DE RAMO */}
          <PrivateRoute exact path="/ramos" component={lista_ramos} />
          <PrivateRoute exact path="/ramos/nuevo_ramo" component={nuevo_ramo} />
          <PrivateRoute exact path="/ramos/:id/editar" component={editar_ramo} />
        </Switch>
      </div>
      </div>
    );
  }
}