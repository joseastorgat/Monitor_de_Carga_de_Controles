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
        search: false
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
      .then(response => {
        // Primer valor default de ramos
        response.data.splice(0,0,{"id": 0, "ramo": "Todos","nombre": " ",semana:0})
          this.setState({
              cursos: response.data,
              MostrarCursos: response.data
            })
          })
  };
  onChange_Curso = (e) => {  
    this.setState({
      [e.target.name]: 
      e.target.value
    })
  }
    async fetchEvaluaciones() {
      console.log("Fetching Evaluaciones ...")
      let url
      if (this.state.curso_busqueda==0){//Traer todas las evaluaciones de ese semestre
        url=`http://127.0.0.1:8000/api/semestres/${this.state.semestre_busqueda}/evaluaciones/`;
      }
      else{
        url=`http://127.0.0.1:8000/api/cursos/${this.state.curso_busqueda}/evaluaciones/`;
      }
      await fetch(url)
      .then(response => response.json())
      .then(evaluaciones =>{
        evaluaciones.sort((a, b) => {
          if (a.fecha < b.fecha)
            return -1;
          if (a.fecha > b.fecha)
            return 1;
          return 0;
        })
        // var evaluaciones_agrupadas=evaluaciones.reduce(function(result, current) {
        //     result[current.semana] = result[current.semana] || [];
        //     result[current.semana].push(current);
        //     return result;
        // }, {});
        var evaluaciones_agrupadas = evaluaciones.reduce(function (r, a) {
          r[a.semana] = r[a.semana] || [];
          r[a.semana].push(a);
          return r;
      }, Object.create(null))
      evaluaciones_agrupadas=this.json2array(evaluaciones_agrupadas)
        this.setState({
          evaluaciones: evaluaciones_agrupadas,
          MostrarEvaluaciones: evaluaciones_agrupadas})
          // console.log(evaluaciones_agrupadas)
             
         })    
      this.setState({search:true})
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

    json2array(json){
      var result = [];
      var keys = Object.keys(json);
      keys.forEach(function(key){
          result.push([key,json[key]]
            );
      });
      return result;
  }
  
    validar_busqueda = (e) =>{
      e.preventDefault();
     this.fetchEvaluaciones();
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
                { (this.state.MostrarEvaluaciones.length<1) ? (this.state.search ? <h5>No hay evaluaciones asociadas a este semestre</h5>: "") : 
               
                this.state.MostrarEvaluaciones.map((s,i)=>
                  <div>
                  <h5>Semana {s[0]}</h5>
                  {s[1].map(evaluacion=> 
                  <EvaluacionItem
                key={evaluacion.id}
                id_evaluacion={evaluacion.id}
                id_curso={evaluacion.curso}
                nombre_curso={evaluacion.nombre_curso}
                codigo_curso={evaluacion.codigo}
                seccion_curso={evaluacion.seccion}
                fecha={evaluacion.fecha}
                tipo={evaluacion.tipo}
                titulo={evaluacion.titulo}
                showModal={() => this.showModal(evaluacion)
                }
                />
                
                
                
                )}</div>
                )                   
                
              }
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
      console.log(titulo)
      const fecha = this.props.fecha;
      const tipo= this.props.tipo;
      const id = this.props.id;
      const codigo_curso = this.props.codigo_curso;
      const nombre_curso= this.props.nombre_curso;
      const seccion_curso=this.props.seccion_curso;
      return (
        <Alert variant="secondary">
            <Row>
              <Col xs="auto">
                <h6>{codigo_curso}-{seccion_curso} {nombre_curso} </h6> 
                <p>{titulo}</p>
                <p>{fecha}</p>
              </Col>
              <Col className="text-center"></Col>
              <Col xs="auto">
                 
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