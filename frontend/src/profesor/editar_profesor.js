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
    
    update_profesor() {  
        console.log("post ramo ...")
        const url = process.env.REACT_APP_API_URL + `/profesores/${this.state.id}/`
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
		return (
			<Modal size="lg" centered show={show_form} onHide={() => handleCancel()}>
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
                        <input type="text" className="form-control" name="nombre" defaultValue={this.state.nombre} onChange={this.onChange} style={{textAlignLast:'center'}} />
										</Col>
									</Row>
							</Col>  

							<Col lg={5}>
								<Row >
									<Col  xs="auto">
											<label >Apellido</label>
									</Col>
									<Col lg={8} xs={12}>
                      <input type="text" className="form-control" name="apellido" defaultValue={this.state.apellido} onChange={this.onChange} style={{textAlignLast:'center'}}  />
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
