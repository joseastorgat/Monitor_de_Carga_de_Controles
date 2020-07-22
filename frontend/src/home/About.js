import React from "react";
import { Container} from "react-bootstrap";
import ViewTitle from "../common/ViewTitle";
import {Card} from "react-bootstrap";


export default class About extends React.Component {
    render() {
      return(
          <div>
          <Container >
           <ViewTitle>Acerca de </ViewTitle>
           <div>
            <Card bg="primary" className="version">
            <Card.Title>Versión 1.0</Card.Title>
            </Card>
            <Container >
            <h5 textAlign="left">Descripción </h5>
            <p>Software realizado en el semestre otoño del año 2020, para el curso de Ingeniería de Software II
             del Departamento de Ciencias de la Computación (DCC), que tiene como objetivo la organización y planificación 
             de la carga académica (controles y tareas) de los cursos del DCC antes de la inscripción académica realizada 
             por los estudiantes cada semestre.</p>
            <h5 textAlign="left">Equipo </h5>
            <div className="Equipo">
              <Member 
                img="hola"
                nombre="José Astorga T."
                cargo="Frontend"
                correo="jastorga@dcc.uchile.cl"
              />
               <Member 
                img="hola"
                nombre="Victor Caro R."
                cargo="Tester"
                correo="vecr@live.cl"
              /> 
              <Member 
                img="hola"
                nombre="Valentina Gonzalez F."
                cargo="Frontend"
                correo="valegf3@gmail.com"
              /> 
              <Member 
                img="hola"
                nombre="Patricio López T."
                cargo="Backend"
                correo="patricio.lopez.taulis@gmail.com"
              /> 
              <Member 
                img="hola"
                nombre="Nicolás Machuca G."
                cargo="Frontend"
                correo="nikom_1912@hotmail.com"
              /> 
              <Member 
                img="hola"
                nombre="Vicente Rojas C."
                cargo="Tester"
                correo="vrojasclerc@gmail.com"
              />
               <Member 
                img="hola"
                nombre="Pablo Torres G."
                cargo="Jefe de Proyecto"
                correo="pablo.torres.g@ing.uchile.cl"
              />
            </div>
            </Container>
           </div>
          </Container>
          </div>
    )}
  }
  
  export class Member extends React.Component {

    state={
      nombre: this.props.nombre,
      cargo: this.props.cargo,
      correo: this.props.correo,
      img: this.props.img
  }
    render(){
      return(
        <Card border="dark" bg="secondary" className="member">
            {/* <img className={style.image} src={this.state.img} alt="" /> */}
            <h6 className="nombre">{this.state.nombre}</h6>
            <i className="letra"> {this.state.cargo} </i>
            <i className="letra"> {this.state.correo} </i>     
        </Card>
    )}
}