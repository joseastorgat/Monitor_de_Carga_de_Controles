import React from "react";
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
            <div className="rectangulo_azul" style={{ backgroundColor: "gray"}} >Administrar Semestres</div>
            </Link>
            <Link to="/ramos">
            <div className="rectangulo_azul" style={{ backgroundColor: "gray"}}>Administrar Ramos</div>
            </Link>
            <div className="rectangulo_azul" style={{ backgroundColor: "gray"}} > Administrar Profesores</div>
            <div className="rectangulo_azul" style={{ backgroundColor: "gray"}}>Fechas Especiales</div>
        </div>
        <Link  activeClassName=""  to="/" className="float-left " style={{width: '7%', 'marginLeft':"10vw",borderRadius: '8px'}}>
            <button >Volver</button>
         </Link>
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