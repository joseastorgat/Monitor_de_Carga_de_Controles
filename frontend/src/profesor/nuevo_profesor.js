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
				profesor_created: false
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
			if(this.state.nombre && this.state.apellido){
				this.create_profesor();
			}
			else{
				alert("Debe ingresar nombre y apellido")
			}
			
	}


create_profesor() {  
		console.log("post ramo ...")
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
		const { show_form, handleCancel, handleAdd} = this.props;
		this.state.sacar_pop_up=handleAdd;
		return (
			<Modal size="lg" centered show={show_form} onHide={() => handleCancel()}>
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
												<input required type="text" className="form-control" name="nombre" onChange={this.onChange} style={{textAlignLast:'center'}} />
										</Col>
									</Row>
							</Col>  

							<Col lg={5}>
								<Row >
									<Col xs="auto">
											<label >Apellido</label>
									</Col>
									<Col lg={8} xs={12}>
										<input required type="text" className="form-control" name="apellido" onChange={this.onChange} style={{textAlignLast:'center'}}  />
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