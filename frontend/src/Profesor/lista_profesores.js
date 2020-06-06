import React from "react";
import {   Alert,Button,   Container,   Col,   Row,   Form,   FormControl,   InputGroup } from "react-bootstrap";
import ViewTitle from "../common/ViewTitle";
import { Link } from "react-router-dom";
import OptionButton from "../common/OptionButton";
import {Gear, Trashcan} from "@primer/octicons-react";
import {LinkContainer } from "react-router-bootstrap";

import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";

export default class lista_profesores extends React.Component {
  constructor(props) {
    super(props);
    this.handle_search = this.handle_search.bind(this);
    this.state = {
      profesores: [],
      showModal: false,
      evaluacionPorEliminar: null,
      MostrarProfesores: [],
      search: ""
    };

    this.deleteModalMsg = '¿Está seguro que desea eliminar el Profesor?';
  }

  async fetchProfesores() {
    console.log("Fetching...")
    // let profesores = [];
    await fetch(`http://127.0.0.1:8000/api/profesores/`)
    .then(response => response.json())
    .then(profesores =>
      this.setState({
        profesores: profesores,
        MostrarProfesores: profesores
      })
      )    
    console.log(this.state.profesores)
  }

  async componentDidMount() {
    this.fetchProfesores();
  }

  handle_search(){
    const busqueda= this.state.search;
    const profesores= this.state.profesores;
    const profesores_buscados= profesores.filter(o=>
      (o.nombre.toString()).includes(busqueda)
    );
    console.log("Buscados")
    console.log(profesores_buscados)
    this.setState({MostrarProfesores: profesores_buscados});
  }

  update_Search(e){
    this.setState({search: e.target.value});
  }
    render() {
      return (
        <main>
          <Container>
            <ViewTitle>Profesores</ViewTitle>
            <Row className="mb-3">
              <Col>

                <Form inline className="mr-auto" onSubmit={e => {e.preventDefault(); this.handle_search();}} >
                  <InputGroup
                    value={this.state.search}
                    onChange={e => this.update_Search(e)} >
                    <FormControl type="text" placeholder="Buscar Profesor" className="mr-sm-2" />
                    <Button type="submit">Buscar</Button>
                  </InputGroup>
                </Form>

              </Col>
              <Col xs="auto">
                <Link to="/profesores/nuevo_profesor">
                  <Button className="btn btn-primary">Nuevo Profesor</Button>
                </Link>
              </Col>
            </Row>
              {this.state.MostrarProfesores.map(profesor => (
                  <ProfesorItem
                  id={profesor.id}
                  nombre={profesor.nombre}
                  />
              ))}
          </Container>
          
          <LinkContainer  activeClassName=""  to="/administrar" className="float-left " style={{width: '7%', 'marginLeft':"10vw",borderRadius: '8px'}}>
                            <button className="btn btn-primary"> Volver</button>
          </LinkContainer>
        </main>
      );
    }
  }


  class ProfesorItem extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      const id = this.props.id
      const nombre =this.props.nombre;
      return (
        <Alert variant="secondary">
            <Row>
              <Col xs="auto">
                {nombre}
              </Col>
              <Col className="text-center"></Col>
              <Col  xs="auto">
                 
                  <Link to={`profesores/${id}/editar`}>
                  <OptionButton icon={Gear} description="Modificar profesor"/>
                  </Link>

                  <OptionButton   icon={Trashcan} description="Eliminar profesor"  onClick={() => alert("No implementado")}    last={true}  />
              </Col>
            </Row>
            </Alert>
      );
    }
  }