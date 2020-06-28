import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Modal,Col,Row} from "react-bootstrap";

export class nuevosemestre extends React.Component {
    static propTypes={
        auth: PropTypes.object.isRequired,
    };

    state={
        año_semestre: "",
        periodo_semestre: "1",
        inicio_semestre: "",
        fin_semestre:"",
        estado_semestre:"1",
        forma_creacion_semestre:0,
        semestre_created: false,
        sacar_pop_up: this.props.handleAdd,

        required: "required",
        subir_archivo: false,
        clonar_semestre: false,
        archivo: null,
        archivo_cargado: false,
    }

    onChange = e => {
        this.setState({
          [e.target.name]: 
          e.target.value
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
                required: subir_archivo? "required" : ""
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

    create_semestre() {  
        console.log("post semestre ...")
        let url = "";
        let data = {};
        let options = {};
       
        if(!this.state.subir_archivo){
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
                alert("Debes cargar un archivo primero");
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
        return (
            <Modal size="lg" centered show={show_form} onHide={() => handleCancel()}>
            <Modal.Header className="header-add" closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Agregar nuevo semestre
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
                                            <input type="number" required={this.state.required} min="2019" max="2030" step="1" className="form-control" placeholder="2020" name="año_semestre" onChange={this.onChange}  />
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
                                                <input required={this.state.required} type="radio" id="otoño" name="periodo_semestre" value="1" onChange={this.onChange} className="custom-control-input" checked={this.state.periodo_semestre==1} />
                                                <label className="custom-control-label" htmlFor="otoño" >Otoño</label>
                                            </div>
                                            <div style={{textAlign:'center'}} className="custom-control custom-radio custom-control-inline" >
                                                <input type="radio" id="primavera" name="periodo_semestre" value="2" onChange={this.onChange} className="custom-control-input" checked={this.state.periodo_semestre==2}/>
                                                <label className="custom-control-label" htmlFor="primavera">Primavera</label>
                                            </div>
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
                                        <input required={this.state.required} type="date" className="form-control" name="inicio_semestre" onChange={this.onChange} />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg={5} >
                                    <Row>
                                        <Col xs={2}>
                                            <label >Fin</label>
                                        </Col>
                                        <Col lg={9} xs={12}>
                                            <input required={this.state.required} type="date" className="form-control" name="fin_semestre" onChange={this.onChange} />
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