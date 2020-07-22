import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Modal } from "react-bootstrap";
import { Row} from "react-bootstrap";
import Alert_2 from '@material-ui/lab/Alert';

export class EditarEvaluacion extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
				titulo: this.props.evaluacion.titulo,
                fecha: this.props.evaluacion.fecha,
                tipo:this.props.evaluacion.tipo,
                curso:this.props.evaluacion.curso,
                evaluacion_update: false,
                id:this.props.evaluacion.id,
                nombre_curso:"",
                form_errors: {},
                errors_checked: {},
                semestre_id:this.props.semestre
		}
	};
	static propTypes = {
			auth: PropTypes.object.isRequired,
    };
    componentDidMount(){
        axios.get(process.env.REACT_APP_API_URL + `/semestres/${this.state.semestre_id}/`)
        .then( (res) => { 
            this.setState({
                fecha_inicio_semestre:res.data.inicio,
                fecha_fin_semestre:res.data.fin
            })
        })      
    }

	onChange = e => {
        let errors_checked = this.state.errors_checked
        let form_errors = this.state.form_errors
        errors_checked[e.target.name] = false
        form_errors[e.target.name] = ""
        this.setState({
          [e.target.name]: e.target.value,
          errors_checked: errors_checked,
          form_errors: form_errors
        })
    };

	handleSubmit = e => {
			e.preventDefault();
			console.log("submit");
			this.update_evaluacion();
	}

    validateForm(){
        let errores = {}
        let isValid = true
        let titulo = this.state.titulo
        let fecha = this.state.fecha
        let tipo = this.state.tipo
        let errors_checked = {
            titulo: true,
            fecha: true,
            tipo: true,
        }

        if(titulo === ""){
            errores["titulo"] = "Debe ingresar un titulo para la evaluación"
            isValid = false
        }
        if(tipo != "Control" && tipo != "Tarea"){
            errores["tipo"] = "Debe elegir uno de los dos tipos"
            isValid = false
        }
        if(fecha === ""){
            errores["fecha"] = "Debe ingresar una fecha"
            isValid = false
        }

        let dateformat = (/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/)|(/^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/);
        if(!fecha.match(dateformat) && fecha !== ""){
            errores["fecha"] = "El formato de la fecha es incorrecto"
            isValid = false
        }
        this.setState({
            form_errors: errores,
            errors_checked: errors_checked
        })
        return isValid

    }
    update_evaluacion() {  
        console.log("post evaluacion ...")
        if(!this.validateForm()){
            return;
        }
        const url = process.env.REACT_APP_API_URL + `/evaluaciones/${this.state.id}/`
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
                if (err.response.status===401){// Fecha choca con fecha especial
                    var errores=this.state.form_errors
                    var errors_checked=this.state.errors_checked
                    errores["fecha"]="Fecha ingresada no es válida, ya que choca con fecha especial"
                    errors_checked["fecha"]=false
                    this.setState({
                        form_errors: errores,
                        errors_checked: errors_checked
                    })
                    return false
                }
                else{
                    console.log(err);
                    console.log("cant update evaluacion");
                    let errors = this.state.form_errors
                    for (let [key, value] of Object.entries(err.response.data)){
                        if(err.response.status===400)
                            errors[key] = value
                        else
                            errors[key] = value[0]
                    }
                    this.setState({
                        form_errors:errors
                    })
                }
            });
	}

	render() {
        const { show_form, handleCancel, handleEdit} = this.props;
        console.log(this.props.evaluacion)
        this.state.sacar_pop_up=handleEdit;
        var evaluacion=this.props.evaluacion
        const campos = ["fecha", "titulo", "tipo"]
		return (
			<Modal size="xl" centered show={show_form} onHide={() => handleCancel()}>
        <Modal.Header className="header-edit" closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Editar evaluación
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
					<div>
                    { 
                    Object.keys(this.state.form_errors).map(k => {
                    if(!(campos.includes(k))){
                        return (
                        <Alert_2  severity="error">{this.state.form_errors[k]}</Alert_2>
                        )
                    }
                    })
                    }
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
                                    <label >Título<span style={{color:"red"}}>*</span></label>
                                </div>
                                <div className="col-sm-10" >
                                    <input type="text" className={this.state.form_errors["titulo"] ? "form-control is-invalid" : this.state.errors_checked["titulo"] ? "form-control is-valid" : "form-control"} name="titulo"  value={this.state.titulo} placeholder="Título" style={{textAlignLast:'center'}} onChange={this.onChange} />
                                    <span style={{color: "red", fontSize:"13px"}}>{this.state.form_errors["titulo"]}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-5">
                            <div className="row" >
                                <div className="col-sm-2" >
                                    <label >Fecha<span style={{color:"red"}}>*</span></label>
                                </div>
                                <div className="col-sm-10" >
                                    <input type="date" className={this.state.form_errors["fecha"] ? "form-control is-invalid" : this.state.errors_checked["fecha"] ? "form-control is-valid" : "form-control"} name="fecha" value={this.state.fecha} style={{textAlignLast:'center'}} onChange={this.onChange}  min={this.state.fecha_inicio_semestre} max={this.state.fecha_fin_semestre}/>
                                    <span style={{color: "red", fontSize:"13px"}}>{this.state.form_errors["fecha"]}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1"></div>
                        <div className="col-sm-5" >
                            <div className="row" >
                                <div className="col-sm-2" >
                                    <label >Tipo<span style={{color:"red"}}>*</span></label>
                                </div>
    
                                <div className="custom-control custom-radio custom-control-inline"  >
                                    <input type="radio" id="control" value="Control" name="tipo"  className={this.state.form_errors["tipo"] ? "custom-control-input is-invalid" : this.state.errors_checked["tipo"] ? "custom-control-input is-valid" : "custom-control-input"} onChange={this.onChange} checked={this.state.tipo == "Control"}/>
                                    <label className="custom-control-label" htmlFor="control">Control</label>
                                </div>
                                <div style={{textAlign:'center'}} className="custom-control custom-radio custom-control-inline" >
                                    <input type="radio" id="tarea" value="Tarea" name="tipo"  className={this.state.form_errors["tipo"] ? "custom-control-input is-invalid" : this.state.errors_checked["tipo"] ? "custom-control-input is-valid" : "custom-control-input"} onChange={this.onChange} checked={this.state.tipo == "Tarea"}/>
                                    <label className="custom-control-label" htmlFor="tarea" >Tarea</label>
                                </div>
                                <span style={{color: "red", fontSize:"13px"}}>{this.state.form_errors["tipo"]}</span>
                            </div>
                        </div>  
                    </div>
                    <Row></Row>
                    <div style={{textAlign: 'center'}}>
                        <Button variant="success" type="submit">  Actualizar </Button> 
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

export default connect(mapStateToProps)(EditarEvaluacion);