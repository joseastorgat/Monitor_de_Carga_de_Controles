import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Modal,Col,Row} from "react-bootstrap";

export class nuevosemestre extends React.Component {
    state={
        año_semestre: "",
        periodo_semestre: "1",
        inicio_semestre: "",
        fin_semestre:"",
        estado_semestre:"1",
        forma_creacion_semestre:0,

        form_errors: {},
        errors_checked: {},
        semestre_created: false,
        sacar_pop_up: this.props.handleAdd,

        required: "required",
        subir_archivo: false,
        clonar_semestre: false,
        archivo: null,
        archivo_cargado: false
    }
    static propTypes={
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

    onSelect = e => {
        const {clonar_semestre, subir_archivo} = this.state;
        console.log(clonar_semestre, subir_archivo);
        if(e === "clonar"){
            this.setState({
                clonar_semestre: !clonar_semestre,
                subir_archivo: false,
                required: clonar_semestre? "required" : ""
            })
        }
        else{
            this.setState({
                subir_archivo: !subir_archivo,
                clonar_semestre: false,
                required: subir_archivo? "required" : "",
                form_errors: {},
                errors_checked: {},
            })
        }
    };

    onFile = e => {
        this.setState({
          archivo: e.target.files[0],
          subir_archivo: true, 
          archivo_cargado: true,
          clonar_semestre: false,
          required: "",
        })
    };

    handleSubmit = e => {
        e.preventDefault();
        this.create_semestre();
    }

    validateForm(){
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
    
    create_semestre() {  
        console.log("post semestre ...")
        let url = "";
        let data = {};
        let options = {};
       
        if(!this.state.subir_archivo){
            if(!this.validateForm()){
                return;
            }
            url = "http://127.0.0.1:8000/api/semestres/"

            data = {
                "año": parseInt(this.state.año_semestre),
                "estado": parseInt(this.state.estado_semestre),
                "periodo": parseInt(this.state.periodo_semestre),
                "inicio":this.state.inicio_semestre,
                "fin": this.state.fin_semestre
            }
            options = {
                method: 'POST',
                url: url,
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Token ${this.props.auth.token}`
              },
                data: data
              }
              
              axios(options)
              .then( (res) => {
                console.log("create semestre");
                this.setState({"semestre_created": true});
                this.state.sacar_pop_up()
              })
              .catch( (err) => {
                console.log(err);
                console.log("cant create semestre");
                alert("No se pudo crear semestre!");
                this.state.sacar_pop_up()
              });

        }
        else{
            if(!this.state.archivo_cargado){
                // alert("Debes cargar un archivo primero");
                let errors ={}
                errors["archivo_excel"] = "Debes cargar un archivo primero"
                this.setState({
                    form_errors: errors,
                    errors_checked: {}
                })
                return;
            }
            url = "http://127.0.0.1:8000/api/semestres/from_xlsx/"
            const formData = new FormData();
            formData.append("file", this.state.archivo);
            return axios.post(url, formData, {
                headers: {Authorization: `Token ${this.props.auth.token}`}
            })
            .then( e => {
                this.setState({"semestre_created": true})
                this.state.sacar_pop_up()
            })
            .catch( e=> {
                console.log(e)
                this.state.sacar_pop_up()
            })
        }
      }
    render() {
        const { show_form, handleCancel} = this.props;
        let resetState = () =>{
            this.setState({
                año_semestre: "",
                periodo_semestre: "1",
                inicio_semestre: "",
                fin_semestre:"",
                estado_semestre:"1",
                forma_creacion_semestre:0,
        
                form_errors: {},
                errors_checked: {},
                semestre_created: false,
                sacar_pop_up: this.props.handleAdd,
        
                required: "required",
                subir_archivo: false,
                clonar_semestre: false,
                archivo: null,
                archivo_cargado: false,
            })
        }

        return (
            <Modal size="lg" centered show={show_form} onHide={() => {handleCancel(); resetState()}}>
            <Modal.Header className="header-add" closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Agregar nuevo semestre
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <form className="has-warning" name="form" onSubmit={this.handleSubmit}>
                        <div>
                            <Row>
                                <Col xs="1"></Col>
                                <Col lg={5} >
                                    <Row>
                                        <Col xs={2}>
                                            <label >Año</label>
                                        </Col>
                                        <Col lg={9} xs={12}>
                                            <input type="number" min="2019" max="2030" step="1" className={this.state.form_errors["año_semestre"] ? "form-control is-invalid" : this.state.errors_checked["año_semestre"] ? "form-control is-valid" : "form-control"} placeholder="2020" name="año_semestre" onChange={this.onChange}  />
                                            <span style={{color: "red", fontSize:"13px"}}>{this.state.form_errors["año_semestre"]}</span>
                                        </Col>
                                    </Row>
                                </Col>  

                                <Col lg={5} >
                                    <Row>
                                        <Col xs={2}>
                                            <label>Tipo</label>
                                        </Col>
                                        <Col lg={9} xs={12}>
                                            <div  className="custom-control custom-radio custom-control-inline">
                                                <input type="radio" id="otoño" name="periodo_semestre" value="1" onChange={this.onChange} className={this.state.form_errors["periodo_semestre"] ? "custom-control-input is-invalid" : this.state.errors_checked["periodo_semestre"] ? "custom-control-input is-valid" : "custom-control-input"} checked={this.state.periodo_semestre==1} />
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
                                        <input type="date" className={this.state.form_errors["inicio_semestre"] ? "form-control is-invalid" : this.state.errors_checked["inicio_semestre"] ? "form-control is-valid" : "form-control"} name="inicio_semestre" onChange={this.onChange} />
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
                                            <input type="date" className={this.state.form_errors["fin_semestre"] ? "form-control is-invalid" : this.state.errors_checked["fin_semestre"] ? "form-control is-valid" : "form-control"} name="fin_semestre" onChange={this.onChange} />
                                            <span style={{color: "red", fontSize:"14px"}}>{this.state.form_errors["fin_semestre"]}</span>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                       </div> 
                       <Row></Row><Row></Row>
                        <Row>
                        <Col xs="1"></Col>
                        <div className="cuadrado-form">
                            <Col>
                            <div style={{textAlignLast:'center', textAlign:'center'}} className="custom-control custom-radio custom-control-inline" >
                                <input type="radio" id="replicar_semestre" name="clonar_semestre" className="custom-control-input" checked={this.state.clonar_semestre} onClick={e => this.onSelect("clonar")}/>
                                    <label className="custom-control-label" htmlFor="replicar_semestre" >Clonar Semestre</label>
                                <div className="col-sm-10" >
                                    <input type="text" className="form-control" name="semestre_replicado" placeholder="Primavera 2020" />
                                </div>
                                </div>                                         
                           
                            </Col>
                            <Col>
                                <div style={{textAlign:'center'}} className="custom-control custom-radio custom-control-inline" >
                                    <input type="radio" id="archivo_excel" name="subir_archivo" className="custom-control-input" checked={this.state.subir_archivo} onClick={e => this.onSelect("subir")} />
                                    <label className="custom-control-label" htmlFor="archivo_excel" >Subir desde archivo</label>
                                    <div className="col-sm-10" >
                                        <input type="file" className="form-control" name="archivo_excel" onChange={this.onFile } />
                                        <span style={{color: "red", fontSize:"14px"}}>{this.state.form_errors["archivo_excel"]}</span>
                                    </div>
                                </div>
                            </Col>
                            </div>
                        </Row>

                        <div className="form-group" style={{'marginTop':"4rem"}}>
                            <button className="btn btn-success" type="submit">Guardar Semestre</button>
                        </div>
                    </form>
                    </Modal.Body>
                </Modal>
        );
      } 
}
const mapStateToProps = (state) => ({
    auth: state.auth
});
   
export default connect(mapStateToProps)(nuevosemestre);