import React from "react";
import {LinkContainer } from "react-router-bootstrap";
import {   Alert, Button,   Container,   Col,   Row,   Form,   FormControl,   InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import OptionButton from "../OptionButton";
import {Gear, Trashcan} from "@primer/octicons-react";

export default class nueva_evaluacion extends React.Component {
    render() {
        return (
            <div>
                <h4 className="titulo">Agregar Evaluación</h4>
                    <form className="" name="form">
                        <div class="generic-form border-0">  
                            <div class="col-sm-5 " >
                                <div class="row">
                                    <div class="col-sm-2" >
                                        <label >Curso</label>
                                    </div>
                                    <div class="col-sm-10" >
                                        <input type="text" className="form-control" name="nombre_curso" placeholder="Algoritmo y Estructura de Datos"  style={{textAlignLast:'center'}} readonly="readonly"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="generic-form border-0">
                            <table class="table table-bordered">
                            <thead>
                                <tr>
                                <th scope="col">Nombre</th>
                                <th scope="col">Fecha</th>
                                <th scope="col">Tipo</th>
                                <th scope="col"></th>
                                </tr>
                            </thead>
                            {/* <tbody> */}
                                <EvaluacionItem key="1" id="1" fecha="02-05-2020" id_curso="CC3301" tipo="Tarea" titulo="Tarea 1"  />
                                <EvaluacionItem key="2" id="2" fecha="02-06-2020"id_curso="CC3301" tipo="Tarea" titulo="Tarea 2"  />
                                <EvaluacionItem key="3" id="3" fecha="15-05-2020"id_curso="CC3301" tipo="Control" titulo="Control 1"  />
                            {/* </tbody> */}
                            </table>
                        </div>
                        <div class="generic-form">  
                            <div class="row">
                            <div class="col-sm-1"></div>        
                                <div class="col-sm-5">
                                    <div class="row" >
                                        <div class="col-sm-2" >
                                            <label >Titulo</label>
                                        </div>
                                        <div class="col-sm-10" >
                                            <input type="text" className="form-control" name="titulo_evaluacion" placeholder="Control 1" style={{textAlignLast:'center'}}  />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-5">
                                    <div class="row" >
                                        <div class="col-sm-2" >
                                            <label >Fecha</label>
                                        </div>
                                        <div class="col-sm-10" >
                                            <input type="date" className="form-control" name="fecha_evaluacion"  style={{textAlignLast:'center'}}  />
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

                                        <div  class="custom-control custom-radio custom-control-inline" >
                                            <input type="radio" id="control" name="tipo_evaluacion" class="custom-control-input" />
                                            <label class="custom-control-label" htmlFor="control">Control</label>
                                        </div>
                                        <div style={{textAlign:'center'}} class="custom-control custom-radio custom-control-inline" >
                                            <input type="radio" id="tarea" name="tipo_evaluacion" class="custom-control-input" />
                                            <label class="custom-control-label" htmlFor="tarea" >Tarea</label>
                                        </div>
                                    </div>
                                </div>  
                            </div>

                            
                    
                        </div>
                        <div class="form-group" style={{'marginTop':"4rem"}}>
                        <LinkContainer  activeClassName=""  to="/evaluaciones" className="float-left " style={{width: '7%', 'marginLeft':"10vw",borderRadius: '8px'}}>
                            <button >Volver</button>
                        </LinkContainer>

                        <LinkContainer activeClassName=""  to="/evaluaciones" style={{width: '7%','marginRight':"14vw",borderRadius: '8px'}}>
                            <button type="submit">Guardar</button>
                        </LinkContainer>
                        </div>
                    </form>
            </div>
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
        <thead >
            <tr >
            <th scope="col">{titulo}</th>
            <th scope="col">{fecha}</th>
            <th scope="col">{tipo}</th>
            <th scope="col">
                <Link to={'evaluacion/${id}/editar'}>
                    <OptionButton icon={Gear} description="Modificar evaluacion" />
                </Link>
                <OptionButton   icon={Trashcan} description="Eliminar evaluacion"  onClick={() => alert("No implementado")}    last={true}  />
            </th>
            </tr>
        </thead>
      );
    }
  }