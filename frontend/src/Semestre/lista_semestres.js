import React from "react";
import {   Alert,Button,   Container,   Col,   Row,   Form,   FormControl,   InputGroup } from "react-bootstrap";
import ViewTitle from "../ViewTitle";
import { Link } from "react-router-dom";
import OptionButton from "../OptionButton";
import { Gear, Trashcan, Unfold } from "@primer/octicons-react";

export default class lista_semestre extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      semestres: [],
      showModal: false,
      semestrePorEliminar: null,
      MostrarSemestres: [],
      search: ""
    };

    this.deleteModalMsg = `¿Está seguro que desea eliminar el semestre?
    Recuerde que esto borrara todos los cursos y evaluaciones asociadas.`;
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
            <ViewTitle>Semestres</ViewTitle>
            <Row className="mb-3">
              <Col>

                <Form inline className="mr-auto" onSubmit={handle_search} >
                  <InputGroup
                    value={this.state.search}
                    onChange={update_Search} >
                    <FormControl type="text" placeholder="Buscar Semestre" className="mr-sm-2" />
                    <Button type="submit">Buscar</Button>
                  </InputGroup>
                </Form>

              </Col>
              <Col xs="auto">
                <Link to="/semestres/nuevo_semestre">
                  <Button className="btn btn-primary">Nuevo Semestre</Button>
                </Link>
              </Col>
            </Row>

            <SemesterItem id="1" año="2020" semestre="otoño" />
            <SemesterItem id="2" año="2020" semestre="primavera" />
            <SemesterItem id="3" año="2019" semestre="otoño" />
            <SemesterItem id="4" año="2019" semestre="primavera" />
          </Container>
        </main>
      );
    }
  }


  class SemesterItem extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      const año=this.props.año;
      const semestre= this.props.semestre;
      const id= this.props.id;
      console.log(año+ "" + semestre)
      return (
        <Link to={`semestres/${año}/${semestre}`}>    
        <Alert variant="secondary">
            <Row>
              <Col xs="auto">
                {año} {semestre}
              </Col>
              <Col className="text-center"></Col>
              <Col  xs="auto">
                  <OptionButton  icon={Unfold}  description="Visualizar semestre"  onClick={() => alert("No implementado")} />
  
                  <Link to={`semestres/${año}/${semestre}/editar`}>
                    <OptionButton icon={Gear} description="Modificar semestre" />
                  </Link>

                  <OptionButton   icon={Trashcan} description="Eliminar semestre"  onClick={() => alert("No implementado")}    last={true}  />
              </Col>
            </Row>
            </Alert>
            </Link>
      );
    }
  }