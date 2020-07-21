import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Modal, Col, Row, ModalBody} from "react-bootstrap";
import Alert_2 from '@material-ui/lab/Alert';
import EllipsisAnimation from "../common/EllipsisAnimation";



export class SubirCursos extends React.Component {
    state={
        año: this.props.año,
        periodo: this.props.periodo,
        archivo: "",
        archivo_cargado: false,
        archivo_error: false,
        archivo_procesando: false,
        archivo_listo: false,
        form_errors: {}
    }

    static propTypes={
        auth: PropTypes.object.isRequired,
    };

    resetState(){
        this.setState({
            año: this.props.año,
            periodo: this.props.periodo,
            archivo: "",
            archivo_cargado: false,
            archivo_error: false,
            archivo_procesando: false,
            archivo_listo: false,
            form_error: {}
            
        })
    }

    async subir_cursos(){
        
        const res = await axios.get(process.env.REACT_APP_API_URL + `/semestres/?año=${this.state.año}&periodo=${this.state.periodo === "Otoño"? 1: 2}`);
        
        if (res.status !== 200 || res.data.length !== 1){
            let errors = this.state.form_errors;
            errors["semestre_not_found"] = "Error inesperado, porfavor recarga la página";
            this.setState({
                form_errors: errors
            });
        }

        const sem = res.data[0].id


        if(!this.state.archivo_cargado){
            console.log("archivo no cargado");
            let errors ={}
            errors["archivo_excel"] = "Debes cargar un archivo primero"
            this.setState({
                form_errors: errors,
                errors_checked: {}
            })
            return;
        }

        this.setState({"archivo_procesando": true})
        const url = process.env.REACT_APP_API_URL + `/semestres/${sem}/from_xlsx3/`;
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
            console.log(err);
            console.log(err.response.status)

            let errors = this.state.form_errors;

            if(err.response.status === 412){
                errors["archivo_error"]  = "El semestre que quieres cargar ya existe en el sistema";
            }
            else if(err.response.status === 500 ) {
                errors["archivo_error"]  = "Problema no identificado"
            }
            else if(err.response.status === 406){
                console.log(err.response.data);
                
                if(err.response.data["error"]){
                    errors["archivo_error"] = "Datos de semestre en el excel no coinciden con el semestre al cual se desea cargar la información"
                }

                else{
                    let error_msg ="Error en el formato del archivo:\n"
                            
                    err.response.data.map( data => 
                            error_msg += String(data.tipo) + " " + String(data.detalle)
                    )
                    errors["archivo_error"] = error_msg;
                }
            }

            this.setState({
                archivo_procesando:false,
                archivo_error: true, 
                // archivo_error_msg: archivo_error_msg
                form_errors: errors
            });
        })
    }
    
    handleSubmit = e => {
        e.preventDefault();
        this.subir_cursos();
    }

    onFile = e => {
        this.setState({
          archivo_archivo: e.target.files[0],
          archivo_cargado: true,
        })
    };


    render(){
        const { show_form, handleCancel} = this.props;

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
                    <button className="btn btn-success" type="button" onClick={() => {this.resetState(); this.props.handleAdd()}}>Ok</button>
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

        else{
            const campos = [];

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
                    <Col>
                        <div style={{textAlign:'center'}} className="custom-control custom-radio custom-control-inline" >
                            {/* <input type="radio" id="archivo_excel" name="archivo" className="custom-control-input" checked={this.state.archivo} onClick={e => this.onSelect("archivo")} /> */}
                            <label >Subir desde archivo excel</label>
                            
                            <div className="col-sm-10" >
                                <input type="file" className="form-control" name="archivo_excel" onChange={this.onFile }/>
                                {/* <span style={{color: "red", fontSize:"14px"}}>{this.state.form_errors["archivo_excel"]}</span> */}
                                <a href={process.env.PUBLIC_URL + '/static/template.xlsx'} download="template.xlsx" target="_blank" >Descargar Template</a>
                            </div>
                        </div>
                        </Col>
                    </Row>
                    </div>
                    <div className="form-group" style={{'marginTop':"4rem"}}>
                        <button className="btn btn-success" type="submit">Subir Cursos</button>
                    </div>
                </form>
                </div>
            )

        }



        return (
            <Modal size="lg" centered show={show_form} onHide={() => {handleCancel(); this.resetState()}}>
            <Modal.Header className="header-add" closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                    Agregar Cursos desde un archivo
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
    
export default connect(mapStateToProps)(SubirCursos);