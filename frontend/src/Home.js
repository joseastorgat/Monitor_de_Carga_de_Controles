import React from "react";
import { Route, Switch } from "react-router-dom";
import Header from "./Header";
import {nuevo_semestre,lista_semestres} from "./Semestre/index_semestre";



class Bloque_Calendario extends React.Component {
  render() {
    return (
      <div>
      <div className="centrar">
          <h1>Monitor de Carga de Controles</h1>
          <p style={{marginTop: '66px',fontSize:'25px'}}>Bienvenido, el semestre actual es ...</p>
      </div>
      <div className="centrar">
        <div className="item_calendario" >Ver Semestre Otoño 2020</div>
        <div className="item_calendario" >Ver Semestre Primavera 2020</div>
        <div className="item_calendario" >Ver Semestre Primavera 2020</div>
        <div className="item_calendario" >Ver Semestre Primavera 2020</div>
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
          <Route exact path="/semestres" component={lista_semestres} />
          <Route exact path="/semestres/nuevo_semestre" component={nuevo_semestre} />
        </Switch>
      </div>



      </div>
    );
  }
}