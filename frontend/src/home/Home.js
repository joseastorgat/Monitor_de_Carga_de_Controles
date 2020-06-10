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
import {nuevo_fecha,editar_fecha, lista_fechas} from "../fechas/index_fecha";
import {evaluaciones} from "../evaluacion/index_evaluacion";
import {nuevo_profesor, editar_profesor, lista_profesores} from "../profesor/index_profesor";


class Bloque_Calendario extends React.Component {
  
  static propTypes = {
    auth: PropTypes.object.isRequired,
  };

  render() {
    const { isAuthenticated} = this.props.auth;
    
    const authLinks = (
      <Link to="/administrar" style={{ color: '#FFF' }}>
        <div className="rectangulo_azul" style={{ backgroundColor: "#cecece"}} >Administrar</div>
      </Link>
    );

    return (
      <div>
      <div className="centrar" style={{marginTop: '-6px'}}>
          <h2 className="titulo">Monitor de Carga de Controles</h2>
          <p style={{marginTop: '46px',fontSize:'20px'}}>Bienvenido, el semestre actual es ...</p>
      </div>
      <div className="centrar" >
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

          {/* VISTAS DE EVALUACION */}
          <Route exact path="/semestres/:ano/:semestre/:cod/:seccion/evaluaciones" component={evaluaciones} />

          {/* VISTAS DE PROFESOR */}
          <Route exact path="/profesores" component={lista_profesores} />
          <Route exact path="/profesores/nuevo_profesor" component={nuevo_profesor} />
          <Route exact path="/profesores/:id/editar" component={editar_profesor} />

          {/* VISTAS DE FECHAS ESPECIALES */}
          <PrivateRoute exact path="/fechas_especiales" component={lista_fechas} />
          <PrivateRoute exact path="/fechas_especiales/nueva_fecha" component={nuevo_fecha} />
          <PrivateRoute exact path="/fechas_especiales/:id/editar" component={editar_fecha} />

        </Switch>
      </div>
      </div>
    );
  }
}