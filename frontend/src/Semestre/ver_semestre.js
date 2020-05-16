import React from "react";
import {   Alert,Button,   Container,   Col,   Row,   Form,   FormControl,   InputGroup } from "react-bootstrap";
// import ViewTitle from "../ViewTitle";
import { Link } from "react-router-dom";
// import OptionButton from "../OptionButton";
// import { Gear, Trashcan} from "@primer/octicons-react";

// import {nuevo_curso} from "../Curso/index_curso";

class CursoItem extends React.Component {
    constructor(props) {
      super(props);

      this.info = {
        nombre: this.props.nombre,
        seccion: this.props.seccion,
        codigo: this.props.codigo
      };

      this.descriptions = {
        edit: "Modificar curso",
        visualize: "Visualizar curso",
        delete: "Eliminar curso"
      };
    }
  
    render() {
        
      return (
        <Link style={{ textDecoration: "none" }} to="">
          <Alert variant="primary">
            <Row>
              <Col>
                <p className="mb-0">
                  {this.props.codigo} {this.props.nombre}
                </p>
                <p className="mb-0">Sección {this.props.seccion}</p>
              </Col>
              {/* <Col xs="auto">
                <Link to={this.paths.visualize}>
                  <OptionButton
                    icon={Unfold}
                    description={this.descriptions.visualize}
                    onClick={() => alert("No implementado")}
                  />
                </Link>
                <Link to={this.paths.view}>
                  <OptionButton
                    icon={Gear}
                    description={this.descriptions.edit}
                  />
                </Link>
                <Link to={this.paths.delete}>
                  <OptionButton
                    icon={Trashcan}
                    description={this.descriptions.delete}
                    last={true}
                    onClick={() => showModal()}
                  />
                </Link> */}
              {/* </Col> */}
            </Row>
          </Alert>
        </Link>
      );
    }
  }
  

export default class ver_semestre extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render(){
        return(
            <div>
               <CursoItem id="1" nombre="Algoritmo y Estructura de Datos" codigo="CC3001" seccion="1" />
               <CursoItem id="2" nombre="Metodologías de Diseño y Programación" codigo="CC3002" seccion="1" />
               <CursoItem id="3" nombre="Programación de Software de Sistemas" codigo="CC3301" seccion="1" />
            </div>
        );
    }
}