import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';

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
				window.location.href="/profesores"
			})
			.catch( (err) => {
				console.log(err);
				console.log("cant create profesor");
				alert("No se pudo crear profesor!");
			});
	}

	render() {
			const id= this.props.match.params.id
			return (
					<div>
							<h4 className="titulo">Agregar Profesor</h4>
									<form className="" name="form" onSubmit={this.handleSubmit}>
											<div class="generic-form">
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
											<div class="form-group" style={{'marginTop':"4rem"}}>
											<LinkContainer  activeClassName=""  to="/profesores" className="float-left btn btn-secondary" style={{'marginLeft':"10vw"}}>
													<button >Volver a Profesores</button>
											</LinkContainer>

												<button className="btn btn-success" type="submit">Guardar Profesor</button>

											</div>
									</form>
					</div>
			);
		} 
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(nuevo_profesor);