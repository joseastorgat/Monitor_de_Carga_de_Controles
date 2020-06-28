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
      sacar_pop_up:this.props.handleEdits
        })
  }

  update_ramo() {  
    console.log("post ramo ...")
    const url = `http://127.0.0.1:8000/api/ramos/${this.state.codigo_ramo}/`
    let options = {
      method: 'PATCH',
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
    return (
      <Modal size="lg" centered show={show_form} onHide={() => handleCancel()}>
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
                              <input required type="text" className="form-control" name="nombre_ramo" value={this.state.nombre_ramo} onChange={this.onChange} placeholder="Ingrese Nombre Ramo" style={{textAlignLast:'center'}} />
                          </Col>
                      </Row>
                  </Col>  

                  <Col lg={5}>
                      <Row>
                          <Col xs="auto">
                              <label >Código</label>
                          </Col>
                          <Col lg={9} xs={12}>
                          <input required type="text" className="form-control" name="codigo_ramo" value={this.state.codigo_ramo} onChange={this.onChange} placeholder="Ingrese Código CCXXXX" style={{textAlignLast:'center'}} readOnly={true}  />
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
                              <select className="form-control" name="semestre_malla" onChange={this.onChange} value={this.state.semestre_malla} style={{textAlignLast:'center',textAlign:'center'}}  >
                                  <option value="5" selected>Quinto</option>
                                  <option value="6">Sexto</option>
                                  <option value="7">Séptimo</option>
                                  <option value="8">Octavo</option>
                                  <option value="9">Noveno</option>
                                  <option value="10">Décimo</option>
                                  <option value="15">Electivo</option>
                              </select>
                          </Col>
                      </Row>
                  </Col>  
              </Row>
          <Row></Row><Row></Row><Row></Row>
                    <Row>
                    <div className="col-md-6" > </div>
                  <Button variant="success" center  type="submit">          Agregar </Button> </Row>
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

