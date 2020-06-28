import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Modal } from "react-bootstrap";
import { Row} from "react-bootstrap";

export class editar_evaluacion extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
				titulo: this.props.evaluacion.titulo,
                fecha: this.props.evaluacion.fecha,
                tipo:this.props.evaluacion.tipo,
                curso:this.props.evaluacion.curso,
                evaluacion_update: false,
                id:this.props.evaluacion.id,
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
			this.update_evaluacion();
	}

    update_evaluacion() {  
        console.log("post evaluacion ...")
        console.log(this.state.fecha)
        console.log(this.state.tipo)
        console.log(this.props.evaluacion.curso)
        console.log(this.state.titulo)
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
                "curso": this.state.curso
				}
		}
		
		axios(options)
			.then( (res) => {
				console.log(res);
				console.log("update evauacion");
				this.setState({"evaluacion_update": true});
                this.state.sacar_pop_up()
                this.state.titulo=""
                this.state.fecha=""
                this.state.tipo="Control"
			})
			.catch( (err) => {
				console.log(err);
				console.log("cant update evaluacion");
				alert("No se pudo actualizar evaluacion!");
                this.state.sacar_pop_up()
                this.state.titulo=""
                this.state.fecha=""
                this.state.tipo="Control"
			});
	}

	render() {
        const { show_form, handleCancel, handleEdit} = this.props;
        console.log(this.props.evaluacion)
        this.state.sacar_pop_up=handleEdit;
        var evaluacion=this.props.evaluacion
		return (
			<Modal size="xl" centered show={show_form} onHide={() => handleCancel()}>
        <Modal.Header className="header-edit" closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Modificar evaluacion
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
                                    <div className="col-sm-10" >
                                        <select className='form-control' name='curso' value={this.state.curso} readOnly='readonly' placeholder={evaluacion.nombre_curso}>
                                                <option > {evaluacion.codigo}-{evaluacion.seccion} {" "+evaluacion.nombre_curso}</option>
                                        </select>
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
                                        <input required type="text" className="form-control" name="titulo"  Value={this.state.titulo} style={{textAlignLast:'center'}} onChange={this.onChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-5">
                                <div className="row" >
                                    <div className="col-sm-2" >
                                        <label >Fecha</label>
                                    </div>
                                    <div className="col-sm-10" >
                                        <input required type="date" className="form-control" name="fecha"  value={this.state.fecha} style={{textAlignLast:'center'}} onChange={this.onChange}/>
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
                        <Button variant="success" type="submit">  Guardar </Button> 
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

export default connect(mapStateToProps)(editar_evaluacion);