import React from "react";
import { Link } from "react-router-dom";

class Bloque extends React.Component {
  render() {
    return (
      <div>
        <div className="centrar" style={{marginTop: '-6px'}}>
          <h2 className="titulo" >Monitor de Carga de Controles</h2>
          <p style={{marginTop: '46px',fontSize:'20px'}}>Bienvenido, el semestre actual es ...</p>
        </div>
        <div className="centrar">
            <Link to="/semestres" style={{ color: '#FFF' }}>
            <div className="rectangulo_azul" style={{ backgroundColor: "#cecece"}} >Administrar Semestres</div>
            </Link>
            <Link to="/ramos" style={{ color: '#FFF' }}>
            <div className="rectangulo_azul" style={{ backgroundColor: "#cecece"}}>Administrar Ramos</div>
            </Link>
            <Link to="/profesores" style={{ color: '#FFF' }}>
            <div className="rectangulo_azul" style={{ backgroundColor: "#cecece"}} > Administrar Profesores</div>
            </Link>
            <Link to="/fechas_especiales" style={{ color: '#FFF' }}>
            <div className="rectangulo_azul" style={{ backgroundColor: "#cecece"}}>Administrar Feriados</div>
            </Link>
        </div> 
        <Link   to="/" className="float-left " style={{'marginLeft':"10vw"}}>
            <button className="btn btn-primary" >Volver</button>
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