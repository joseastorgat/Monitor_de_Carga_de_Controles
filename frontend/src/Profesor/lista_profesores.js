import React from "react";
import {   Alert,Button,   Container,   Col,   Row,   Form,   FormControl,   InputGroup } from "react-bootstrap";
import ViewTitle from "../ViewTitle";
import { Link } from "react-router-dom";
import OptionButton from "../OptionButton";
import {Gear, Trashcan} from "@primer/octicons-react";
import {LinkContainer } from "react-router-bootstrap";

export default class lista_profesores extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profesores: [],
      showModal: false,
      evaluacionPorEliminar: null,
      MostrarProfesores: [],
      search: ""
    };

    this.deleteModalMsg = '¿Está seguro que desea eliminar la evaluacion?';
  }

  async fetchProfesores() {
    console.log("Fetching...")
    let profesores = [];
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
      (o.name.toString()+" " + o.codigo.toString() ).includes(busqueda)
    );
    console.log("Buscados")
    console.log(profesores_buscados)
    this.setState({MostrarProfesores: profesores_buscados});
  }

  update_Search(e){
    this.setState({search: e.target.value});
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
            <ViewTitle>Profesores</ViewTitle>
            <Row className="mb-3">
              <Col>

                <Form inline className="mr-auto" onSubmit={handle_search} >
                  <InputGroup
                    value={this.state.search}
                    onChange={update_Search} >
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
                  key={profesor.id}
                  nombre={profesor.nombre}
                  />
              ))}



            <ProfesorItem key="1" nombre="Jérémy Barbay"  />
            <ProfesorItem key="2" nombre="Sergio Ochoa"  />
          </Container>
          
          <LinkContainer  activeClassName=""  to="/administrar" className="float-left " style={{width: '7%', 'marginLeft':"10vw",borderRadius: '8px'}}>
                            <button >Volver</button>
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
      const nombre =this.props.nombre;
      return (
        <Alert variant="secondary">
            <Row>
              <Col xs="auto">
                {nombre}
              </Col>
              <Col className="text-center"></Col>
              <Col  xs="auto">
                 
                  <Link to={'profesores/${id}/editar'}>
                  <OptionButton icon={Gear} description="Modificar profesor"/>
                  </Link>

                  <OptionButton   icon={Trashcan} description="Eliminar profesor"  onClick={() => alert("No implementado")}    last={true}  />
              </Col>
            </Row>
            </Alert>
      );
    }
  }