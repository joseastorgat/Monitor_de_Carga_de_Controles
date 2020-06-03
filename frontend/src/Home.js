import React from "react";
import { Route, Switch } from "react-router-dom";
import Header from "./Header";
import {nuevo_semestre , lista_semestres,editar_semestre, ver_semestre} from "./Semestre/index_semestre";
import {nuevo_curso , ver_curso, editar_curso} from "./Curso/index_curso";
import {nuevo_ramo ,editar_ramo, lista_ramos} from "./Ramo/index_ramo";
import administrar from "./Administrar";

import {evaluaciones} from "./Evaluacion/index_evaluacion"
import {nuevo_profesor, editar_profesor, lista_profesores} from "./Profesor/index_profesor"

import { Link } from "react-router-dom";

class Bloque_Calendario extends React.Component {
  render() {
    return (
      <div>
      <div className="centrar">
          <h1>Monitor de Carga de Controles</h1>
          <p style={{marginTop: '66px',fontSize:'25px'}}>Bienvenido, el semestre actual es ...</p>
      </div>
      <div className="centrar">
        <div className="rectangulo_azul" >Ver Semestre Otoño 2020</div>
        <div className="rectangulo_azul" >Ver Semestre Primavera 2020</div>
        <div className="rectangulo_azul" >Ver Semestre Primavera 2020</div>
        <div className="rectangulo_azul" >Ver Semestre Primavera 2020</div>
        <Link to="/administrar">
          <div className="rectangulo_azul" style={{ backgroundColor: "gray"}} >Administrar</div>
        </Link>
      </div>
      </div>
    );
  }
}

export default class Home extends React.Component {
render() {
    return (
    <div>
        <Header />
        
      <div>
        <Switch>
          <Route exact path="/" component={Bloque_Calendario} />

           {/* VISTAS DE ADMINISTRAR */}
           <Route exact path="/administrar" component={administrar} />

          {/* VISTAS DE SEMESTRE */}
          <Route exact path="/semestres" component={lista_semestres} />
          <Route exact path="/semestres/nuevo_semestre" component={nuevo_semestre} />
          <Route exact path="/semestres/:ano/:semestre" component={ver_semestre}  />
          <Route exact path="/semestres/:ano/:semestre/editar" component={editar_semestre} />

          {/* VISTAS DE CURSO */}
          <Route exact path="/semestres/:ano/:semestre/nuevo_curso" component={nuevo_curso} />
          <Route exact path="/semestres/:ano/:semestre/:cod/:seccion" component={ver_curso} />
          <Route exact  path="/semestres/:ano/:semestre/:cod/:seccion/editar"  component={editar_curso}  />

          {/* VISTAS DE RAMO */}
          <Route exact path="/ramos" component={lista_ramos} />
          <Route exact path="/ramos/nuevo_ramo" component={nuevo_ramo} />
          <Route exact path="/ramos/:id/editar" component={editar_ramo} />

          {/* VISTAS DE EVALUACION */}
          <Route exact path="/semestres/:ano/:semestre/:cod/:seccion/evaluaciones" component={evaluaciones} />

          {/* VISTAS DE PROFESOR */}
          <Route exact path="/profesores" component={lista_profesores} />
          <Route exact path="/profesores/nuevo_profesor" component={nuevo_profesor} />
          <Route exact path="/profesores/:id/editar" component={editar_profesor} />
        </Switch>
      </div>



      </div>
    );
  }
}