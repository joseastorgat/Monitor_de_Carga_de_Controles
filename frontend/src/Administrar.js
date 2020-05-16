import React from "react";
import { Route, Switch } from "react-router-dom";
import Header from "./Header";
import {nuevo_semestre , lista_semestres,editar_semestre} from "./Semestre/index_semestre";
import {nuevo_curso , lista_cursos} from "./Curso/index_curso";
import {nuevo_ramo ,editar_ramo, lista_ramos} from "./Ramo/index_ramo";

import { Link } from "react-router-dom";

class Bloque extends React.Component {
  render() {
    return (
      <div>
        <div className="centrar">
          <h1>Monitor de Carga de Controles</h1>
          <p style={{marginTop: '66px',fontSize:'25px'}}>Bienvenido, el semestre actual es ...</p>
        </div>
        <div className="centrar">
            <Link to="/semestres">
            <div className="rectangulo_azul" >Administrar Semestres</div>
            </Link>
            <Link to="/ramos">
            <div className="rectangulo_azul" >Administrar Ramos</div>
            </Link>
            <div className="rectangulo_azul" > Administrar Profesores</div>
            <div className="rectangulo_azul" >Fechas Especiales</div>
        </div>
      </div>
    );
  }
}

export default class administrar extends React.Component {
render() {
    return (
    <div>
        <Bloque />
      </div>
    );
  }
}