import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {Modal,Button,Row,Col} from "react-bootstrap";

export class nuevoprofesor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
				nombre: "",
				apellido: "",
				profesor_created: false,

				form_errors: {},
				errors_checked: {},

				sacar_pop_up: this.props.handleAdd
		}
	};
	static propTypes = {
			auth: PropTypes.object.isRequired,
	};

	
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
			this.create_profesor();
	}

	validateForm(){
		let errores = {}
		let isValid = true
		let nombre = this.state.nombre
		let apellido =  this.state.apellido
		let errors_checked = {
			nombre: true,
			apellido: true,
		}
	
		if(nombre === ""){
			errores["nombre"] = "Debe ingresar un nombre"
			isValid = false
		}
		if(apellido === ""){
			errores["apellido"] = "Debe ingresar un apellido"
			isValid = false
		}
	
		this.setState({
			form_errors: errores,
			errors_checked: errors_checked
		})
		return isValid
	}

	create_profesor() {  
		console.log("post ramo ...")
		if(!this.validateForm()){
			return;
		}
		const url = "http://127.0.0.1:8000/api/profesores/"
		let options = {
			method: 'POST',
			url: url,
			headers: {
		
				'Content-Type': 'application/json',
				'Authorization': `Token ${this.props.auth.token}`
			},
			data: {
				"nombre": this.state.nombre + " " + this.state.apellido,
				}
		}
		axios(options)
			.then( (res) => {
				console.log(res);
				console.log("create profesor");
				this.setState({"profesor_created": true});
				this.state.sacar_pop_up()
			})
			.catch( (err) => {
				console.log(err);
				console.log("cant create profesor");
				alert("No se pudo crear profesor!");
				this.state.sacar_pop_up()
			});
	}

	render() {
		const { show_form, handleCancel} = this.props;
		let resetState = () => {
			this.setState({
				nombre: "",
				apellido: "",
				profesor_created: false,
				form_errors: {},
				errors_checked: {},
			  })
		}
		return (
			<Modal size="lg" centered show={show_form} onHide={() => {handleCancel(); resetState()}}>
        <Modal.Header className="header-add" closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Agregar nuevo profesor
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
			<div>
				<form  onSubmit={this.handleSubmit}>
					<div >
						<Row>
							<Col xs="1"></Col>
							<Col lg={5}>
									<Row>
										<Col xs="auto">
												<label>Nombre</label>
										</Col>
										<Col lg={8} xs={12}>
											<input  type="text" className={this.state.form_errors["nombre"] ? "form-control is-invalid" : this.state.errors_checked["nombre"] ? "form-control is-valid" : "form-control"} name="nombre" onChange={this.onChange} style={{textAlignLast:'center'}} />
											<span style={{color: "red", fontSize:"14px"}}>{this.state.form_errors["nombre"]}</span>
										</Col>
									</Row>
							</Col>  

							<Col lg={5}>
								<Row >
									<Col xs="auto">
											<label >Apellido</label>
									</Col>
									<Col lg={8} xs={12}>
										<input  type="text" className={this.state.form_errors["apellido"] ? "form-control is-invalid" : this.state.errors_checked["apellido"] ? "form-control is-valid" : "form-control"} name="apellido" onChange={this.onChange} style={{textAlignLast:'center'}}  />
										<span style={{color: "red", fontSize:"14px"}}>{this.state.form_errors["apellido"]}</span>
									</Col>
								
								</Row>
							</Col>
						</Row>                    
					</div>
					<Row></Row><Row></Row><Row></Row>
					<Row className="centrar_button">
						<Button variant="success" type="submit"> Agregar </Button>
					</Row>
					<Row></Row>
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

export default connect(mapStateToProps)(nuevoprofesor);