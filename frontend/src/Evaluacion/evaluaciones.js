import React from "react";
import {LinkContainer } from "react-router-bootstrap";
import {   Alert, Button,   Container,   Col,   Row,   Form,   FormControl,   InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import OptionButton from "../common/OptionButton";
import {Gear, Trashcan} from "@primer/octicons-react";

import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";

export class evaluaciones extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            evaluaciones: [],
            curso: null,
            showModal: false,
            evaluacionPorEliminar: null,

            id: "",
            fecha: "",
            tipo: "",
            titulo: "",
            curso: "-1",
            
            evaluacion_modified: false,
            evaluacion_created: false,

            MostrarEvaluaciones: [],
        //   search: ""
        };
        this.deleteModalMsg = '¿Está seguro que desea eliminar la evaluacion?';
        this.divToFocus = React.createRef() //para focusear la caja de creacion de nueva evaluacion
    }

    onChange = e => {
        this.setState({
          [e.target.name]: 
          e.target.value
        })
        console.log(this.state)
    };

    handleSubmit = e => {
        const query = new URLSearchParams(this.props.location.search);
        e.preventDefault();
        console.log("submit");
        if(query.get("editar")){
            this.update_evaluacion();
        }
        else{
            this.create_evaluacion()
        }
        
    }

    //Scroll para nueva evaluacion
    handleClickNuevaEvaluacion = (e) => {
        e.preventDefault()
        
        window.location.href = "evaluaciones?nueva=1"
    }
    handleClickEditarEvaluacion = (id) => {
        // e.preventDefault()
        window.location.href = "evaluaciones?editar=" + id
    }
    async fetchEvaluaciones() {
        const query = new URLSearchParams(this.props.location.search);
        console.log("Fetching...")
        await fetch(`http://127.0.0.1:8000/api/evaluaciones/`)
        .then(response => response.json())
        .then(evaluaciones =>
            this.setState({
            evaluaciones: evaluaciones,
            MostrarEvaluaciones: evaluaciones,
            evaluacionPorEditar: query.get("editar") ? evaluaciones.find(o =>
                o.id == query.get("editar")) : null
          })
        )
    }

    update_evaluacion() {  
        console.log("post evaluacion ...")
        console.log(this.state)
        const url = `http://127.0.0.1:8000/api/evaluaciones/${this.state.id}/`
        console.log(url)
        let options = {
          method: 'PATCH',
          url: url,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${this.props.auth.token}`
          },
          data: {
            "fecha": this.state.fecha,
            "tipo": this.state.tipo,
            "titulo": this.state.titulo,
            "curso": this.state.curso
            }
        }
        axios(options)
        .then( (res) => {
            console.log(res);
            console.log("evaluacion updated");
            this.setState({"evaluacion_modified": true});
            window.location.reload(false);
        })
        .catch( (err) => {
            console.log(err);
            console.log("cant update evaluacion");
            alert("[ERROR] No se puedo actualizar la evaluacion! ");
        });
    }


    handleDelete = (e, i) => {
    
        let evaluaciones = this.state.evaluaciones;
        const titulo = evaluaciones[i]["titulo"];
        const tipo = evaluaciones[i]["tipo"];
        console.log("Eliminar: ", evaluaciones[i]);
    
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
        alert(`Evaluacion Eliminada ${titulo} - ${tipo}`);
        evaluaciones.splice(i, 1);
        this.setState({evaluaciones :evaluaciones});
      })
      .catch( (err) => {
        console.log(err);
        alert("[ERROR] No se puede eliminar la evaluacion! ");
      });
    }

    create_evaluacion() {  
        console.log("post evaluaciones ...")
        console.log(this.state)
        const url = "http://127.0.0.1:8000/api/evaluaciones/"
        let options = {
          method: 'POST',
          url: url,
          headers: {
        
            'Content-Type': 'application/json',
            'Authorization': `Token ${this.props.auth.token}`
          },
          //falta buscar id curso
          data: {
            "fecha": this.state.fecha,
            "tipo": this.state.tipo,
            "titulo": this.state.titulo,
            "curso": this.state.curso
        }
      }
      axios(options)
      .then( (res) => {
        console.log(res);
        console.log("create evaluacion");
        this.setState({"evaluacion_created": true});
      })
      .catch( (err) => {
        console.log(err);
        console.log("cant create evaluacion");
        alert("[ERROR] No se pudo crear la evaluacion!");
      });
    }
    async componentDidMount() {
        this.fetchEvaluaciones();
        const query = new URLSearchParams(this.props.location.search);
        var id = query.get('editar')
        console.log("DCJSJjd")
        console.log(id)
        axios.get(`http://127.0.0.1:8000/api/evaluaciones/${id}/`)
        .then( (res) => { 
            this.setState({
                
                id: res.data.id,
                titulo: res.data.titulo,
                fecha: res.data.fecha,
                curso: res.data.curso,
                tipo: res.data.tipo
            })
        })
        
    }
    async componentDidUpdate(){
        const query = new URLSearchParams(this.props.location.search);
        if(this.divToFocus.current && query.get("nueva") == 1 || query.get("editar")){
            this.divToFocus.current.scrollIntoView({
                behavior: "auto" ,
                // block: "nearest"
            })
        }
    }
    createFormRender(){
        return (
            <form className="" name="form" onSubmit={this.handleSubmit}> 
                <div class="generic-form" ref={this.divToFocus}>  
                    <h4>Nueva Evaluacion</h4>
                    <div class="row">
                    <div class="col-sm-1"></div>        
                        <div class="col-sm-5">
                            <div class="row" >
                                <div class="col-sm-2" >
                                    <label >Titulo</label>
                                </div>
                                <div class="col-sm-10" >
                                    <input type="text" className="form-control" name="titulo"  style={{textAlignLast:'center'}} onChange={this.onChange} />
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-5">
                            <div class="row" >
                                <div class="col-sm-2" >
                                    <label >Fecha</label>
                                </div>
                                <div class="col-sm-10" >
                                    <input type="date" className="form-control" name="fecha"  style={{textAlignLast:'center'}} onChange={this.onChange}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-1"></div>
                        <div class="col-sm-5" >
                            <div class="row" >
                                <div class="col-sm-2" >
                                    <label >Tipo</label>
                                </div>
    
                                <div class="custom-control custom-radio custom-control-inline"  >
                                    <input type="radio" id="control" name="tipo" value="Control" class="custom-control-input" onChange={this.onChange}/>
                                    <label class="custom-control-label" htmlFor="control">Control</label>
                                </div>
                                <div style={{textAlign:'center'}} class="custom-control custom-radio custom-control-inline" >
                                    <input type="radio" id="tarea" name="tipo" value="Tarea" class="custom-control-input" onChange={this.onChange}/>
                                    <label class="custom-control-label" htmlFor="tarea" >Tarea</label>
                                </div>
                            </div>
                        </div>  
                    </div>
                    <div class="row">
                        <div class="col-sm-2"></div>
 
                        <button type="submit" className="float-left btn btn-primary col-sm-1">Guardar</button>
                        <div class="col-sm-5"></div>
                        <LinkContainer  activeClassName=""  to="./evaluaciones" className="float-right btn btn-secondary col-sm-1" style={{width: '7%','marginRight':"14vw",borderRadius: '8px'}}>
                            <button> Cancelar</button>
                        </LinkContainer>
                    </div>
                </div>
            </form>
        )
    }
    updateFormRender(){
        var ev = this.state.evaluacionPorEditar;
        return (
            <form className="" name="form" onSubmit={this.handleSubmit}> 
                <div class="generic-form" ref={this.divToFocus}>  
                    <h4>Editar {ev.tipo}: {ev.titulo}</h4>
                    <div class="row">
                    <div class="col-sm-1"></div>        
                        <div class="col-sm-5">
                            <div class="row" >
                                <div class="col-sm-2" >
                                    <label >Titulo</label>
                                </div>
                                <div class="col-sm-10" >
                                    <input type="text" className="form-control" name="titulo" defaultValue={ev.titulo} style={{textAlignLast:'center'}} onChange={this.onChange} />
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-5">
                            <div class="row" >
                                <div class="col-sm-2" >
                                    <label >Fecha</label>
                                </div>
                                <div class="col-sm-10" >
                                    <input type="date" className="form-control" name="fecha" defaultValue={ev.fecha} style={{textAlignLast:'center'}} onChange={this.onChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-1"></div>
                        <div class="col-sm-5" >
                            <div class="row" >
                                <div class="col-sm-2" >
                                    <label >Tipo</label>
                                </div>
    
                                <div class="custom-control custom-radio custom-control-inline"  >
                                    <input type="radio" id="control" value="Control" name="tipo" class="custom-control-input" onChange={this.onChange} checked={this.state.tipo == "Control"}/>
                                    <label class="custom-control-label" htmlFor="control">Control</label>
                                </div>
                                <div style={{textAlign:'center'}} class="custom-control custom-radio custom-control-inline" >
                                    <input type="radio" id="tarea" value="Tarea" name="tipo" class="custom-control-input" onChange={this.onChange} checked={this.state.tipo == "Tarea"}/>
                                    <label class="custom-control-label" htmlFor="tarea" >Tarea</label>
                                </div>
                            </div>
                        </div>  
                    </div>
                    <div class="row">
                        <div class="col-sm-2"></div>
                        {/* <LinkContainer activeClassName="" type="submit"  className="float-left btn btn-primary col-sm-2" to="./evaluaciones" style={{width: '7%','marginLeft':"14vw",borderRadius: '8px'}}> */}
                            <button href="./evaluaciones" className="btn btn-primary col-sm-2" type="submit">Actualizar Evaluacion</button>
                        {/* </LinkContainer> */}
                        <div class="col-sm-4"></div>
                        <LinkContainer  activeClassName=""  to="./evaluaciones" className="float-right btn btn-secondary col-sm-1" style={{width: '7%','marginRight':"14vw",borderRadius: '8px'}}>
                            <button> Cancelar</button>
                        </LinkContainer>
                    </div>
                </div>
            </form>
        )
    }
    
    
    render() {
        return [(

            <div>
                <h4 className="titulo">Evaluaciones</h4>
                    <div class="generic-form border-0">  
                        <div class="col-sm-7" >
                            <div class="row">
                                <div class="col-sm-2" >
                                    <label >Curso</label>
                                </div>
                                <div class="col-sm-5" >
                                    <input type="text" className="form-control" name="nombre_curso" placeholder="CC3001-1 Otoño 2020"   style={{textAlignLast:'center'}} readOnly="readonly"/>
                                </div>
                                    <LinkContainer  activeClassName=""  to="#" onClick={this.handleClickNuevaEvaluacion} className="float-left col-sm-3"  style={{width: '7%', 'marginLeft':"3vw",borderRadius: '8px'}}>
                                        <button  className="btn btn-primary" >Agregar Evaluacion</button>
                                    </LinkContainer>
                            </div>
                        </div>
                    </div>
                    <div class="generic-form border-0">
                        <table class="table table-condensed">
                        <thead>
                            <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Fecha</th>
                            <th scope="col">Tipo</th>
                            <th scope="col"></th>
                            </tr>
                        </thead>
                            {this.state.MostrarEvaluaciones.map((evaluacion, _index) => (
                                <EvaluacionItem
                                key={evaluacion.id}
                                id={evaluacion.id}
                                index = {_index}
                                fecha={evaluacion.fecha}
                                id_curso={evaluacion.curso}
                                tipo={evaluacion.tipo}
                                titulo={evaluacion.titulo}
                                showModal={() => this.showModal(evaluacion)}
                                handleDelete = {this.handleDelete}
                                handleUpdate = {this.handleClickEditarEvaluacion}
                                />
                            ))}
                        {/* <tbody> */}
                            {/* <EvaluacionItem key="1" id="1" fecha="02-05-2020" id_curso="CC3301" tipo="Tarea" titulo="Tarea 1"  />
                            <EvaluacionItem key="2" id="2" fecha="02-06-2020" id_curso="CC3301" tipo="Tarea" titulo="Tarea 2"  />
                            <EvaluacionItem key="3" id="3" fecha="15-05-2020" id_curso="CC3301" tipo="Control" titulo="Control 1"  /> */}
                        {/* </tbody> */}
                        </table>
                    </div>
                    
                    
                    {this.state.evaluacionPorEditar ? this.updateFormRender() : this.createFormRender()}
                    
                    <div class="form-group" style={{'marginTop':"4rem"}}>
                            <LinkContainer  activeClassName=""  to="../../" className="float-left" style={{width: '7%', 'marginLeft':"10vw",borderRadius: '8px'}}>
                                <button className="btn btn-primary">Volver</button>
                            </LinkContainer>

                    </div>
            </div>
        )];
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
      const handleDelete = this.props.handleDelete;
      const handleUpdate = this.props.handleUpdate;
      const i = this.props.index;

      return (
        <thead >
            <tr >
            <th scope="col">{titulo}</th>
            <th scope="col">{fecha}</th>
            <th scope="col">{tipo}</th>
            <th scope="col">
                <Link onClick={e => handleUpdate(id)}>
                    <OptionButton icon={Gear} description="Modificar evaluacion" />
                </Link>
                <OptionButton   icon={Trashcan} description="Eliminar evaluacion"  onClick={e => handleDelete(id, i)}    last={true}  />
            </th>
            </tr>
        </thead>
      );
    }
  }

  const mapStateToProps = (state) => ({
    auth: state.auth
  });

  export default connect(mapStateToProps)(evaluaciones);