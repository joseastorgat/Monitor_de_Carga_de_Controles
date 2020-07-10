import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button,Row,Col,Modal} from "react-bootstrap";

export class editar_semestre extends React.Component {
    state={
        id:"",
        año_semestre: "",
        periodo_semestre: "",
        inicio_semestre: "",
        fin_semestre:"",
        estado_semestre:"",
        forma_creacion_semestre:0,

        form_errors: {},
        errors_checked: {},

        semestre_modified: false,
        semestre:[]
    }
    static propTypes={
        auth: PropTypes.object.isRequired,
    };

    async componentDidMount () {  
        this.setState({
            id:this.props.semestre.id,
            año_semestre: this.props.semestre.año,
            periodo_semestre: this.props.semestre.periodo,
            inicio_semestre: this.props.semestre.inicio,
            fin_semestre:this.props.semestre.fin,
            estado_semestre:this.props.semestre.estado,
            sacar_pop_up:this.props.handleEdit
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
        this.update_semestre()
    }

    update_semestre() {  
        if(!this.validateForm()){
            return;
        }
        console.log("post semestre ...")
        const url = `http://127.0.0.1:8000/api/semestres/${this.state.id}/`
        let options = {
            method: 'PATCH',
            url: url,
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${this.props.auth.token}`
        },
        data: {
            "año": parseInt(this.state.año_semestre),
            "estado": parseInt(this.state.estado_semestre),
            "periodo": parseInt(this.state.periodo_semestre),
            "inicio":this.state.inicio_semestre,
            "fin": this.state.fin_semestre
           }
        }
        
        axios(options)
          .then( (res) => {
            console.log("update semestre");
            this.setState({"semestre_modified": true});
            this.state.sacar_pop_up()

          })
          .catch( (err) => {
            alert("ERROR")
            console.log(err);
            console.log("cant update semestre");
            alert("No se pudo actualizar semestre!");
            this.state.sacar_pop_up()
          });
      }

      validateForm(){
        console.log("validando...")
        let errores = {}
        let isValid = true
        let año_semestre = this.state.año_semestre
        let periodo_semestre =  this.state.periodo_semestre
        let inicio_semestre = this.state.inicio_semestre
        let fin_semestre = this.state.fin_semestre
        let errors_checked = {
            año_semestre: true,
            periodo_semestre: true,
            inicio_semestre: true,
            fin_semestre: true
        }

        if(año_semestre === ""){
            errores["año_semestre"] = "Debe ingresar un año para el semestre"
            isValid = false
        }
        else if(isNaN(parseInt(año_semestre))){
            errores["año_semestre"] = "Debe ingresar un año válido"
            isValid = false
        }
        if(periodo_semestre != 1 && periodo_semestre != 2){
            errores["periodo_semestre"] = "Debe elegir uno de los dos periodos"
            isValid = false
        }
        if(inicio_semestre === ""){
            errores["inicio_semestre"] = "Debe ingresar una fecha de inicio"
            isValid = false
        }
        if(fin_semestre === ""){
            errores["fin_semestre"] = "Debe ingresar una fecha de fin"
            isValid = false
        }

        if(inicio_semestre !== "" && fin_semestre !== ""){
            let inicio = new Date(inicio_semestre)
            let fin = new Date(fin_semestre)
            if(fin - inicio <= 0){
                errores["fin_semestre"] = "Debe ingresar una fecha fin posterior a la fecha de inicio"
                isValid = false
            }
        }
        let dateformat = (/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/)|(/^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/);
        console.log(inicio_semestre)
        if(!inicio_semestre.match(dateformat) && inicio_semestre !== ""){
            errores["inicio_semestre"] = "El formato de la fecha es incorrecto"
            isValid = false
        }
        else if(inicio_semestre !== ""){
            let inicio = new Date(inicio_semestre)
            if(inicio.getFullYear() != año_semestre){
                errores["inicio_semestre"] = "El año de la fecha de inicio no coincide con el año del semestre"
                isValid = false
            }
        }
        if(!fin_semestre.match(dateformat) && fin_semestre !== ""){
            errores["fin_semestre"] = "El formato de la fecha es incorrecto"
            isValid = false
        }
        this.setState({
            form_errors: errores,
            errors_checked: errors_checked
        })
        return isValid
    }

    

    render() {
        const { show_form, handleCancel} = this.props;
        return (
            <Modal size="lg" centered show={show_form} onHide={() => handleCancel()}>
                <Modal.Header className="header-edit" closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Editar Semestre
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form className="" name="form" onSubmit={this.handleSubmit}>
                        <div>
                            <Row>
                                <Col xs="1"></Col>
                                <Col lg={5} >
                                    <Row>
                                        <Col xs={2}>
                                            <label >Año</label>
                                        </Col>
                                        <Col lg={9} xs={12}>
                                            <input type="number"  min="2019" max="2030" step="1" className={this.state.form_errors["año_semestre"] ? "form-control is-invalid" : this.state.errors_checked["año_semestre"] ? "form-control is-valid" : "form-control"} placeholder="2020" value={this.state.año_semestre} name="año_semestre" onChange={this.onChange}  />
                                            <span style={{color: "red", fontSize:"14px"}}>{this.state.form_errors["año_semestre"]}</span>
                                        </Col>
                                    </Row>
                                </Col>  

                                <Col lg={5} >
                                    <Row>
                                        <Col xs={2}>
                                            <label >Tipo</label>
                                        </Col>
                                        <Col lg={9} xs={12}>
                                            <div  className="custom-control custom-radio custom-control-inline"  >
                                                <input  type="radio" id="otoño" name="periodo_semestre" value="1" onChange={this.onChange} className={this.state.form_errors["periodo_semestre"] ? "custom-control-input is-invalid" : this.state.errors_checked["periodo_semestre"] ? "custom-control-input is-valid" : "custom-control-input"} checked={this.state.periodo_semestre==1} />
                                                <label className="custom-control-label" htmlFor="otoño" >Otoño</label>
                                            </div>

                                            <div style={{textAlign:'center'}} className="custom-control custom-radio custom-control-inline" >
                                                <input type="radio" id="primavera" name="periodo_semestre" value="2" onChange={this.onChange} className={this.state.form_errors["periodo_semestre"] ? "custom-control-input is-invalid" : this.state.errors_checked["periodo_semestre"] ? "custom-control-input is-valid" : "custom-control-input"} checked={this.state.periodo_semestre==2}/>
                                                
                                                <label className="custom-control-label" htmlFor="primavera">Primavera</label>
                                            </div>
                                            <span style={{color: "red", fontSize:"14px"}}>{this.state.form_errors["periodo_semestre"]}</span>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs="1"></Col>
                                <Col lg={5} >
                                    <Row>
                                        <Col xs={2}>
                                        <label >Inicio</label>
                                        </Col>
                                        <Col lg={9} xs={12}>
                                        <input  type="date" className={this.state.form_errors["inicio_semestre"] ? "form-control is-invalid" : this.state.errors_checked["inicio_semestre"] ? "form-control is-valid" : "form-control"} name="inicio_semestre" onChange={this.onChange} value={this.state.inicio_semestre} />
                                        <span style={{color: "red", fontSize:"14px"}}>{this.state.form_errors["inicio_semestre"]}</span>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg={5} >
                                    <Row>
                                        <Col xs={2}>
                                            <label >Fin</label>
                                        </Col>
                                        <Col lg={9} xs={12}>
                                            <input  type="date" className={this.state.form_errors["fin_semestre"] ? "form-control is-invalid" : this.state.errors_checked["fin_semestre"] ? "form-control is-valid" : "form-control"} name="fin_semestre" onChange={this.onChange} value={this.state.fin_semestre} />
                                            <span style={{color: "red", fontSize:"14px"}}>{this.state.form_errors["fin_semestre"]}</span>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                       </div> 
                       <Row></Row><Row></Row>
 
                       <Row></Row><Row></Row><Row></Row>
                    <Row>
                    <div className="col-md-6" > </div>
                  <Button variant="success" center  type="submit"> Actualizar </Button> </Row>
                    <Row></Row><Row></Row>
                </form>
        </Modal.Body>
        </Modal>
        );
      } 
}
const mapStateToProps = (state) => ({
    auth: state.auth
});
   
export default connect(mapStateToProps)(editar_semestre);