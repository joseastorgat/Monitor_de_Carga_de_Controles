import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Modal,Row,Col} from "react-bootstrap";
import Alert_2 from '@material-ui/lab/Alert';

export class editarfecha extends React.Component {
    static propTypes={
        auth: PropTypes.object.isRequired,
    };

    state={
        id:"",
        nombre: "",
        tipo: "",
        inicio: "",
        fin:"",

        form_errors: {},
        errors_checked: {},

        fecha_modified: false,
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
        this.update_fecha();
    }

    async componentDidMount () {  
        this.setState({
                id: this.props.fecha.id,
                nombre:this.props.fecha.nombre,
                tipo: this.props.fecha.tipo,
                inicio: this.props.fecha.inicio,
                fin:this.props.fecha.fin,
                sacar_pop_up:this.props.handleEdit
            })
      }
    
      validateForm(){
        let errores = {}
        let isValid = true
        let nombre = this.state.nombre
        let tipo =  this.state.tipo
        let inicio = this.state.inicio
        let fin = this.state.fin
        let errors_checked = {
            nombre: true,
            tipo: true,
            inicio: true,
            fin: true
        }

        if(nombre === ""){
            errores["nombre"] = "Debe ingresar un nombre"
            isValid = false
        }
        if(tipo === ""){
            errores["tipo"] = "Debe elegir un tipo de fecha"
            isValid = false
        }
        if(inicio === ""){
            errores["inicio"] = "Debe ingresar una fecha de inicio"
            isValid = false
        }

        if(inicio !== "" && fin !== ""){
            let inicio_date = new Date(inicio)
            let fin_date = new Date(fin)
            if(fin_date - inicio_date < 0){
                errores["fin"] = "Debe ingresar una fecha fin posterior a la fecha de inicio"
                isValid = false
            }
        }
        let dateformat = (/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/)|(/^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/);
        if(!inicio.match(dateformat) && inicio !== ""){
            errores["inicio"] = "El formato de la fecha es incorrecto"
            isValid = false
        }
        if(!fin.match(dateformat) && fin !== ""){
            errores["fin"] = "El formato de la fecha es incorrecto"
            isValid = false
        }
        this.setState({
            form_errors: errores,
            errors_checked: errors_checked
        })
        return isValid

    }
    update_fecha() {  
        console.log("post fecha ...")
        if(!this.validateForm()){
			return;
		}
        const fecha_fin = this.state.fin === "" ? this.state.inicio : this.state.fin;

        const url = process.env.REACT_APP_API_URL + `/fechas-especiales/${this.state.id}/`
        let options = {
            method: 'PATCH',
            url: url,
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${this.props.auth.token}`
        },
            data: {
                "nombre": this.state.nombre,
                "tipo":this.state.tipo,
                "inicio": this.state.inicio,
                "fin": fecha_fin,
            }
        }
        
        axios(options)
          .then( (res) => {
            console.log("update fecha");
            this.setState({"fecha_modified": true});
            this.state.sacar_pop_up()
          })
          .catch( (err) => {
            console.log(err);
            console.log("cant update fecha");
            let errors = this.state.form_errors
            for (let [key, value] of Object.entries(err.response.data)){
                if(Array.isArray(errors[key]))
                    errors[key] = value[0]
                else if(typeof(errors[key] === "string"))
                    errors[key] = value
            }
            this.setState({
                form_errors:errors
            })
          });
      }

      render() {
        const { show_form, handleCancel} = this.props;
        let resetState = () => {
			this.setState({
				nombre: "",
                tipo: "1",
                inicio: "",
                fin:"",
                form_errors: {},
                errors_checked: {},
                fecha_created: false,
			  })
        }
        const campos = ["nombre", "tipo", "inicio", "fin"]
        return (
            <Modal size="lg" centered show={show_form} onHide={() => {handleCancel(); resetState()}}>
        <Modal.Header className="header-edit" closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Editar fecha
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
                <form id="form_fecha" onSubmit={this.handleSubmit} >
                        <div>
                            <Row>
                                <Col xs="1"></Col>
                                <Col lg={5}>
                                    <Row>
                                        <Col xs={3}>
                                            <label >Nombre<span style={{color:"red"}}>*</span></label>
                                        </Col>
                                        <Col lg={8} xs={11}>
                                            <input type="text" className={this.state.form_errors["nombre"] ? "form-control is-invalid" : this.state.errors_checked["nombre"] ? "form-control is-valid" : "form-control"} name="nombre" onChange={this.onChange} value={this.state.nombre} placeholder="Nombre Feriado" style={{textAlignLast:'center'}} />
                                            <span style={{color: "red", fontSize:"13px"}}>{this.state.form_errors["nombre"]}</span>
                                        </Col>
                                    </Row>
                                </Col>  

                                <Col lg={5}>
                                    <Row>
                                        <Col xs={2}>
                                            <label >Tipo<span style={{color:"red"}}>*</span></label>
                                        </Col>
                    
                                        <Col lg={8} xs={11}>
                                        {/* No pude centrarlo, hay un problema con prioridades de css de react */}
                                            <select className={this.state.form_errors["tipo"] ? "form-control is-invalid" : this.state.errors_checked["tipo"] ? "form-control is-valid" : "form-control"}  onChange={this.onChange} name="tipo" value={this.state.tipo} style={{textAlignLast:'center',textAlign:'center'}}  >
                                                <option value="1">Feriado</option>
                                                <option value="2">Vacaciones de Invierno</option>
                                                <option value="3">Semana Olimpica</option>
                                                <option value="4">Semana de Vacaciones</option>
                                                <option value="5">Otros</option>
                                            </select>
                                            <span style={{color: "red", fontSize:"13px"}}>{this.state.form_errors["tipo"]}</span>
                                        </Col>
                                    </Row>
                                </Col>
                                    
                            </Row>

                            <Row>
                                <Col xs="1"></Col>
                                <Col lg={5} >
                                    <Row>
                                        <Col xs={3}>
                                        <label >Inicio<span style={{color:"red"}}>*</span></label>
                                        </Col>
                                        <Col lg={8} xs={11}>
                                            <input type="date" onChange={this.onChange} className={this.state.form_errors["inicio"] ? "form-control is-invalid" : this.state.errors_checked["inicio"] ? "form-control is-valid" : "form-control"} name="inicio" value={this.state.inicio} />
                                            <span style={{color: "red", fontSize:"13px"}}>{this.state.form_errors["inicio"]}</span>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg={5}>
                                    <Row>
                                        <Col xs={2}>
                                            <label >Fin</label>
                                        </Col>
                                        <Col lg={8} xs={12}>
                                            <input type="date" onChange={this.onChange} className={this.state.form_errors["fin"] ? "form-control is-invalid" : this.state.errors_checked["fin"] ? "form-control" : "form-control"} name="fin" value={this.state.fin} />
                                            <span style={{color: "red", fontSize:"13px"}}>{this.state.form_errors["fin"]}</span>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                        <Row></Row><Row></Row><Row></Row>
                        <Row>
                        <div className="col-md-6" > </div>
                        <Button variant="success" type="submit">    Actualizar      </Button>
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

export default connect(mapStateToProps)(editarfecha);