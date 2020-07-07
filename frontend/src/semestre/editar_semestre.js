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
        this.setState({
          [e.target.name]: 
          e.target.value
        })
    };

    handleSubmit = e => {
        e.preventDefault();
        console.log("submit");
        this.update_semestre()
    }

    update_semestre() {  
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
                                            <input type="number" required={this.state.required} min="2019" max="2030" step="1" className="form-control" placeholder="2020" value={this.state.año_semestre} name="año_semestre" onChange={this.onChange}  />
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
                                                <input required={this.state.required} type="radio" id="otoño" name="periodo_semestre" value="1" onChange={this.onChange} className="custom-control-input" checked={parseInt(this.state.periodo_semestre)===1} />
                                                <label className="custom-control-label" htmlFor="otoño" >Otoño</label>
                                            </div>
                                            <div style={{textAlign:'center'}} className="custom-control custom-radio custom-control-inline" >
                                                <input type="radio" id="primavera" name="periodo_semestre" value="2" onChange={this.onChange} className="custom-control-input" checked={parseInt(this.state.periodo_semestre)===2}/>
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
                                        <input required={this.state.required} type="date" className="form-control" name="inicio_semestre" onChange={this.onChange} value={this.state.inicio_semestre} />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg={5} >
                                    <Row>
                                        <Col xs={2}>
                                            <label >Fin</label>
                                        </Col>
                                        <Col lg={9} xs={12}>
                                            <input required={this.state.required} type="date" className="form-control" name="fin_semestre" onChange={this.onChange} value={this.state.fin_semestre} />
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