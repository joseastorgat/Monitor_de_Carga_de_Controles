import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Modal } from "react-bootstrap";
import { Row} from "react-bootstrap";

export class nueva_evaluacion extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
				titulo: "",
                fecha: "",
                tipo:"Control",
                curso:null,
                evaluacion_created: false,
                nombre_curso:""
		}
	};
	static propTypes = {
			auth: PropTypes.object.isRequired,
    };

	onChange = e => {
			this.setState({
				[e.target.name]: 
				e.target.value
			})
	};

	handleSubmit = e => {
			e.preventDefault();
			console.log("submit");
			this.create_evaluacion();
	}

    create_evaluacion() {  
		console.log("post evaluacion ...")
        const url = "http://127.0.0.1:8000/api/evaluaciones/"
        let curso=this.state.curso
        if(curso==null){
            curso=this.props.curso_seleccionado.split("-")[0]
        }

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
                "curso": curso
				}
		}
		
		axios(options)
			.then( (res) => {
				console.log(res);
				console.log("create evauacion");
				this.setState({"evaluacion_created": true});
                this.state.sacar_pop_up()
                this.state.titulo=""
                this.state.fecha=""
                this.state.tipo="control"
			})
			.catch( (err) => {
				console.log(err);
				console.log("cant create evaluacion");
				alert("No se pudo crear evaluacion!");
                this.state.sacar_pop_up()
                this.state.titulo=""
                this.state.fecha=""
                this.state.tipo="control"
			});
	}

	render() {
        const { show_form, handleCancel, handleAdd} = this.props;
        const curso_info=this.props.curso_seleccionado.split("-") //se recibe id- codigo-seccion y nombre de curso
		this.state.sacar_pop_up=handleAdd;
		return (
			<Modal size="xl" centered show={show_form} onHide={() => handleCancel()}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Agregar nueva evaluación 
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
					<div>
                    <form className="" name="form" ref={(e) => this.form = e} onSubmit={this.handleSubmit}> 
                    <div className="row">
                        <div className="col-sm-1"></div>        
                            <div className="col-sm-5">
                                <div className="row" >
                                    <div className="col-sm-2" >
                                    <label >Curso</label>
                                    </div>
                                    <div className="col-sm-10" >{
                                        
                                        (curso_info[0]!=0) ?                                              
                                            <select className='form-control' name='curso' value={curso_info[0]} readOnly='readonly' placeholder={curso_info[1]}>
                                                <option > {curso_info[1]}-{curso_info[2]}</option>
                                            </select>
                                            :
                                            <select required className="form-control"  name="curso" style={{textAlignLast:'center',textAlign:'center'}} onChange={this.onChange} >
                                                <option value="" >Seleccione curso</option>
                                                    {this.props.cursos.slice(1,this.props.cursos.length).map(curso=>
                                                        <option value={curso.id} >{curso.ramo} {curso.nombre}</option>         
                                                        )}
                                            </select>
                                    
                                    }
                                            </div>
                                     </div>
                            </div>
                    </div>
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
                    <Row></Row>
                    <div style={{textAlign: 'center'}}>
                        <Button variant="success" type="submit">  Agregar </Button> 
                    </div>
            </form>			
					</div>
		</Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={() => handleCancel()}>
            Cancelar
          </Button>

        </Modal.Footer> */}
      </Modal>
			);
		} 
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(nueva_evaluacion);