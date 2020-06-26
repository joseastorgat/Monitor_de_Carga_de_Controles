import React from "react";
import {LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import OptionButton from "../common/OptionButton";
import {Pencil, Trashcan,ArrowLeft} from "@primer/octicons-react";
import DeleteModal from "../common/DeleteModal";
import { Table, Container} from "react-bootstrap";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ViewTitle from "../common/ViewTitle";

export class evaluaciones extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            evaluaciones: [],
            curso: {
                id: "",
                seccion: "",
                ramo: "",
                semestre: "",
                profesor: ""
            },
            showModal: false,
            evaluacionPorEliminar: {
                id: "",
                titulo: "",
                fecha: "",
                tipo: "",
                curso: ""
            },
            editar_index: -1,
            eliminar_index: -1,
            form_focus: false,

            id: "",
            fecha: "",
            tipo: "Control",
            titulo: "",
            
            evaluacion_modified: false,
            evaluacion_created: false,

            MostrarEvaluaciones: [],
            deleteModalMsg: "",
        //   search: ""
        };
        

        this.form = null

        this.divToFocus = React.createRef() //para focusear la caja de creacion de nueva evaluacion
    }

    onChange = e => {
        console.log("change")
        this.setState({
          [e.target.name]: 
          e.target.value
        })
        
    };

    onClickCancel = e => {
        e.preventDefault();
        this.form.reset()
        this.setState({
            editar_index: -1,
            form_focus: true,
            id: "",
            fecha: "",
            tipo: "Control",
            titulo: ""
        })
    }
    handleSubmit = e => {
        e.preventDefault();
        console.log("submit");
        console.log(this.state)
        if(this.state.editar_index >= 0){
            this.update_evaluacion();
        }
        else{
            this.create_evaluacion()
        }
    }

    //Scroll para nueva evaluacion
    handleClickNuevaEvaluacion = (e) => {
        e.preventDefault();
        this.form.reset()
        this.setState({
            editar_index: -1,
            form_focus: true,

            id: "",
            fecha: "",
            tipo: "Control",
            titulo: ""
        })
        
    }
    handleClickEditarEvaluacion = (i) => {
        // e.preventDefault()

        this.form.reset()
        this.setState({
            editar_index: i,
            form_focus: true,

            id: this.state.evaluaciones[i].id,
            fecha: this.state.evaluaciones[i].fecha,
            tipo: this.state.evaluaciones[i].tipo,
            titulo: this.state.evaluaciones[i].titulo
        })
        // window.location.href = "evaluaciones?editar=" + id
    }
    async fetchEvaluaciones() {
        console.log("Fetching...")
        const params= this.props.match.params
        var curso = await fetch(`http://127.0.0.1:8000/api/cursos/?semestre=${params.ano}&periodo=${params.semestre}&ramo=${params.cod}&seccion=${params.seccion}`)
                            .then(response => response.json())
        this.state.curso = curso[0]
        await fetch(`http://127.0.0.1:8000/api/cursos/${this.state.curso.id}/evaluaciones/`)
        .then(response => response.json())
        .then(evaluaciones =>
            this.setState({
            evaluaciones: evaluaciones.sort((a, b) => {
                if (a.fecha < b.fecha)
                  return -1;
                if (a.fecha > b.fecha)
                  return 1;
                return 0;
              }),
            MostrarEvaluaciones: evaluaciones,
          })
        )
    }

    update_evaluacion() {  
        console.log("post evaluacion ...")
        const url = `http://127.0.0.1:8000/api/evaluaciones/${this.state.id}/`
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
            "curso": this.state.curso.id
            }
        }
        console.log(options)
        axios(options)
        .then( (res) => {
            console.log("evaluacion updated");
            let evaluaciones = this.state.evaluaciones
            evaluaciones[this.state.editar_index] = res.data
            this.form.reset()
            this.setState({
                evaluacion_modified: true,
                evaluaciones: evaluaciones,
                eliminar_index: -1,
                editar_index: -1,
                id: "",
                fecha: "",
                tipo: "Control",
                titulo: ""
            });
            // window.location.reload(false);
        })
        .catch( (err) => {
            console.log(err);
            console.log("cant update evaluacion");
            alert("[ERROR] No se puedo actualizar la evaluación! ");
        });
    }


    async handleDelete() {
        let evaluacion = this.state.evaluacionPorEliminar
        let e = evaluacion.id
        let evaluaciones = this.state.evaluaciones
        let i = this.state.eliminar_index
        console.log(i)
        const titulo = evaluacion.titulo;
        const tipo = evaluacion.tipo;
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
        // alert(`Evaluacion Eliminada ${titulo} - ${tipo}`);
        evaluaciones.splice(i, 1);
        this.setState({
            evaluaciones :evaluaciones,
            eliminar_index: -1,
            editar_index: -1,
            showModal: false,

            id: "",
            fecha: "",
            tipo: "Control",
            titulo: ""
        });
      })
      .catch( (err) => {
        console.log(err);
        alert("[ERROR] No se puede eliminar la evaluación! ");
      });
    }

    create_evaluacion() {  
        console.log("post evaluaciones ...")
        var evaluaciones = this.state.evaluaciones
        const url = "http://127.0.0.1:8000/api/evaluaciones/"
        let options = {
          method: 'POST',
          url: url,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${this.props.auth.token}`
          },
          data: {
            "fecha": this.state.fecha,
            "tipo": this.state.tipo,
            "titulo": this.state.titulo,
            "curso": this.state.curso.id
        }
      }
      axios(options)
      .then( (res) => {
        console.log("create evaluacion");
        console.log(res);
        evaluaciones.push(res.data)
        this.form.reset()
        this.setState(
            {
                evaluacion_created: true,
                evaluaciones: evaluaciones,
                id: "",
                fecha: "",
                tipo: "Control",
                titulo: ""
            });
      })
      .catch( (err) => {
        console.log("cant create evaluacion");
        console.log(err);
        alert("[ERROR] No se pudo crear la evaluacion!");
      });
    }

    async componentDidMount() {
        this.fetchEvaluaciones();
        var id = this.state.id
        axios.get(`http://127.0.0.1:8000/api/evaluaciones/${id}/`)
        .then( (res) => { 
            this.setState({
                id: res.data.id,
                titulo: res.data.titulo,
                fecha: res.data.fecha,
                tipo: res.data.tipo,
                eliminar_index: -1
            })
        })      
    }
    async componentDidUpdate(){
        if(this.divToFocus.current && this.state.form_focus){
            this.divToFocus.current.scrollIntoView({
                behavior: "auto" ,
                // block: "nearest"
            })
        }
    }

    showModal(evaluacion, index) {
        this.setState({ 
            showModal: true, 
            evaluacionPorEliminar: evaluacion, 
            eliminar_index: index,
            deleteModalMsg: `¿Está seguro que desea eliminar ${evaluacion.tipo == "Tarea" ?  "la Tarea: " : "el Control: " } ${evaluacion.titulo}`
        });
    }
    
    handleCancel() {
        this.setState({ showModal: false, ramoPorEliminar: null });
    }

    createFormRender(){
        return (
            <form className="" name="form" ref={(e) => this.form = e} onSubmit={this.handleSubmit}> 
                <div className="generic-form" ref={this.divToFocus}>  
                    <h4>Nueva Evaluación</h4>
                    <div className="row">
                    <div className="col-sm-1"></div>        
                        <div className="col-sm-5">
                            <div className="row" >
                                <div className="col-sm-2" >
                                    <label >Título</label>
                                </div>
                                <div className="col-sm-10" >
                                    <input required type="text" className="form-control" name="titulo"  defaultValue={this.state.titulo} style={{textAlignLast:'center'}} onChange={this.onChange} />
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-5">
                            <div className="row" >
                                <div className="col-sm-2" >
                                    <label >Fecha</label>
                                </div>
                                <div className="col-sm-10" >
                                    <input required type="date" className="form-control" name="fecha"  defaultValue={this.state.fecha} style={{textAlignLast:'center'}} onChange={this.onChange}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1"></div>
                        <div className="col-sm-5" >
                            <div className="row" >
                                <div className="col-sm-2" >
                                    <label >Tipo</label>
                                </div>
    
                                <div className="custom-control custom-radio custom-control-inline"  >
                                    <input required type="radio" id="control" name="tipo" value="Control"  className="custom-control-input" onChange={this.onChange} checked={this.state.tipo == "Control"}/>
                                    <label className="custom-control-label" htmlFor="control">Control</label>
                                </div>
                                <div style={{textAlign:'center'}} className="custom-control custom-radio custom-control-inline" >
                                    <input type="radio" id="tarea" name="tipo" value="Tarea"  className="custom-control-input" onChange={this.onChange} checked={this.state.tipo == "Tarea"}/>
                                    <label className="custom-control-label" htmlFor="tarea" >Tarea</label>
                                </div>
                            </div>
                        </div>  
                    </div>
                    <div className="row">
                        <div className="col-sm-2"></div>                  
                        <button className="btn btn-secondary col-sm-2 float-left" onClick={this.onClickCancel}> Cancelar</button>
                        <div className="col-sm-5"></div>
                        <button type="submit" className="float-right btn btn-success col-sm-2">Guardar</button>
                        
                    </div>
                </div>
            </form>
        )
    }
    updateFormRender(){
        var ev = this.state.evaluaciones[this.state.editar_index];
        return (
            <form className="" name="form" ref={(e) => this.form = e} onSubmit={this.handleSubmit}> 
                <div className="generic-form" ref={this.divToFocus}>  
                    <h4>Editar {ev.tipo}: {ev.titulo}</h4>
                    <div className="row">
                    <div className="col-sm-1"></div>        
                        <div className="col-sm-5">
                            <div className="row" >
                                <div className="col-sm-2" >
                                    <label >Título</label>
                                </div>
                                <div className="col-sm-10" >
                                    <input type="text" className="form-control" name="titulo"  defaultValue={this.state.titulo} style={{textAlignLast:'center'}} onChange={this.onChange} />
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-5">
                            <div className="row" >
                                <div className="col-sm-2" >
                                    <label >Fecha</label>
                                </div>
                                <div className="col-sm-10" >
                                    <input type="date" className="form-control" name="fecha" defaultValue={this.state.fecha} style={{textAlignLast:'center'}} onChange={this.onChange}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1"></div>
                        <div className="col-sm-5" >
                            <div className="row" >
                                <div className="col-sm-2" >
                                    <label >Tipo</label>
                                </div>
    
                                <div className="custom-control custom-radio custom-control-inline"  >
                                    <input type="radio" id="control" value="Control" name="tipo"  className="custom-control-input" onChange={this.onChange} checked={this.state.tipo == "Control"}/>
                                    <label className="custom-control-label" htmlFor="control">Control</label>
                                </div>
                                <div style={{textAlign:'center'}} className="custom-control custom-radio custom-control-inline" >
                                    <input type="radio" id="tarea" value="Tarea" name="tipo"  className="custom-control-input" onChange={this.onChange} checked={this.state.tipo == "Tarea"}/>
                                    <label className="custom-control-label" htmlFor="tarea" >Tarea</label>
                                </div>
                            </div>
                        </div>  
                    </div>
                    <div className="row">
                        <div className="col-sm-2"></div>
                        {/* <LinkContainer activeClassName="" type="submit"  className="float-left btn btn-primary col-sm-2" to="./evaluaciones" style={{width: '7%','marginLeft':"14vw",borderRadius: '8px'}}> */}
                            <button className="btn btn-primary col-sm-2" type="submit">Actualizar Evaluación</button>
                        {/* </LinkContainer> */}
                        <div className="col-sm-4"></div>
                        <button className="btn btn-secondary col-sm-2" onClick={this.onClickCancel}> Cancelar</button>

                    </div>
                </div>
            </form>
        )
    }
    
    
    render() {
        return (
            <Container>
            <DeleteModal
                msg={this.state.deleteModalMsg}
                show={this.state.showModal}
                handleCancel={() => this.handleCancel()}
                handleDelete={() => this.handleDelete()}
            />
            <div>
            <ViewTitle>
            <Link  to="../../../"><OptionButton   icon={ArrowLeft} description="Volver a cursos" /></Link>
           Evaluaciones</ViewTitle>
                {/* <h4 className="titulo">Evaluaciones</h4> */}
                    <div className="generic-form border-0">  
                        <div className="col-sm-7" >
                            <div className="row">
                                <div className="col-sm-2" >
                                    <label >Curso</label>
                                </div>
                                <div className="col-sm-5" >
                                    <input type="text" className="form-control" name="nombre_curso" placeholder={this.state.curso.ramo + "-" + this.state.curso.seccion}  style={{textAlignLast:'center'}} readOnly="readonly"/>
                                </div>
                                    <LinkContainer to="#"  activeClassName="" onClick={this.handleClickNuevaEvaluacion} style={{'marginLeft':"3vw"}}>
                                        <button  className="btn btn-primary" >Agregar Evaluación</button>
                                    </LinkContainer>
                            </div>
                        </div>
                    </div>
                    <div className="generic-form border-0">
                        <Table size="sm" responsive className="table table-condensed">
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
                                showModal={() => this.showModal(evaluacion, _index)}
                                />
                            ))}

                        </Table>
                    </div>
                    
                    
                    {this.state.editar_index >= 0 ? this.updateFormRender() : this.createFormRender()}
                    
                    <Container style={{marginBottom:"8vw",marginTop:"2vw"}}>
                            <LinkContainer  activeClassName=""  to="../../../" className="float-left" >
                                <button className="btn btn-secondary">Volver a Cursos</button>
                            </LinkContainer>

                   </Container>
            </div>
            </Container>
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
      const handleDelete = this.props.handleDelete;
      const handleUpdate = this.props.handleUpdate;
      const i = this.props.index;
      const fec=fecha.split("-")
      const fecha_formato_m_d_y= fec[2]+"-"+fec[1]+"-"+fec[0]

      return (
        <thead >
            <tr >
            <td scope="col">{titulo}</td>
            <td scope="col">{fecha_formato_m_d_y}</td>
            <td scope="col">{tipo}</td>
            <td scope="col">
                <Link to="#" onClick={e => handleUpdate(i)}>
                    <OptionButton icon={Pencil} description="Modificar evaluación" />
                </Link>
                <OptionButton   icon={Trashcan} description="Eliminar evaluación"  onClick={() => this.props.showModal()}    last={true}  />
            </td>
            </tr>
        </thead>
      );
    }
  }

  const mapStateToProps = (state) => ({
    auth: state.auth
  });

  export default connect(mapStateToProps)(evaluaciones);