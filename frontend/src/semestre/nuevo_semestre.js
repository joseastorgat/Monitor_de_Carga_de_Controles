import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Modal, Col, Row, ModalBody} from "react-bootstrap";
import Alert_2 from '@material-ui/lab/Alert';
import EllipsisAnimation from "../common/EllipsisAnimation";

export class nuevosemestre extends React.Component {
    state={
        año: "",
        periodo: "1",
        inicio: "",
        fin:"",
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
        archivo_listo_msg: "",
        archivo_error: false,
        // archivo_error_msg: "",
        
        clonar: false,
        clonar_id: -1,
        clonar_procesando: false,
        clonar_listo: false,
        clonar_listo_msg: "",
        clonar_error: false,
        // clonar_error_msg: ""
    }


    static propTypes={
        auth: PropTypes.object.isRequired,
    }; 

    resetState(){
        this.setState({
            año: "",
            periodo_semestre: "1",
            inicio: "",
            fin:"",
            estado_semestre:"1",
            forma_creacion_semestre: 0,

            form_errors: {},
            errors_checked: {},
            semestre_created: false,
            // sacar_pop_up: () => {this.props.handleAdd(); this.resetState()},

            required: "required",
            
            archivo: false,
            archivo_archivo: null,
            archivo_cargado: false,
            archivo_procesando: false,
            archivo_listo: false,
            archivo_listo_msg: "",
            archivo_error: false,
            // archivo_error_msg: "",
            
            clonar: false,
            clonar_id: -1,
            clonar_procesando: false,
            clonar_listo: false,
            clonar_listo_msg: "",
            clonar_error: false,
            // clonar_error_msg: ""
        })
    }

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
        // const {clonar, archivo} = this.state;
        if(e === "clonar"){
            this.setState({
                clonar: !this.state.clonar,
                archivo: false,
                required: this.state.clonar? "required" : ""
            })
        }
        else{
            this.setState({
                archivo: !this.state.archivo,
                clonar: false,
                clonar_id: -1,
                required: this.state.archivo? "required" : "",
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
            errores["inicio"] = "Debe ingresar una fecha de inicio"
            isValid = false
        }
        if(fin === ""){
            errores["fin"] = "Debe ingresar una fecha de fin"
            isValid = false
        }

        if(inicio !== "" && fin !== ""){
            let inicio_fecha = new Date(inicio)
            let fin_fecha = new Date(fin)
            if(fin_fecha - inicio_fecha <= 0){
                errores["fin"] = "Debe ingresar una fecha fin posterior a la fecha de inicio"
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
                errores["inicio"] = "El año de la fecha de inicio no coincide con el año del semestre"
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
                "año": parseInt(this.state.año),
                "estado": parseInt(this.state.estado_semestre),
                "periodo": parseInt(this.state.periodo),
                "inicio":this.state.inicio,
                "fin": this.state.fin
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
                    console.log(res);

                    if (res.status === 206){
                        let errors = this.state.form_errors;
                        errors["clonar"] = res.data[0]
                        
                        this.setState({
                            clonar_error: true,
                            form_errors: errors,
                            // clonar_error_msg: clonar_msg,
                            clonar_procesando: false
                        });
                        return;
                    }

                    this.setState({
                        clonar_listo: true,
                        clonar_listo_msg: String(res.data[0]),
                        clonar_procesando: false,
                        form_errors: {},
                        errors_checked: {}
                    });
                })
                .catch( (err) =>{
                    console.log("No se pudo clonar semestre");
                    console.log(err);

                    let errors = this.state.form_errors;
                    // errors["clonar"] = res.data[0]
                    for (let [key, value] of Object.entries(err.response.data)){
                        if(Array.isArray(err.response.data[key]))
                            errors["clonar"] = value[0]
                        else if(typeof(err.response.data[key] === "string"))
                            errors["clonar"] = value
                    }
                    this.setState({
                        clonar_error: true,
                        // clonar_error_msg: "Error desconocido",
                        form_errors: errors,
                        clonar_procesando: false
                    }); 
                  })
                
                return;
              }

            else{
                axios(options)
                .then((res) => {

                    console.log("create semestre");
                    this.setState(
                        {
                            "semestre_created": true,
                            "form_errors": {},
                            "errors_checked": {},
                        }
                    );
                    this.sacar_pop_up()
                })
                .catch( (err) => {
                    let errors = this.state.form_errors;
                    console.log(err.response.data)
                    for (let [key, value] of Object.entries(err.response.data)){
                        if(Array.isArray(err.response.data[key]))
                            errors[key] = value[0]
                        else if(typeof(err.response.data[key] === "string"))
                            errors[key] = value
                    }
                    
                    this.setState({
                        form_errors: errors
                    })
                    });
            }
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
            .then( res => {

                console.log(res);
                let warnings = "";

                if( res.data.status_warning !== 0 ){
                    warnings = (<div>
                        <h5>Alertas:</h5>
                        <ul> { res.data.warnings.map( warning => <li> {warning} </li> )} </ul>
                        </div>
                    );
                }

                let listo_msg = (
                    <div>
                        {warnings}
                        <h5> Cursos Creados </h5>
                        <ul> { res.data['curso status'].map( curso => <li> {curso} </li> )} </ul>
                    </div>
                );

                this.setState({
                    archivo_procesando:false,
                    archivo_listo: true,
                    archivo_listo_msg: listo_msg,
                    form_errors: {},
                    errors_checked: {},
                });
            })
            .catch( err => {
                console.log("ERROR cargando archivo");
                
                let errors = this.state.form_errors;

                if(err.response.status === 412){
                    errors['archivo_error'] = "El semestre que quieres cargar ya existe en el sistema";
                }
                else if(err.response.status === 500 ) {
                    errors['archivo_error'] = "Problema no identificado"
                }
                else if(err.response.status === 406){
                    console.log(err.response.data);
                    const error_msg ="Error en el formato del archivo:\n"
                            
                    err.response.data.map( (data, i) => 
                            errors[`archivo_error_${i}`] = error_msg + " " + String(data.tipo) + " " + String(data.detalle)
                    )
                }
                // errors["archivo_error"] = error_msg

                this.setState({
                    archivo_procesando:false,
                    archivo_error: true, 
                    // archivo_error_msg: archivo_error_msg
                    form_errors: errors
                });
            })
        }
      }
 
    shouldComponentUpdate(prevProps, prevState){
        if( 
            prevState.año !== this.state.año &&
            prevState.periodo !== this.state.periodo &&
            prevState.inicio !== this.state.inicio &&
            prevState.fin !== this.state.fin 
        ){
        return false;}
        return true;
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
                
                <h4> Resumen: </h4>
                {this.state.archivo_listo_msg}
                
                <div className="form-group" style={{'marginTop':"4rem"}}>
                    <button className="btn btn-success" type="button" onClick={() => {this.sacar_pop_up()}}>Ok</button>
                </div>
                </div>
            );
        }

        else if(this.state.archivo_procesando || this.state.clonar_procesando){
            body = (
                <div>
                <Row> 
                <Col/><Col md="auto">
                    <h5>{ 
                    this.state.archivo_procesando?
                    "Estamos procesando tu archivo, espera un poco porfavor":
                    "Estamos clonando tu archivo, espera un poco porfavor"}</h5>
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

        // else if(this.state.archivo_error){
        //     body = (
        //         <div>
        //             <Row><Col/><Col md="auto">
        //             <h4> Hubo un error al procesar tu archivo</h4>
        //             {this.state.archivo_error_msg} 
        //             </Col><Col></Col></Row>

        //         <div className="form-group" style={{'marginTop':"4rem"}}>
        //             <span style={{marginRight:'30px'}}></span> 
        //             <button className="btn btn-danger" type="button" onClick={() => {this.sacar_pop_up()}}>Ok</button>
        //             <span style={{marginRight:'30px'}}></span> 
        //             <button className="btn btn-primary" type="button" onClick={() => {this.setState({archivo_error: false});}}>Probar denuevo</button>
        //         </div>
        //         </div>
        //     );
        // }

        else if(this.state.clonar_listo){

            body = (
                <div>
                <Row><Col/><Col md="auto">
                <h5> Semestre Clonado exitosamente</h5>
                </Col><Col></Col></Row>

                {this.state.clonar_listo_msg}

                <div className="form-group" style={{'marginTop':"4rem"}}>
                    <button className="btn btn-success" type="button" onClick={() => {this.sacar_pop_up()}}>Ok</button>
                </div>
                </div>
            );
        }

        else{
        
            const campos = ["año", "periodo", "inicio", "fin", "clonar_id"];

            body = ( 

                <div>
                { 
				    Object.keys(this.state.form_errors).map(k => {
				    if(!(campos.includes(k))){
					    return (
                            <Alert_2  severity="error">{this.state.form_errors[k]}</Alert_2>
					    )
				    }})
				}
                
                <form className="has-warning" name="form" onSubmit={this.handleSubmit}>
                    <div>
                        <Row>
                            <Col xs="1"></Col>
                            <Col lg={5} >
                                <Row>
                                    <Col xs={2}>
                                        <label >Año<span style={{color:"red"}}>*</span></label>
                                    </Col>
                                    <Col lg={8} xs={11}>
                                        <input value={this.state.año} type="number" min="2019" max="2030" step="1" className={this.state.form_errors["año"] ? "form-control is-invalid" : this.state.errors_checked["año"] ? "form-control is-valid" : "form-control"} placeholder="Ej.: 2020" name="año" onChange={this.onChange} disabled={this.state.archivo} />
                                        <span style={{color: "red", fontSize:"13px"}}>{this.state.form_errors["año"]}</span>
                                    </Col>
                                </Row>
                            </Col>  

                            <Col lg={6} >
                                <Row>
                                    <Col xs={2}>
                                        <label>Tipo<span style={{color:"red"}}>*</span></label>
                                    </Col>
                                    <Col lg={8} xs={11}>
                                        <div  className="custom-control custom-radio custom-control-inline">
                                            <input type="radio" id="otoño" name="periodo" value="1" onChange={this.onChange} className={this.state.form_errors["periodo"] ? "custom-control-input is-invalid" : this.state.errors_checked["periodo"] ? "custom-control-input is-valid" : "custom-control-input"} checked={parseInt(this.state.periodo)===1} disabled={this.state.archivo} />
                                            <label className="custom-control-label" htmlFor="otoño" >Otoño</label>
                                        </div>
                                        <div style={{textAlign:'center'}} className="custom-control custom-radio custom-control-inline" >
                                            <input type="radio" id="primavera" name="periodo" value="2" onChange={this.onChange} className={this.state.form_errors["periodo"] ? "custom-control-input is-invalid" : this.state.errors_checked["periodo"] ? "custom-control-input is-valid" : "custom-control-input"} checked={parseInt(this.state.periodo)===2} disabled={this.state.archivo}/>
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
                                    <input value={this.state.inicio} type="date" className={this.state.form_errors["inicio"] ? "form-control is-invalid" : this.state.errors_checked["inicio"] ? "form-control is-valid" : "form-control"} name="inicio" onChange={this.onChange} disabled={this.state.archivo}/>
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
                                        <input value={this.state.fin} type="date" className={this.state.form_errors["fin"] ? "form-control is-invalid" : this.state.errors_checked["fin"] ? "form-control is-valid" : "form-control"} name="fin" onChange={this.onChange} disabled={this.state.archivo} />
                                        <span style={{color: "red", fontSize:"14px"}}>{this.state.form_errors["fin"]}</span>
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
                                <select className={this.state.form_errors["clonar_id"] ? "form-control center is-invalid" : this.state.errors_checked["clonar_id"] ? "form-control center is-valid" : "form-control center"}
                                    name="clonar_id" 
                                    style={{textAlignLast:'center',textAlign:'center'}}
                                    disabled={!this.state.clonar}
                                    onChange={this.onChange} >
                                        <option value="" selected disabled hidden> Semestre a clonar ...</option>
                                    {   semestres.map((semestre, i) => (
                                        <option  value={i} selected={this.state.clonar_id==i} >{semestre.año} - {semestre.periodo === 1? "Otoño" : "Primavera"}</option>
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
                                    <input type="file" className="form-control" name="archivo_excel" onChange={this.onFile }/>
                                    <span style={{color: "red", fontSize:"14px"}}>{this.state.form_errors["archivo_excel"]}</span>
                                    {/* <a href={process.env.PUBLIC_URL + '/static/template.xlsx'} download="template.xlsx" target="_blank" >Descargar Template</a> */}
                                    <a href={'/static/template.xlsx'} download="template.xlsx" target="_blank" >Descargar Template</a>
                                </div>
                            </div>
                        </Col>
                        </div>
                    </Row>

                    <div className="form-group" style={{'marginTop':"4rem"}}>
                        <button className="btn btn-success" type="submit">Guardar Semestre</button>
                    </div>
                </form>
                </div>
                 );
        }

        return (
            <Modal size="lg" centered show={show_form} onHide={() => {handleCancel(); this.resetState()}}>
            <Modal.Header className="header-add" closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Agregar nuevo semestre
              </Modal.Title>
            </Modal.Header>
            <ModalBody>
                {body}
            </ModalBody>
            </Modal>
        );
      } 
}

const mapStateToProps = (state) => ({
    auth: state.auth
});
   
export default connect(mapStateToProps)(nuevosemestre);