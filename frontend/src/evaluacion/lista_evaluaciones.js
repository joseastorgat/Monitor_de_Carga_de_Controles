import React from "react";
import { Alert,Button,   Container,   Col,   Row } from "react-bootstrap";
import ViewTitle from "../common/ViewTitle";
import { Link } from "react-router-dom";
import OptionButton from "../common/OptionButton";
import {Pencil, Trashcan} from "@primer/octicons-react";
import axios from "axios";
import DeleteModal from "../common/DeleteModal";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Nueva_evaluacion from "./nueva_evaluacion"

export class lista_evaluaciones extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        evaluaciones: [],
        semestres:[],
        cursos:[],
        showModal: false,
        showModalAdd:false,
        EvaluacionPorEliminar: null,
        MostrarEvaluaciones: [],
        MostrarSemestres: [],
        MostrarCursos: [],
        semestre_busqueda:"",
        curso_busqueda:"",
        search: false
      };
  
      this.deleteModalMsg = `¿Está seguro que desea eliminar la evaluacion `;
    }
    static propTypes = {
      auth: PropTypes.object.isRequired,
    };
  
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
      var curso=this.state.curso_busqueda.split("-")[0]
      if (curso==0){//Traer todas las evaluaciones de ese semestre
        url=`http://127.0.0.1:8000/api/semestres/${this.state.semestre_busqueda}/evaluaciones/`;
      }
      else{
        console.log(curso)
        url=`http://127.0.0.1:8000/api/cursos/${curso}/evaluaciones/`;
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
        var evaluaciones_agrupadas = evaluaciones.reduce(function (r, a) {
          r[a.semana] = r[a.semana] || [];
          r[a.semana].push(a);
          return r;
      }, Object.create(null))
      evaluaciones_agrupadas=this.json2array(evaluaciones_agrupadas)
        this.setState({
          evaluaciones: evaluaciones_agrupadas,
          MostrarEvaluaciones: evaluaciones_agrupadas})             
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

    showModal(evaluacion, index) {
      this.setState({ showModal: true, evaluacionPorEliminar: evaluacion, eliminar_index: index });
    }

    handleAdd(){
      this.setState({ showModalAdd: false});
      this.fetchEvaluaciones();
    }

    showModalAdd() {
      this.setState({ showModalAdd: true});
    }
  
    handleCancel() {
      this.setState({ showModal: false, evaluacionPorEliminar: null });
    }
    handleCancelAdd() {
      this.setState({ showModalAdd: false });
    }

    async handleDelete() {
      let e = this.state.evaluacionPorEliminar.id
      const url = `http://127.0.0.1:8000/api/evaluaciones/${e}/`
      let options = {
        method: 'DELETE',
        url: url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${this.props.auth.token}`
        }
      }
      axios(options)
        .then( (res) => {
          this.setState({
            showModal: false,
            evaluacionPorEliminar: null
          });
          this.fetchEvaluaciones();
        })
        .catch( (err) => {
          console.log(err);
          alert("[ERROR] No se pudo eliminar la evaluacion! ");
          this.setState({
            showModal: false,
            evaluacionPorEliminar: null
          });
        });
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
                          <option value={curso.id+"-"+curso.ramo+"-"+curso.seccion + " "+curso.nombre} >{curso.ramo} {curso.nombre}</option>         
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
                <Row ></Row><Row ></Row>
                
                {this.state.showModal &&
                <DeleteModal
                msg={this.deleteModalMsg+this.state.evaluacionPorEliminar.titulo+ " del curso "+ 
                this.state.evaluacionPorEliminar.nombre_curso +" seccion "+ this.state.evaluacionPorEliminar.seccion +" ?"}
                show={this.state.showModal}
                handleCancel={() => this.handleCancel()}
                handleDelete={() => this.handleDelete()}
                />}

                <Nueva_evaluacion
                    show_form={this.state.showModalAdd} 
                    handleCancel={() => this.handleCancelAdd()}
                    handleAdd={() => this.handleAdd()}
                    cursos={this.state.cursos}
                    curso_seleccionado={this.state.curso_busqueda}
                />

                <Container>
                { (this.state.MostrarEvaluaciones.length<1) ? (this.state.search ? <div><h5>No hay evaluaciones asociadas a este semestre</h5>
                  <Row className="float-right">
                 <Button className="btn btn-primary"  onClick={() => this.showModalAdd()}>Nueva Evaluacion</Button>
                  </Row></div>: "") : 
               <div>
               <Row className="float-right">
               <Col>
                 <Button className="btn btn-primary"  onClick={() => this.showModalAdd()}>Nueva Evaluacion</Button>
                 </Col>
                  </Row>
                <Row></Row>
                <Row></Row>
                <Row></Row>
                <Row></Row>
                <Row></Row>
                
                {this.state.MostrarEvaluaciones.map((s,i)=>
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
                    showModal={() => this.showModal(evaluacion, i)}
                    handleDelete = {this.handleDelete}
                    handleUpdate = {this.handleClickEditarEvaluacion}    
                />
                )}</div>
                )   }  </div>              
              }
              </Container>
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
      const fecha = this.props.fecha.split("-");
      // const tipo= this.props.tipo;
      // const id = this.props.id;
      const codigo_curso = this.props.codigo_curso;
      const nombre_curso= this.props.nombre_curso;
      const seccion_curso=this.props.seccion_curso;
      return (
        <Alert variant="secondary">
            <Row>
              <Col xs={5}>
                <h6>{codigo_curso}-{seccion_curso} {nombre_curso} </h6> 
                <p>{titulo}</p>
              </Col>
              <Col xs={5} className="text-center"> 
              <p>{fecha[2]}-{fecha[1]}-{fecha[0]}</p></Col>
              <Col xs="auto" className="float-left">
                  <Link to={'evaluaciones/${id}/editar'}>
                  <OptionButton icon={Pencil} description="Modificar evaluacion" />
                  </Link>

                  <OptionButton   icon={Trashcan} description="Eliminar evaluacion"  onClick={() => this.props.showModal()}     last={true}  />
              </Col>
            </Row>
            </Alert>
      );
    }
  }

const mapStateToProps = (state) => ({
    auth: state.auth
  });
    
export default connect(mapStateToProps)(lista_evaluaciones);