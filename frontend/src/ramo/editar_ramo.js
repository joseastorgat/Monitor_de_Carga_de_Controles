import React from "react";
import axios from 'axios';
import { connect } from "react-redux";
import { Button,Row,Col,Modal} from "react-bootstrap";

export class editar_ramo extends React.Component {
  state = {
    nombre_ramo: "",
    codigo_ramo: "",
    semestre_malla:"",
    ramo_modified: false,

    form_errors: {},
    errors_checked: {},

    sacar_pop_up:"",
  };

  onChange = e => {
      this.setState({
        [e.target.name]: 
        e.target.value
      })
  };
    
  handleSubmit = e => {
      e.preventDefault();
      console.log("submit");
      this.update_ramo();
  }
  async componentDidMount () {  
    this.setState({
      nombre_ramo: this.props.ramo.nombre,
      codigo_ramo: this.props.ramo.codigo,
      semestre_malla:this.props.ramo.semestre_malla,
      ramo_modified: false,
      sacar_pop_up:this.props.handleEdit
    })
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
    console.log(semestre_malla)
    if(!semestres_malla.includes(semestre_malla.toString())){
        errores["semestre_malla"] = "Debe elegir un semestre malla valido"
        isValid = false
    }
    // if(codigo_ramo !== this.props.ramo.codigo){
    //     errores["codigo_ramo"] = "Codigo ramo no coincide con el original"
    //     isValid = false
    // }

    this.setState({
        form_errors: errores,
        errors_checked: errors_checked
    })
    return isValid

}

  update_ramo() {  
    console.log("post ramo ...")
    if(!this.validateForm()){
      return;
    }
    const url = process.env.REACT_APP_API_URL + `/ramos/${this.state.codigo_ramo}/`
    let options = {
      method: 'PATCH',
      url: url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.props.auth.token}`
      },
      data: {
        "nombre": this.state.nombre_ramo,
        "semestre_malla": this.state.semestre_malla
    }
  }
    
    axios(options)
      .then( (res) => {
        console.log(res);
        console.log("ramo updated");
        this.setState({"ramo_modified": true});
        this.state.sacar_pop_up()
      })
      .catch( (err) => {
        console.log(err);
        console.log("cant update ramo");
        alert("No se pudo actualizar el ramo!");
      });
  }

  render() {
    const { show_form, handleCancel} = this.props;
    let resetState = () =>{
      this.setState({
        form_errors: {},
        errors_checked: {},
      })
    }

    return (
      <Modal size="lg" centered show={show_form} onHide={() => {handleCancel(); resetState()}}>
        <Modal.Header className="header-edit" closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Editar ramo
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
                              <input type="text" className={this.state.form_errors["nombre_ramo"] ? "form-control is-invalid" : this.state.errors_checked["nombre_ramo"] ? "form-control is-valid" : "form-control"} name="nombre_ramo" value={this.state.nombre_ramo} onChange={this.onChange} placeholder="Ingrese Nombre Ramo" style={{textAlignLast:'center'}} />
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
                          <input type="text" className={this.state.form_errors["codigo_ramo"] ? "form-control is-invalid" : this.state.errors_checked["codigo_ramo"] ? "form-control is-valid" : "form-control"} name="codigo_ramo" value={this.state.codigo_ramo} onChange={this.onChange} placeholder="Ingrese Código CCXXXX" style={{textAlignLast:'center'}} readOnly={true}  />
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
                              <select className={this.state.form_errors["semestre_malla"] ? "form-control is-invalid" : this.state.errors_checked["semestre_malla"] ? "form-control is-valid" : "form-control"} name="semestre_malla" onChange={this.onChange} value={this.state.semestre_malla} style={{textAlignLast:'center',textAlign:'center'}}  >
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
                  <Button variant="success" type="submit">          Actualizar </Button> </Row>
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

export default connect(mapStateToProps)(editar_ramo);

