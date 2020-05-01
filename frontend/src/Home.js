import React from "react";
import Header from "./Header";


class Bloque_Calendario extends React.Component {
  render() {
    return (
      <div className="centrar">
        <div className="item_calendario" >Ver Semestre Otoño 2020</div>
        <div className="item_calendario" >Ver Semestre Primavera 2020</div>
        <div className="item_calendario" >Ver Semestre Primavera 2020</div>
        <div className="item_calendario" >Ver Semestre Primavera 2020</div>
      </div>
    );
  }
}


export default class Home extends React.Component {
render() {
    return (
    <div>
        <Header />
        <div className="centrar">
          <h1>Monitor de Carga de Controles</h1>
          <p style={{marginTop: '66px',fontSize:'25px'}}>Bienvenido, el semestre actual es ...</p>
        </div>
        <div>
          <Bloque_Calendario />
        </div>
      </div>
    );
  }
}