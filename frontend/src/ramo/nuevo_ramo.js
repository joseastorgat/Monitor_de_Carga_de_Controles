import React from "react";
import {Button, Modal,Row,Col} from "react-bootstrap";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";

export class Nuevoramo extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
  };

  state = {
    nombre_ramo: "",
    codigo_ramo: "",
    semestre_malla: "5",
    ramo_created: false,

    form_errors: {},
    errors_checked: {},

    sacar_pop_up: this.props.handleAdd
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

  handleSubmit = e => {
    e.preventDefault();
    console.log("submit");
    this.create_ramo();
  }

  validateForm(){
    let errores = {}
    let isValid = true
    let semestres_malla = ["5", "6", "7", "8", "9", "10", "15"]
    let nombre_ramo = this.state.nombre_ramo
    let semestre_malla =  this.state.semestre_malla
    let codigo_ramo = this.state.codigo_ramo
    let errors_checked = {
        nombre_ramo: true,
        semestre_malla: true,
        codigo_ramo: true,
    }

    if(nombre_ramo === ""){
        errores["nombre_ramo"] = "Debe ingresar un nombre para el ramo"
        isValid = false
    }
    if(!semestres_malla.includes(semestre_malla)){
        errores["semestre_malla"] = "Debe elegir un semestre malla valido"
        isValid = false
    }
    if(codigo_ramo === ""){
        errores["codigo_ramo"] = "Debe ingresar un código para el ramo"
        isValid = false
    }

    this.setState({
        form_errors: errores,
        errors_checked: errors_checked
    })
    return isValid

}
  
  create_ramo() {  
    console.log("post ramo ...")
    if(!this.validateForm()){
      return;
    }
    const url = process.env.REACT_APP_API_URL + '/ramos/';
    let options = {
      method: 'POST',
      url: url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.props.auth.token}`
      },
      data: {
        "nombre": this.state.nombre_ramo,
        "codigo": this.state.codigo_ramo,
        "semestre_malla": this.state.semestre_malla
    }
  }
    
    axios(options)
      .then( (res) => {
        console.log(res);
        console.log("create ramo");
        this.setState({"ramo_created": true});
        this.state.sacar_pop_up()
      })
      .catch( (err) => {
        console.log(err);
        console.log("cant create ramo");
        alert("No se pudo crear ramo!");
        this.state.sacar_pop_up()
      });
  }
  render() {
    const { show_form, handleCancel} = this.props;
    let resetState = () =>{
      this.setState({
        nombre_ramo: "",
        codigo_ramo: "",
        semestre_malla: "5",
        ramo_created: false,
    
        form_errors: {},
        errors_checked: {},
    
        sacar_pop_up: this.props.handleAdd
      })
    }
    return (
      <Modal size="lg" centered show={show_form} onHide={() => {handleCancel(); resetState()}}>
        <Modal.Header className="header-add" closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Agregar nuevo ramo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div>
          <form className="" name="form" onSubmit={this.handleSubmit}>
              <Row>
                <Col xs="1"></Col>
                  <Col lg={5} >
                      <Row>
                          <Col xs="auto">
                              <label >Ramo</label>
                          </Col>
                          <Col lg={9} xs={12}>
                              <input  type="text" className={this.state.form_errors["nombre_ramo"] ? "form-control is-invalid" : this.state.errors_checked["nombre_ramo"] ? "form-control is-valid" : "form-control"} name="nombre_ramo" onChange={this.onChange} placeholder="Ingrese Nombre Ramo" style={{textAlignLast:'center'}} />
                              <span style={{color: "red", fontSize:"14px"}}>{this.state.form_errors["nombre_ramo"]}</span>
                          </Col>
                      </Row>
                  </Col>  

                  <Col lg={5}>
                      <Row>
                          <Col xs="auto">
                              <label >Código</label>
                          </Col>
                          <Col lg={9} xs={12}>
                          <input  type="text" className={this.state.form_errors["codigo_ramo"] ? "form-control is-invalid" : this.state.errors_checked["codigo_ramo"] ? "form-control is-valid" : "form-control"} name="codigo_ramo" onChange={this.onChange} placeholder="Ingrese Código CCXXXX" style={{textAlignLast:'center'}}  />
                          <span style={{color: "red", fontSize:"14px"}}>{this.state.form_errors["codigo_ramo"]}</span>
                          </Col>                          
                      </Row>
                  </Col>
              </Row>

              <Row>
                <Col xs="1"></Col>
                  <Col lg={5}>
                      <Row> 
                          <Col xs="auto" >
                              <label >Semestre</label>
                          </Col>
                          <Col lg={8} xs={12}>
                          {/* No pude centrarlo, hay un problema con prioridades de css de react */}
                              <select className={this.state.form_errors["semestre_malla"] ? "form-control is-invalid" : this.state.errors_checked["semestre_malla"] ? "form-control is-valid" : "form-control"} name="semestre_malla" onChange={this.onChange} style={{textAlignLast:'center',textAlign:'center'}}  >
                                  <option value="5" selected>Quinto</option>
                                  <option value="6">Sexto</option>
                                  <option value="7">Séptimo</option>
                                  <option value="8">Octavo</option>
                                  <option value="9">Noveno</option>
                                  <option value="10">Décimo</option>
                                  <option value="15">Electivo</option>
                              </select>
                              <span style={{color: "red", fontSize:"14px"}}>{this.state.form_errors["semestre_malla"]}</span>
                          </Col>
                      </Row>
                  </Col>  
              </Row>
          <Row></Row><Row></Row><Row></Row>
                    <Row>
                    <div className="col-md-6" > </div>
                  <Button variant="success" type="submit">  Agregar </Button> </Row>
          <Row></Row><Row></Row>
          </form>
  </div>
        </Modal.Body>
        {/* <Modal.Footer centered>
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

export default connect(mapStateToProps)(Nuevoramo);

