import React from "react";
import {   Alert,Button,   Container,   Col,   Row,   Form,   FormControl,   InputGroup } from "react-bootstrap";
import ViewTitle from "../common/ViewTitle";
import { Link } from "react-router-dom";
import OptionButton from "../common/OptionButton";
import { Pencil, Trashcan, Calendar } from "@primer/octicons-react";
import { LinkContainer } from "react-router-bootstrap";

export default class lista_semestre extends React.Component {
  constructor(props) {
    super(props);
    this.handle_search = this.handle_search.bind(this);
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

  
  async fetchSemestres() {
    console.log("Fetching...")
    await fetch(`http://127.0.0.1:8000/api/semestres/`)
    .then(response => response.json())
    .then(semestres =>
      this.setState({
        semestres: semestres.sort((a, b) => {
          if (a.año < b.año)
            return -1;
          if (a.año> b.año)
            return 1;
          return 0;
        }),
        MostrarSemestres: semestres
      })
      )    
  }

  async componentDidMount() {
    this.fetchSemestres();
  }

  handle_search(){
    const busqueda= this.state.search;
    const Semestres= this.state.semestres;
    const Semestres_buscados= Semestres.filter(o=>
      (o.año.toString()+" " + (o.periodo===1 ? ("Otoño") : ("Primavera"))).includes(busqueda)
    );
    console.log("Buscados")
    console.log(Semestres_buscados)
    this.setState({MostrarSemestres: Semestres_buscados});
  }

  update_Search(e){
    this.setState({search: e.target.value});
  }

  render() {
      return (
        <main>
        <Container>
          <Container>
            <ViewTitle>Semestres</ViewTitle>
            <Row className="mb-3">
              <Col>

                <Form inline className="mr-auto" onSubmit={e => {e.preventDefault(); this.handle_search();}} >
                  <InputGroup
                    value={this.state.search}
                    onChange={e => this.update_Search(e)} >
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

            {this.state.MostrarSemestres.map(semestre => (
            <SemesterItem
              id={semestre.id}
              año={semestre.año}
              semestre={ semestre.periodo==1 ? ("Otoño") : ("Primavera")}
              showModal={() => this.showModal(semestre)}
            />
          ))}

          </Container>

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
      const id_periodo=(semestre==="Otoño" ? 1 : 2)
      return (
        <Link to={`semestres/${año}/${semestre}/`}>    

        <Alert variant="secondary">
            <Row>
              <Col xs="auto">
                {año} {semestre}
              </Col>
              <Col className="text-center"></Col>
              <Col  xs="auto">
                  <Link to={`/calendar/${año}/${id_periodo}/`} >
                    <OptionButton  icon={Calendar}  description="Visualizar semestre" />
                  </Link>
                  <Link to={`semestres/${año}/${semestre}/editar`} >
                    <OptionButton icon={Pencil} description="Modificar semestre" />
                  </Link>

                  <OptionButton   icon={Trashcan} description="Eliminar semestre"  onClick={() => alert("No implementado")}    last={true}  />
              </Col>
            </Row>
            </Alert>
            </Link>
      );
    }
  }