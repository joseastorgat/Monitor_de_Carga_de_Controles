import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Modal, Col, Row, Container} from "react-bootstrap";
// import ReactAnimatedEllipsis from 'react-animated-ellipsis';
import EllipsisAnimation from "../common/EllipsisAnimation";

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
        required: "required",
        
        archivo: false,
        archivo_archivo: null,
        archivo_cargado: false,
        archivo_procesando: false,
        archivo_listo: false,
        archivo_error: false,
        archivo_error_msg: "",
        
        clonar: false,
        clonar_id: 0,
        clonar_procesando: false,
        clonar_listo: false,
        clonar_error: false,
        clonar_error_msg: ""
    
    }


    static propTypes={
        auth: PropTypes.object.isRequired,
    };

    sacar_pop_up(){
        this.props.handleAdd();
        setTimeout(() => {this.resetState()}, 1000);
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

    onSelect = e => {
        const {clonar: clonar_semestre, archivo: subir_archivo} = this.state;
        console.log(clonar_semestre, subir_archivo);
        if(e === "clonar"){
            this.setState({
                clonar: !clonar_semestre,
                archivo: false,
                required: clonar_semestre? "required" : ""
            })
        }
        else{
            this.setState({
                archivo: !subir_archivo,
                clonar: false,
                required: subir_archivo? "required" : "",
                form_errors: {},
                errors_checked: {},
            })
        }
    };

    onFile = e => {
        this.setState({
          archivo: true, 
          archivo_archivo: e.target.files[0],
          archivo_cargado: true,
          clonar: false,
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
       
       if(!this.state.archivo){
            if(!this.validateForm()){
                return;
            }

             data = {
                "año": parseInt(this.state.año_semestre),
                "estado": parseInt(this.state.estado_semestre),
                "periodo": parseInt(this.state.periodo_semestre),
                "inicio":this.state.inicio_semestre,
                "fin": this.state.fin_semestre
            }
            
              url = process.env.REACT_APP_API_URL + "/semestres/";
              
              options = {
                method: 'POST',
                url: url,
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Token ${this.props.auth.token}`
              },
                data: data
              }
              
              if(this.state.clonar){
                
                const sem = this.props.semestres[this.state.clonar_id];
                console.log(sem.año, sem.periodo);
                options.data = {...data, 
                    "from_año": sem.año,
                    "from_periodo": sem.periodo
                    };

                options.url = process.env.REACT_APP_API_URL + "/semestres/clonar/";
                this.setState({clonar_procesando: true});
                  
                axios(options)
                .then( (res) => {
                    this.setState({clonar_listo: true,  clonar_procesando: false});
                })
                .catch( (err) =>{
                    console.log(err);
                    console.log("No se pudo clonar semestre");
                    this.setState({clonar_error: true, clonar_error_msg: String(err), clonar_procesando: false});
                    
                  } )
                
                return;
              }
              
            axios(options)
              .then( (res) => {
                console.log("create semestre");
                this.setState(
                    {
                        "semestre_created": true,
                        "form_errors": {},
                        "errors_checked": {},
                    }
                );
                this.state.sacar_pop_up()
              })
              .catch( (err) => {
                console.log(err);
                console.log("No se pudo crear semestre");
                alert("No se pudo crear semestre!");
                this.sacar_pop_up()
              });

        }
        else{
            if(!this.state.archivo_cargado){
                let errors ={}
                errors["archivo_excel"] = "Debes cargar un archivo primero"
                this.setState({
                    form_errors: errors,
                    errors_checked: {}
                })
                return;
            }

            this.setState({"archivo_procesando": true})
            url = process.env.REACT_APP_API_URL + "/semestres/from_xlsx/";
            const formData = new FormData();
            formData.append("file", this.state.archivo_archivo);
            
            axios.post(url, formData, {
                headers: {Authorization: `Token ${this.props.auth.token}`}
            })
            .then( e => {
                this.setState({archivo_procesando:false, archivo_listo: true});
                // this.sacar_pop_up()
            })
            .catch( e=> {
                console.log(e)
                this.setState({archivo_procesando:false, archivo_error: true, archivo_error_msg: String(e)});
                // this.sacar_pop_up()
            })
        }
      }
    
    
    resetState(){
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
            sacar_pop_up: () => {this.props.handleAdd(); this.resetState()},
    
            required: "required",
            
            archivo: false,
            archivo_archivo: null,
            archivo_cargado: false,
            archivo_procesando: false,
            archivo_listo: false,
            archivo_error: false,
            archivo_error_msg: "",
            
            clonar: false,
            clonar_id: 0,
            clonar_procesando: false,
            clonar_listo: false,
            clonar_error: false,
            clonar_error_msg: ""
        })
    }


    render() {
        const { show_form, handleCancel, semestres} = this.props;

        let body;
        if(this.state.archivo_listo){
            body = (
                <div>
        
                <Row><Col/><Col md="auto">
                    <h5> Semestre cargado exitosamente</h5>        
                </Col><Col/></Row>

                <div className="form-group" style={{'marginTop':"4rem"}}>
                    <button className="btn btn-success" type="button" onClick={() => {this.sacar_pop_up()}}>Ok</button>
                </div>
                </div>
            );
        }

        else if(this.state.archivo_procesando){
            body = (
                <div>
                <Row> 
                <Col/><Col md="auto">
                    <h5>Estamos procesando tu archivo, espera un poco porfavor</h5>
                </Col><Col/>
                </Row>
                <Row>
                <Col/><Col md="auto">
                <h1>
                <EllipsisAnimation/>
                </h1>
                </Col><Col/>
                </Row>
                </div>
            );
        }

        else if(this.state.archivo_error){
            body = (
                <div>
                    <Row><Col/><Col md="auto">
                    <h5> Hubo un error al procesar tu archivo</h5>
                
                    {this.state.archivo_error_msg}
                
                    </Col><Col></Col></Row>
                
                <div className="form-group" style={{'marginTop':"4rem"}}>
                    <span style={{marginRight:'30px'}}></span> 
                    <button className="btn btn-danger" type="button" onClick={() => {this.sacar_pop_up()}}>Ok</button>
                    <span style={{marginRight:'30px'}}></span> 
                    <button className="btn btn-primary" type="button" onClick={() => {this.setState({archivo_error: false});}}>Probar denuevo</button>
                </div>
                </div>
            );
        }

        else if(this.state.clonar_listo){

            body = (
                <div>
                <Row><Col/><Col md="auto">
                <h5> Semestre Clonado exitosamente</h5>
                </Col><Col></Col></Row>

                <div className="form-group" style={{'marginTop':"4rem"}}>
                    <button className="btn btn-success" type="button" onClick={() => {this.sacar_pop_up()}}>Ok</button>
                </div>
                </div>
            );
        }

        else if(this.state.clonar_procesando){
            body = (
                <div>
                <Row><Col/><Col md="auto">
                    <h5>Estamos clonando tu archivo, espera un poco porfavor</h5>
                </Col><Col/>
                </Row>
                <Row>
                <Col/><Col md="auto">
                <h1>
                <EllipsisAnimation/>

                </h1>
                </Col><Col/>
                </Row>
                </div>
            );
        }

        else if(this.state.clonar_error){
            body = (
                <div>
                <Row><Col/><Col md="auto">
                <h5> Hubo un error al clonar el semestre</h5>
                {this.state.clonar_error_msg}
                </Col><Col></Col></Row>

                <div className="form-group" style={{'marginTop':"4rem"}}>
                    <span style={{marginRight:'30px'}}></span> 
                    <button className="btn btn-danger" type="button" onClick={() => {this.sacar_pop_up()}}>Ok</button>
                    <span style={{marginRight:'30px'}}></span> 
                    <button className="btn btn-primary" type="button" onClick={() => {this.setState({clonar_error: false});}}>Probar denuevo</button>

                </div>
                </div>
            );
        }
    
        else{

            body = (
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
                                            <input type="radio" id="otoño" name="periodo_semestre" value="1" onChange={this.onChange} className={this.state.form_errors["periodo_semestre"] ? "custom-control-input is-invalid" : this.state.errors_checked["periodo_semestre"] ? "custom-control-input is-valid" : "custom-control-input"} checked={parseInt(this.state.periodo_semestre)===1} />
                                            <label className="custom-control-label" htmlFor="otoño" >Otoño</label>
                                        </div>
                                        <div style={{textAlign:'center'}} className="custom-control custom-radio custom-control-inline" >
                                            <input type="radio" id="primavera" name="periodo_semestre" value="2" onChange={this.onChange} className={this.state.form_errors["periodo_semestre"] ? "custom-control-input is-invalid" : this.state.errors_checked["periodo_semestre"] ? "custom-control-input is-valid" : "custom-control-input"} checked={parseInt(this.state.periodo_semestre)===2}/>
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
                            <input type="radio" id="replicar_semestre" name="clonar" className="custom-control-input" checked={this.state.clonar} onClick={e => this.onSelect("clonar")}/>
                            <label className="custom-control-label" htmlFor="replicar_semestre" >Clonar Semestre</label>
                            
                            {/* <div className="col-sm-10" >
                                <input type="text" className="form-control" name="semestre_replicado" placeholder="Primavera 2020" />
                            </div> */}

                            <div className="col-sm-10" >
                                <select className={this.state.form_errors["clonar"] ? "form-control center is-invalid" : this.state.errors_checked["clonar"] ? "form-control center is-valid" : "form-control center"} name="clonar_id" style={{textAlignLast:'center',textAlign:'center'}} onChange={this.onChange} >
                                    {semestres.map((semestre, i) => (
                                    <option  value={i}>{semestre.año} - {semestre.periodo === 1? "Otoño" : "Primavera"}</option>
                                    ))}
                                </select>
                                <span style={{color: "red", fontSize:"14px"}}>{this.state.form_errors["ramo"]}</span>            
                            </div>
                        </div>                                         
                    
                        </Col>
                        <Col>
                            <div style={{textAlign:'center'}} className="custom-control custom-radio custom-control-inline" >
                                <input type="radio" id="archivo_excel" name="archivo" className="custom-control-input" checked={this.state.archivo} onClick={e => this.onSelect("archivo")} />
                                <label className="custom-control-label" htmlFor="archivo_excel" >Subir desde archivo</label>
                                
                                <div className="col-sm-10" >
                                    <input type="file" className="form-control" name="archivo_excel" onChange={this.onFile } />
                                    <span style={{color: "red", fontSize:"14px"}}>{this.state.form_errors["archivo_excel"]}</span>
                                    <a href={process.env.PUBLIC_URL + '/template.xlsx'} download="template.xlsx" target="_blank" >Descargar Template</a>
                                </div>
                            </div>
                        </Col>
                        </div>
                    </Row>

                    <div className="form-group" style={{'marginTop':"4rem"}}>
                        <button className="btn btn-success" type="submit">Guardar Semestre</button>
                    </div>
                </form>
            );
        }


        return (
            <Modal size="lg" centered show={show_form} onHide={() => {handleCancel(); this.resetState()}}>
            <Modal.Header className="header-add" closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Agregar nuevo semestre
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {body}       
            </Modal.Body>
            </Modal>
        );
      } 
}
const mapStateToProps = (state) => ({
    auth: state.auth
});
   
export default connect(mapStateToProps)(nuevosemestre);