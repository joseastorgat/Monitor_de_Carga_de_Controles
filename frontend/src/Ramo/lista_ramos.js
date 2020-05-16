import React from "react";
import {   Alert,Button,   Container,   Col,   Row,   Form,   FormControl,   InputGroup } from "react-bootstrap";
import ViewTitle from "../ViewTitle";
import { Link } from "react-router-dom";
import OptionButton from "../OptionButton";
import { Gear, Trashcan} from "@primer/octicons-react";

export default class lista_ramos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ramos: [],
      showModal: false,
      ramoPorEliminar: null,
      MostrarRamos: [],
      search: ""
    };

    this.deleteModalMsg = `¿Está seguro que desea eliminar el ramo?`;
  }

    render() {
      const handle_search = e => {
        e.preventDefault();
        alert("No implementado, pero se busco "+ this.state.search)
      }

      const update_Search= e => {
        this.state.search=e.target.value;
      };

      return (
        <main>
          <Container>
            <ViewTitle>Ramos</ViewTitle>
            <Row className="mb-3">
              <Col>

                <Form inline className="mr-auto" onSubmit={handle_search} >
                  <InputGroup
                    value={this.state.search}
                    onChange={update_Search} >
                    <FormControl type="text" placeholder="Buscar Ramo" className="mr-sm-2" />
                    <Button type="submit">Buscar</Button>
                  </InputGroup>
                </Form>

              </Col>
              <Col xs="auto">
                <Link to="/ramos/nuevo_ramo">
                  <Button className="btn btn-primary">Nuevo Ramo</Button>
                </Link>
              </Col>
            </Row>




            <RamoItem key="1" id="1" semestre="5" codigo="CC3001" nombre="Algoritmo y Estructura de datos"  />
            <RamoItem key="2" id="2" semestre="6" codigo="CC3002" nombre="Metodologías de Diseño y Programación"  />
            <RamoItem key="3" id="3" semestre="6" codigo="CC3301" nombre="Programación de Software de Sistemas"  />
          </Container>
        </main>
      );
    }
  }


  class RamoItem extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      const nombre =this.props.nombre;
      const codigo = this.props.codigo;
      const semestre= this.props.semestre;
      const id = this.props.id;
      return (
        <Alert variant="secondary">
            <Row>
              <Col xs="auto">
                {codigo}   {nombre}
              </Col>
              <Col className="text-center"></Col>
              <Col  xs="auto">
                 
                  <Link to={`ramos/${id}/editar`}>
                  <OptionButton icon={Gear} description="Modificar ramo" />
                  </Link>

                  <OptionButton   icon={Trashcan} description="Eliminar ramo"  onClick={() => alert("No implementado")}    last={true}  />
              </Col>
            </Row>
            </Alert>
      );
    }
  }