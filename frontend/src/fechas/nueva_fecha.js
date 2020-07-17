import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Modal,Row,Col} from "react-bootstrap";

export class nuevafecha extends React.Component {
    static propTypes={
        auth: PropTypes.object.isRequired,
    };

    state={
        nombre_fecha: "",
        tipo_fecha: "1",
        inicio_fecha: "",
        fin_fecha:"",
        form_errors: {},
        errors_checked: {},
        fecha_created: false,
        sacar_pop_up: this.props.handleAdd
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
        this.create_fecha();
    }

    validateForm(){
        let errores = {}
        let isValid = true
        let nombre_fecha = this.state.nombre_fecha
        let tipo_fecha =  this.state.tipo_fecha
        let inicio_fecha = this.state.inicio_fecha
        let fin_fecha = this.state.fin_fecha
        let errors_checked = {
            nombre_fecha: true,
            tipo_fecha: true,
            inicio_fecha: true,
            fin_fecha: true
        }

        if(nombre_fecha === ""){
            errores["nombre_fecha"] = "Debe ingresar un nombre"
            isValid = false
        }
        if(tipo_fecha === ""){
            errores["tipo_fecha"] = "Debe elegir un tipo de fecha"
            isValid = false
        }
        if(inicio_fecha === ""){
            errores["inicio_fecha"] = "Debe ingresar una fecha de inicio"
            isValid = false
        }

        if(inicio_fecha !== "" && fin_fecha !== ""){
            let inicio = new Date(inicio_fecha)
            let fin = new Date(fin_fecha)
            if(fin - inicio <= 0){
                errores["fin_fecha"] = "Debe ingresar una fecha fin posterior a la fecha de inicio"
                isValid = false
            }
        }
        let dateformat = (/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/)|(/^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/);
        if(!inicio_fecha.match(dateformat) && inicio_fecha !== ""){
            errores["inicio_fecha"] = "El formato de la fecha es incorrecto"
            isValid = false
        }
        if(!fin_fecha.match(dateformat) && fin_fecha !== ""){
            errores["fin_fecha"] = "El formato de la fecha es incorrecto"
            isValid = false
        }
        this.setState({
            form_errors: errores,
            errors_checked: errors_checked
        })
        return isValid

    }

    create_fecha() {  
        console.log("post fecha ...")
        if(!this.validateForm()){
			return;
		}
        const url = process.env.REACT_APP_API_URL + "/fechas-especiales/"
        const fecha_fin = this.state.fin_fecha === "" ? this.state.inicio_fecha : this.state.fin_fecha;

        let options = {
          method: 'POST',
          url: url,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${this.props.auth.token}`
        },
          data: {
            "nombre": this.state.nombre_fecha,
            "tipo":this.state.tipo_fecha,
            "inicio": this.state.inicio_fecha,
            "fin": fecha_fin,
           }
        }
        
        axios(options)
          .then( (res) => {
            console.log(res);
            console.log("create fecha");
            this.setState(
                {
                    "fecha_created": true, 
                    "nombre_fecha": "",
                    "form_errors": {},
                    "errors_checked": {},
                }
            );
            this.state.sacar_pop_up()
          })
          .catch( (err) => {
            console.log(err);
            console.log("cant create fecha");
            alert("No se pudo crear fecha!");
            this.state.sacar_pop_up()
          });
      }

    render() {
        const { show_form, handleCancel} = this.props;
        let resetState = () => {
			this.setState({
				nombre_fecha: "",
                tipo_fecha: "1",
                inicio_fecha: "",
                fin_fecha:"",
                form_errors: {},
                errors_checked: {},
                fecha_created: false,
			  })
		}
        return (
            <Modal size="lg" centered show={show_form} onHide={() => {handleCancel(); resetState()}}>
        <Modal.Header className="header-add" closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Agregar nueva fecha
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div>
                <form id="form_fecha" onSubmit={this.handleSubmit} >
                        <div>
                            <Row>
                                <Col xs="1"></Col>
                                <Col lg={5}>
                                    <Row>
                                        <Col xs={3}>
                                            <label >Nombre</label>
                                        </Col>
                                        <Col lg={8} xs={12}>
                                            <input type="text" className={this.state.form_errors["nombre_fecha"] ? "form-control is-invalid" : this.state.errors_checked["nombre_fecha"] ? "form-control is-valid" : "form-control"} name="nombre_fecha" onChange={this.onChange} placeholder="Nombre Feriado" style={{textAlignLast:'center'}} />
                                            <span style={{color: "red", fontSize:"13px"}}>{this.state.form_errors["nombre_fecha"]}</span>
                                        </Col>
                                    </Row>
                                </Col>  

                                <Col lg={5}>
                                    <Row>
                                        <Col xs={2}>
                                            <label >Tipo</label>
                                        </Col>
                    
                                        <Col lg={8} xs={12}>
                                        {/* No pude centrarlo, hay un problema con prioridades de css de react */}
                                            <select className={this.state.form_errors["tipo_fecha"] ? "form-control is-invalid" : this.state.errors_checked["tipo_fecha"] ? "form-control is-valid" : "form-control"}  onChange={this.onChange} name="tipo_fecha" style={{textAlignLast:'center',textAlign:'center'}}  >
                                                <option value="1" selected>Feriado</option>
                                                <option value="2">Vacaciones de Invierno</option>
                                                <option value="3">Semana Olimpica</option>
                                                <option value="4">Semana de Vacaciones</option>
                                                <option value="5">Otros</option>
                                            </select>
                                            <span style={{color: "red", fontSize:"13px"}}>{this.state.form_errors["tipo_fecha"]}</span>
                                        </Col>
                                    </Row>
                                </Col>
                                    
                            </Row>

                            <Row>
                                <Col xs="1"></Col>
                                <Col lg={5} >
                                    <Row>
                                        <Col xs={3}>
                                        <label >Inicio</label>
                                        </Col>
                                        <Col lg={8} xs={12}>
                                            <input type="date" onChange={this.onChange} className={this.state.form_errors["inicio_fecha"] ? "form-control is-invalid" : this.state.errors_checked["inicio_fecha"] ? "form-control is-valid" : "form-control"} name="inicio_fecha" />
                                            <span style={{color: "red", fontSize:"13px"}}>{this.state.form_errors["inicio_fecha"]}</span>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg={5}>
                                    <Row>
                                        <Col xs={2}>
                                            <label >Fin</label>
                                        </Col>
                                        <Col lg={8} xs={12}>
                                            <input type="date" onChange={this.onChange} className={this.state.form_errors["fin_fecha"] ? "form-control is-invalid" : this.state.errors_checked["fin_fecha"] ? "form-control" : "form-control"} name="fin_fecha"  />
                                            <span style={{color: "red", fontSize:"13px"}}>{this.state.form_errors["fin_fecha"]}</span>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                        <Row></Row><Row></Row><Row></Row>
                        <Row>
                        <div className="col-md-6" > </div>
                        <Button variant="success" type="submit">    Agregar        </Button>
                        </Row>
                        <Row></Row><Row></Row>
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

export default connect(mapStateToProps)(nuevafecha);