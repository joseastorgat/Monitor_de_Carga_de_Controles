import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

class Bloque extends React.Component {
  render() {
    return (
      <div>
        <div className="centrar" style={{marginTop: '-6px'}}>
          <h2 className="titulo" >Monitor de Carga de Controles</h2>
          <p style={{marginTop: '46px',fontSize:'20px'}}>Bienvenido, el semestre actual es ...</p>
        </div>
        <div className="centrar_button" >
            <div style={{display:'block',textAlign: 'center'}}>
            <Link to="/semestres" style={{ color: '#FFF' }}>
            <Button className="rectangulo_azul_admin" >  Administrar Semestres</Button>
            </Link>
            </div>
            <div style={{display:'block',textAlign: 'center'}}>
            <Link to="/ramos" style={{ color: '#FFF' }}>
            <Button className="rectangulo_azul_admin" >  Administrar Ramos</Button>
            </Link>
            </div>
            <div style={{display:'block',textAlign: 'center'}}>
            <Link to="/profesores" style={{ color: '#FFF' }}>
            <Button  className="rectangulo_azul_admin">   Administrar Profesores</Button>
            </Link>
            </div>
            <div style={{display:'block',textAlign: 'center'}}>
            <Link to="/fechas_especiales" style={{ color: '#FFF' }}>
            <Button className="rectangulo_azul_admin" >  Administrar Feriados</Button>
            </Link>
            </div>
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