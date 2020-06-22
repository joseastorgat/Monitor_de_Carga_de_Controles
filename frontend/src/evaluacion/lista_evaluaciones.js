import React from "react";
import { Alert,Button,   Container,   Col,   Row } from "react-bootstrap";
import ViewTitle from "../common/ViewTitle";
import { Link } from "react-router-dom";
import OptionButton from "../common/OptionButton";
import {Gear, Trashcan} from "@primer/octicons-react";
import axios from "axios";

export default class lista_evaluaciones extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        evaluaciones: [],
        semestres:[],
        cursos:[],
        showModal: false,
        EvaluacionPorEliminar: null,
        MostrarEvaluaciones: [],
        MostrarSemestres: [],
        MostrarCursos: [],
        semestre_busqueda:"",
        curso_busqueda:"",
        search: ""
      };
  
      this.deleteModalMsg = `¿Está seguro que desea eliminar el Evaluacion?`;
    }
  
    onChange_Semestre = (e) => {  
      this.setState({
        [e.target.name]: 
        e.target.value
      })
      console.log("Fetching Cursos...")
      axios.get(`http://127.0.0.1:8000/api/semestres/${e.target.value}/cursos/`)
      .then(response =>
          this.setState({
              cursos: response.data,
              MostrarCursos: response.data
            })
          )
  };
  onChange_Curso = (e) => {  
    this.setState({
      [e.target.name]: 
      e.target.value
    })
  }
    async fetchEvaluaciones() {
      console.log("Fetching Evaluaciones ...")
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

    async fetchSemestres() {
      console.log("Fetching Semestres...")
      await fetch(`http://127.0.0.1:8000/api/semestres/`)
      .then(response => response.json())
      .then(semestres =>
        this.setState({
          semestres: semestres,
          MostrarSemestres: semestres
        })
      )    
    }

    async componentDidMount() {
      this.fetchSemestres();
    }
  
    validar_busqueda(){
      
      return false;
    }

    render() {
      return (
        <main>
          <Container>
            <ViewTitle>Evaluaciones</ViewTitle>
            <form onSubmit={this.validar_busqueda}>
            <Row >
              <Col xs={4}> 
                  <p>Semestre
                    <select required className="form-control"  name="semestre_busqueda" style={{textAlignLast:'center',textAlign:'center'}} onChange={this.onChange_Semestre} >
                        <option value="" >Seleccione semestre</option>
                        {this.state.MostrarSemestres.map(semestre=>
                          <option value={semestre.id} >{semestre.año} {semestre.periodo===1 ? "Otoño": "Primavera" }</option>         
                        )}
                    </select>
                  </p>
              </Col>
              <Col xs={4}>
                <p>Curso
                <select required className="form-control"  name="curso_busqueda" style={{textAlignLast:'center',textAlign:'center'}} value={this.state.curso_busqueda} onChange={this.onChange_Curso} >
                    <option value="" >Seleccione curso</option>
                    {this.state.MostrarCursos.map(curso=>
                          <option value={curso.id} >{curso.ramo} {curso.nombre}</option>         
                        )}
                    
                </select>
                </p>
                
              </Col>
              <Col >
              <Row></Row>
              <Button className="btn btn-primary" style={{height: "50px" }} type="submit">Buscar</Button>
              </Col>
              
                </Row>
                </form>
                <Row ></Row><Row ></Row><Row ></Row>
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
          </Container>
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