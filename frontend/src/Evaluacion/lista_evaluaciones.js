import React from "react";
import {   Alert,Button,   Container,   Col,   Row,   Form,   FormControl,   InputGroup } from "react-bootstrap";
import ViewTitle from "../ViewTitle";
import { Link } from "react-router-dom";
import OptionButton from "../OptionButton";
import {Gear, Trashcan} from "@primer/octicons-react";
import {LinkContainer } from "react-router-bootstrap";

export default class lista_evaluaciones extends React.Component {
    constructor(props) {
      super(props);
      this.handle_search = this.handle_search.bind(this);
      this.state = {
        evaluaciones: [],
        showModal: false,
        EvaluacionPorEliminar: null,
        MostrarEvaluaciones: [],
        search: ""
      };
  
      this.deleteModalMsg = `¿Está seguro que desea eliminar el Evaluacion?`;
    }
  
  
    async fetchEvaluaciones() {
      console.log("Fetching...")
      let evaluaciones = [];
      await fetch(`http://127.0.0.1:8000/api/evaluaciones/`)
      .then(response => response.json())
      .then(evaluaciones =>
        this.setState({
          evaluaciones: evaluaciones,
          MostrarEvaluaciones: evaluaciones
        })
        )    
      console.log(this.state.evaluaciones)
    }
  
    async componentDidMount() {
      this.fetchEvaluaciones();
    }
  
    handle_search(){
      const busqueda= this.state.search;
      const evaluaciones= this.state.evaluaciones;
      const evaluaciones_buscadas= evaluaciones.filter(o=>
        (o.name.toString()+" " + o.codigo.toString() ).includes(busqueda)
      );
      console.log("Buscados")
      console.log(evaluaciones_buscadas)
      this.setState({MostrarEvaluaciones: evaluaciones_buscadas});
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
            <ViewTitle>Evaluaciones</ViewTitle>
            <Row className="mb-3">
              <Col>

                <Form inline className="mr-auto" onSubmit={handle_search} >
                  <InputGroup
                    value={this.state.search}
                    onChange={update_Search} >
                    <FormControl type="text" placeholder="Buscar Evaluación" className="mr-sm-2" />
                    <Button type="submit">Buscar</Button>
                  </InputGroup>
                </Form>

              </Col>
              <Col xs="auto">
                <Link to="/evaluaciones/nueva_evaluacion">
                  <Button className="btn btn-primary">Nueva Evaluacion</Button>
                </Link>
              </Col>
            </Row>
                {this.state.MostrarEvaluaciones.map(evaluacion => (
                <EvaluacionItem
                key={evaluacion.id}
                id={evaluacion.id}
                id_curso={evaluacion.id_curso}
                tipo={evaluacion.tipo}
                titulo={evaluacion.titulo}
                showModal={() => this.showModal(evaluacion)}
                />
            ))}

            <EvaluacionItem key="1" id="1" id_curso="CC3301" tipo="Tarea" titulo="Tarea 1"  />
            <EvaluacionItem key="2" id="2" id_curso="CC3301" tipo="Tarea" titulo="Tarea 2"  />
            <EvaluacionItem key="3" id="3" id_curso="CC3301" tipo="Control" titulo="Control 1"  />
          </Container>
          
          <LinkContainer  activeClassName=""  to="/administrar" className="float-left " style={{width: '7%', 'marginLeft':"10vw",borderRadius: '8px'}}>
                            <button >Volver</button>
          </LinkContainer>
        </main>
      );
    }
  }


  class EvaluacionItem extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      const titulo =this.props.titulo;
      const fecha = this.props.fecha;
      const tipo= this.props.tipo;
      const id = this.props.id;
      const id_curso = this.props.id_curso;
      return (
        <Alert variant="secondary">
            <Row>
              <Col xs="auto">
                {id_curso}   {titulo}
              </Col>
              <Col className="text-center"></Col>
              <Col  xs="auto">
                 
                  <Link to={'evaluaciones/${id}/editar'}>
                  <OptionButton icon={Gear} description="Modificar evaluacion" />
                  </Link>

                  <OptionButton   icon={Trashcan} description="Eliminar evaluacion"  onClick={() => alert("No implementado")}    last={true}  />
              </Col>
            </Row>
            </Alert>
      );
    }
  }