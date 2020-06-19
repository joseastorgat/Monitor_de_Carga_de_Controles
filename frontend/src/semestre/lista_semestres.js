import React from "react";
import {   Alert,Button, Modal,  Container,   Col,   Row,   Form,   FormControl,   InputGroup } from "react-bootstrap";
import ViewTitle from "../common/ViewTitle";
import { Link } from "react-router-dom";
import DeleteModal from "../common/DeleteModal";
import OptionButton from "../common/OptionButton";
import { Pencil, Trashcan, Calendar } from "@primer/octicons-react";
import { LinkContainer } from "react-router-bootstrap";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";

export class lista_semestre extends React.Component {
  constructor(props) {
    super(props);
    this.handle_search = this.handle_search.bind(this);
    this.state = {
      semestres: [],
      showModal: false,
      semestrePorEliminar: null,
      MostrarSemestres: [],
      search: ""
    };

    this.deleteModalMsg = `¿Está seguro que desea eliminar el semestre?
    Recuerde que esto borrara todos los cursos y evaluaciones asociadas.`;
  }

  static propTypes = {
    auth: PropTypes.object.isRequired,
  };

  async fetchSemestres() {
    console.log("Fetching...")
    await fetch(`http://127.0.0.1:8000/api/semestres/`)
    .then(response => response.json())
    .then(semestres =>
      this.setState({
        semestres: semestres,
        MostrarSemestres: semestres
      })
      )    
  }

  async componentDidMount() {
    this.fetchSemestres();
  }

  handle_search(){
    const busqueda= this.state.search;
    const Semestres= this.state.semestres;
    const Semestres_buscados= Semestres.filter(o=>
      (o.año.toString()+" " + (o.periodo===1 ? ("Otoño") : ("Primavera"))).includes(busqueda)
    );
    console.log("Buscados")
    console.log(Semestres_buscados)
    this.setState({MostrarSemestres: Semestres_buscados});
  }
  
  update_Search(e){
    this.setState({search: e.target.value});
  }

  showModal(semestre) {
    this.setState({ showModal: true, semestrePorEliminar: semestre });
  }

  handleCancel() {
    this.setState({ showModal: false, semestrePorEliminar: null });
  }

  async handleDelete() {
    let e = this.state.semestrePorEliminar.id
    console.log(e)
    const url = `http://127.0.0.1:8000/api/semestres/${e}/`
    let options = {
      method: 'DELETE',
      url: url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.props.auth.token}`
      }
    }
    axios(options)
      .then( (res) => {
        this.setState({
          showModal: false,
          semestrePorEliminar: null
        });
        this.fetchSemestres();
      })
      .catch( (err) => {
        console.log(err);
        alert("[ERROR] No se pudo eliminar el semestre! ");
        this.setState({
          showModal: false,
          semestrePorEliminar: null
        });
      });
  }

  render() {
      return (
        <main>
        <DeleteSemestreModal
          semestre={this.state.semestrePorEliminar}
          show={this.state.showModal}
          handleCancel={() => this.handleCancel()}
          handleDelete={() => this.handleDelete()}
        />
          <Container>
            <ViewTitle>Semestres</ViewTitle>
            <Row className="mb-3">
              <Col>

                <Form inline className="mr-auto" onSubmit={e => {e.preventDefault(); this.handle_search();}} >
                  <InputGroup
                    value={this.state.search}
                    onChange={e => this.update_Search(e)} >
                    <FormControl type="text" placeholder="Buscar Semestre" className="mr-sm-2" />
                    <Button type="submit">Buscar</Button>
                  </InputGroup>
                </Form>

              </Col>
              <Col xs="auto">
                <Link to="/semestres/nuevo_semestre">
                  <Button className="btn btn-primary">Nuevo Semestre</Button>
                </Link>
              </Col>
            </Row>

            {this.state.MostrarSemestres.map(semestre => (
            <SemesterItem
              id={semestre.id}
              año={semestre.año}
              semestre={ semestre.periodo==1 ? ("Otoño") : ("Primavera")}
              showModal={() => this.showModal(semestre)}
            />
          ))}

          </Container>

          <LinkContainer  activeClassName=""  to="/administrar" className="float-left " style={{'marginLeft':"10vw"}}>
            <button className="btn btn-primary" >Volver a Administrar</button>
          </LinkContainer>
        </main>
      );
    }
  }

  class DeleteSemestreModal extends React.Component{
    constructor(props){
      super(props)
      this.state = {
        eliminar_año : "",
        eliminar_periodo : "",
        semestre_deleted : false
      }
      
    }
    onChange = e => {
      this.setState({
        [e.target.name]: 
        e.target.value
      })
    };

    deleteValidation(semestre){
      console.log(this.state.eliminar_año)
      if(this.state.eliminar_año == "" || this.state.eliminar_periodo == ""){
        alert("Debe ingresar tanto el año como el periodo del semestre que esta eliminando")
        return false
      }
      var periodo = "" 
      if (this.state.eliminar_periodo.toLowerCase() == "primavera"){
        periodo = 2
      }
      if(this.state.eliminar_periodo.toLowerCase() == "otoño"){
        periodo = 1
      }
      if(semestre.año == this.state.eliminar_año && semestre.periodo == periodo){
        this.state.semestre_deleted = true
        return true
      }
      alert("Los datos ingresados no coinciden con el semestre que se desea eliminar")
      return false
    }
    render(){
      const{show, handleCancel, handleDelete, semestre, } = this.props;
      return (
        <Modal show={show} onHide={() => handleCancel()}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Confirmación de eliminación
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label><font color="red">[ADVERTENCIA]</font> Eliminar un semestre eliminara los cursos y evaluaciones asociadas. Para confirmar la eliminacion del semestre escogido ingrese su año y periodo.</label>
            <div class="col-sm-6" >
              <label >Año</label>
            </div>
            <div class="col-sm-9" >
              <input type="text" className="form-control" name="eliminar_año"  onChange={this.onChange} style={{textAlignLast:'center'}} />
            </div>
            <div class="row"></div>
            <div class="col-sm-6" >
              <label> Periodo (Primavera u Otoño)</label>
            </div>
            <div class="col-sm-9" >
              <input type="text" className="form-control" name="eliminar_periodo"  onChange={this.onChange} style={{textAlignLast:'center'}} />
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleCancel()}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={() => this.deleteValidation(semestre) ? handleDelete() : this.state.semestre_deleted = false}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
      )
    }
  } 

  class SemesterItem extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      const año=this.props.año;
      const semestre= this.props.semestre;
      return (
        <Alert variant="secondary">
            <Row>
            <Link to={`semestres/${año}/${semestre}/`}>   
              <Col xs="auto">
                {año} {semestre}
              </Col>
              </Link>
              <Col className="text-center"></Col>
              <Col  xs="auto">
                  <OptionButton  icon={Calendar}  description="Visualizar semestre"  onClick={() => alert("No implementado")} />
  
                  <Link to={`semestres/${año}/${semestre}/editar`} >
                    <OptionButton icon={Pencil} description="Modificar semestre" />
                  </Link>

                  <OptionButton   icon={Trashcan} description="Eliminar semestre"  onClick={() => this.props.showModal()}    last={true}  />
              </Col>
            </Row>
            </Alert>
            
      );
    }
  }
const mapStateToProps = (state) => ({
  auth: state.auth
}); 

export default connect(mapStateToProps)(lista_semestre);