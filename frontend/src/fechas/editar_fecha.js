import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Modal,Row,Col} from "react-bootstrap";

export class editarfecha extends React.Component {
    static propTypes={
        auth: PropTypes.object.isRequired,
    };

    state={
        id:"",
        nombre_fecha: "",
        tipo_fecha: "",
        inicio_fecha: "",
        fin_fecha:"",
        fecha_modified: false,
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
        this.update_fecha();
    }

    async componentDidMount () {  
        this.setState({
                id: this.props.fecha.id,
                nombre_fecha:this.props.fecha.nombre,
                tipo_fecha: this.props.fecha.tipo,
                inicio_fecha: this.props.fecha.inicio,
                fin_fecha:this.props.fecha.fin,
                sacar_pop_up:this.props.handleEdit
            })
      }

    update_fecha() {  
        console.log("post fecha ...")
        const fecha_fin = this.state.fin_fecha === "" ? this.state.inicio_fecha : this.state.fin_fecha;

        const url = `http://127.0.0.1:8000/api/fechas-especiales/${this.state.id}/`
        let options = {
            method: 'PATCH',
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
            console.log("update fecha");
            this.setState({"fecha_modified": true});
            this.state.sacar_pop_up()
          })
          .catch( (err) => {
            console.log(err);
            console.log("cant update fecha");
            alert("No se pudo actualizar fecha!");
            this.state.sacar_pop_up()
          });
      }

      render() {
        const { show_form, handleCancel} = this.props;
        return (
            <Modal size="lg" centered show={show_form} onHide={() => handleCancel()}>
        <Modal.Header className="header-edit" closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Editar fecha
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
                                            <input required type="text" className="form-control" name="nombre_fecha" onChange={this.onChange} value={this.state.nombre_fecha} placeholder="Nombre Feriado" style={{textAlignLast:'center'}} />
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
                                            <select className="form-control"  onChange={this.onChange} name="tipo_fecha" value={this.state.tipo_fecha} style={{textAlignLast:'center',textAlign:'center'}}  >
                                                <option value="1">Feriado</option>
                                                <option value="2">Vacaciones de Invierno</option>
                                                <option value="3">Semana Olimpica</option>
                                                <option value="4">Semana de Vacaciones</option>
                                                <option value="5">Otros</option>
                                            </select>
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
                                            <input required type="date" onChange={this.onChange} className="form-control" name="inicio_fecha" value={this.state.inicio_fecha} />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg={5}>
                                    <Row>
                                        <Col xs={2}>
                                            <label >Fin</label>
                                        </Col>
                                        <Col lg={8} xs={12}>
                                            <input type="date" onChange={this.onChange} className="form-control" name="fin_fecha" value={this.state.fin_fecha} />
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