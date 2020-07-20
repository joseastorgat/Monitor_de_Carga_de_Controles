import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button,Row,Col,Modal} from "react-bootstrap";
import Alert_2 from '@material-ui/lab/Alert';

export class editar_semestre extends React.Component {
    state={
        id:"",
        año: "",
        periodo: "",
        inicio: "",
        fin:"",
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
            año: this.props.semestre.año,
            periodo: this.props.semestre.periodo,
            inicio: this.props.semestre.inicio,
            fin:this.props.semestre.fin,
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
        const url = process.env.REACT_APP_API_URL + `/semestres/${this.state.id}/`
        let options = {
            method: 'PATCH',
            url: url,
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${this.props.auth.token}`
        },
        data: {
            "año": parseInt(this.state.año),
            "estado": parseInt(this.state.estado_semestre),
            "periodo": parseInt(this.state.periodo),
            "inicio_fecha":this.state.inicio,
            "fin_fecha": this.state.fin
           }
        }
        
        axios(options)
          .then( (res) => {
            console.log("update semestre");
            this.setState({"semestre_modified": true});
            this.state.sacar_pop_up()

          })
          .catch( (err) => {
            console.log(err);
            console.log("cant update semestre");
            let errors = this.state.form_errors
            for (let [key, value] of Object.entries(err.response.data)){
            errors[key] = value[0]
            }
            this.setState({
            form_errors:errors
            })
        });
      }

      validateForm(){
        console.log("validando...")
        let errores = {}
        let isValid = true
        let año = this.state.año
        let periodo =  this.state.periodo
        let inicio = this.state.inicio
        let fin = this.state.fin
        let errors_checked = {
            año: true,
            periodo: true,
            inicio: true,
            fin: true
        }

        if(año === ""){
            errores["año"] = "Debe ingresar un año para el semestre"
            isValid = false
        }
        else if(isNaN(parseInt(año))){
            errores["año"] = "Debe ingresar un año válido"
            isValid = false
        }
        if(periodo != 1 && periodo != 2){
            errores["periodo"] = "Debe elegir uno de los dos periodos"
            isValid = false
        }
        if(inicio === ""){
            errores["inicio"] = "Debe ingresar una fecha de inicio_fecha"
            isValid = false
        }
        if(fin === ""){
            errores["fin"] = "Debe ingresar una fecha de fin_fecha"
            isValid = false
        }

        if(inicio !== "" && fin !== ""){
            let inicio_fecha = new Date(inicio)
            let fin_fecha = new Date(fin)
            if(fin_fecha - inicio_fecha <= 0){
                errores["fin"] = "Debe ingresar una fecha fin_fecha posterior a la fecha de inicio_fecha"
                isValid = false
            }
        }
        let dateformat = (/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/)|(/^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/);
        if(!inicio.match(dateformat) && inicio !== ""){
            errores["inicio"] = "El formato de la fecha es incorrecto"
            isValid = false
        }
        else if(inicio !== ""){
            let inicio_fecha = new Date(inicio)
            if(inicio_fecha.getFullYear() != año){
                errores["inicio"] = "El año de la fecha de inicio_fecha no coincide con el año del semestre"
                isValid = false
            }
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

    

    render() {
        const { show_form, handleCancel} = this.props;
        const campos = ["año", "periodo", "inicio", "fin"]
        return (
            <Modal size="lg" centered show={show_form} onHide={() => handleCancel()}>
                <Modal.Header className="header-edit" closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Editar Semestre
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                { 
				Object.keys(this.state.form_errors).map(k => {
				if(!(campos.includes(k))){
					return (
                        <Alert_2  severity="error">{this.state.form_errors[k]}</Alert_2>
					)
				}
				})
				}
                <form className="" name="form" onSubmit={this.handleSubmit}>
                        <div>
                            <Row>
                                <Col xs="1"></Col>
                                <Col lg={5} >
                                    <Row>
                                        <Col xs={2}>
                                            <label >Año<span style={{color:"red"}}>*</span></label>
                                        </Col>
                                        <Col lg={8} xs={11}>
                                            <input type="number"  min="2019" max="2030" step="1" className={this.state.form_errors["año"] ? "form-control is-invalid" : this.state.errors_checked["año"] ? "form-control is-valid" : "form-control"} placeholder="Ej.: 2020" value={this.state.año} name="año" onChange={this.onChange}  />
                                            <span style={{color: "red", fontSize:"14px"}}>{this.state.form_errors["año"]}</span>
                                        </Col>
                                    </Row>
                                </Col>  

                                <Col lg={6} >
                                    <Row>
                                        <Col xs={2}>
                                            <label>Tipo<span style={{color:"red"}}>*</span></label>
                                        </Col>
                                        <Col lg={8} xs={11}>
                                            <div  className="custom-control custom-radio custom-control-inline"  >
                                                <input  type="radio" id="otoño" name="periodo" value="1" onChange={this.onChange} className={this.state.form_errors["periodo"] ? "custom-control-input is-invalid" : this.state.errors_checked["periodo"] ? "custom-control-input is-valid" : "custom-control-input"} checked={parseInt(this.state.periodo)===1} />
                                                <label className="custom-control-label" htmlFor="otoño" >Otoño</label>
                                            </div>

                                            <div style={{textAlign:'center'}} className="custom-control custom-radio custom-control-inline" >
                                                <input type="radio" id="primavera" name="periodo" value="2" onChange={this.onChange} className={this.state.form_errors["periodo"] ? "custom-control-input is-invalid" : this.state.errors_checked["periodo"] ? "custom-control-input is-valid" : "custom-control-input"} checked={parseInt(this.state.periodo)===2}/>
                                                
                                                <label className="custom-control-label" htmlFor="primavera">Primavera</label>
                                            </div>
                                            <span style={{color: "red", fontSize:"14px"}}>{this.state.form_errors["periodo"]}</span>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs="1"></Col>
                                <Col lg={5} >
                                    <Row>
                                        <Col xs={2}>
                                        <label >Inicio<span style={{color:"red"}}>*</span></label>
                                        </Col>
                                        <Col lg={8} xs={11}>
                                        <input  type="date" className={this.state.form_errors["inicio"] ? "form-control is-invalid" : this.state.errors_checked["inicio"] ? "form-control is-valid" : "form-control"} name="inicio" onChange={this.onChange} value={this.state.inicio} />
                                        <span style={{color: "red", fontSize:"14px"}}>{this.state.form_errors["inicio"]}</span>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg={5} >
                                    <Row>
                                        <Col xs={2}>
                                            <label >Fin<span style={{color:"red"}}>*</span></label>
                                        </Col>
                                        <Col lg={8} xs={11}>
                                            <input  type="date" className={this.state.form_errors["fin"] ? "form-control is-invalid" : this.state.errors_checked["fin"] ? "form-control is-valid" : "form-control"} name="fin" onChange={this.onChange} value={this.state.fin} />
                                            <span style={{color: "red", fontSize:"14px"}}>{this.state.form_errors["fin"]}</span>
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