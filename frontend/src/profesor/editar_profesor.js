import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Button,Row,Col,Modal} from "react-bootstrap";

export class editarprofesor extends React.Component {
    state = {
        id: "",
        nombre:"",
        apellido: "",
        profesor_modified: false,

        form_errors: {},
				errors_checked: {},
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
        this.update_profesor();
    };

    async componentDidMount () {  
      this.setState({
        id: this.props.profesor.id,
        nombre: this.props.profesor.nombre, 
        apellido: "",
        profesor_modified: false,
        sacar_pop_up:this.props.handleEdit})
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

    update_profesor() {  
        console.log("post ramo ...")
        if(!this.validateForm()){
          return;
        }
        const url = `http://127.0.0.1:8000/api/profesores/${this.state.id}/`
        let options = {
            method: 'PATCH',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.props.auth.token}`
            },
            data: {
                "nombre": this.state.nombre + " " + this.state.apellido
            }
        }
        
        axios(options)
            .then( (res) => {
                console.log("profesor updated");
                this.setState({"profesor_modified": true});
                this.state.sacar_pop_up()
            })
            .catch( (err) => {
                console.log(err);
                console.log("cant update profesor");
                alert("No se pudo actualizar el profesor!");
            });
    }
    render() {
    const { show_form, handleCancel} = this.props;
    let resetState = () => {
			this.setState({
				nombre: "",
				apellido: "",
				profesor_modified: false,
				form_errors: {},
				errors_checked: {},
			  })
		}
		return (
			<Modal size="lg" centered show={show_form} onHide={() => {handleCancel(); resetState()}}>
        <Modal.Header className="header-edit" closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Editar profesor
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
                      <input type="text" className={this.state.form_errors["nombre"] ? "form-control is-invalid" : this.state.errors_checked["nombre"] ? "form-control is-valid" : "form-control"} name="nombre" defaultValue={this.state.nombre} onChange={this.onChange} style={{textAlignLast:'center'}} />
                      <span style={{color: "red", fontSize:"14px"}}>{this.state.form_errors["nombre"]}</span>
                    </Col>
									</Row>
							</Col>  

							<Col lg={5}>
								<Row >
									<Col  xs="auto">
											<label >Apellido</label>
									</Col>
									<Col lg={8} xs={12}>
                    <input type="text" className={this.state.form_errors["apellido"] ? "form-control is-invalid" : this.state.errors_checked["apellido"] ? "form-control is-valid" : "form-control"} name="apellido" defaultValue={this.state.apellido} onChange={this.onChange} style={{textAlignLast:'center'}}  />
                    <span style={{color: "red", fontSize:"14px"}}>{this.state.form_errors["apellido"]}</span>
                  </Col>
								
								</Row>
							</Col>
						</Row>                    
					</div>
					<Row></Row><Row></Row><Row></Row>
					<Row className="centrar_button">
						<Button variant="success" type="submit"> Actualizar </Button>
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

export default connect(mapStateToProps)(editarprofesor);
