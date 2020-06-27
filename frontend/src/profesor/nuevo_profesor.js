import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {ArrowLeft} from "@primer/octicons-react";
import ViewTitle from "../common/ViewTitle";
import { Link } from "react-router-dom";
import OptionButton from "../common/OptionButton";
import { Container} from "react-bootstrap";

export class nuevo_profesor extends React.Component {
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
		// const id= this.props.match.params.id
		return (
			<Modal size="xl" centered show={show_form} onHide={() => handleCancel()}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Agregar nuevo profesor
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
					<div>
						<form  onSubmit={this.handleSubmit}>
											<div >
													<div class="row">
															<div class="col-sm-1"></div>
															<div class="col-sm-5" >
																	<div class="row">
																			<div class="col-sm-2" >
																					<label >Nombre</label>
																			</div>
																			<div class="col-sm-10" >
																					<input required type="text" className="form-control" name="nombre" onChange={this.onChange} style={{textAlignLast:'center'}} />
																			</div>
																	</div>
															</div>  

															<div class="col-sm-5">
																	<div class="row" style={{justifyContent: 'center'}} >
																			<div class="col-sm-2" >
																					<label >Apellido</label>
																			</div>
																			<div class="col-sm-10" >
																			<input required type="text" className="form-control" name="apellido" onChange={this.onChange} style={{textAlignLast:'center'}}  />
																			</div>
																	
																	</div>
															</div>
													</div>                    
											</div>
											<div class="row"> </div>
                        <div class="row">
                        <div class="col-md-6" > </div>
											<Button variant="success" center  type="submit">          Agregar </Button> </div>
									</form>
					</div>
		</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleCancel()}>
            Cancelar
          </Button>

        </Modal.Footer>
      </Modal>
			);
		} 
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(nuevo_profesor);