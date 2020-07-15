import React from "react";
import {   Alert,Button, Modal,  Container,   Col,   Row,   Form,   FormControl,   InputGroup } from "react-bootstrap";
import ViewTitle from "../common/ViewTitle";
import { Link } from "react-router-dom";
import OptionButton from "../common/OptionButton";
import { Pencil, Trashcan, Calendar,Book ,ArrowLeft} from "@primer/octicons-react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import NuevoSemestre from "./nuevo_semestre"
import EditarSemestre from "./editar_semestre"

export class lista_semestre extends React.Component {
  constructor(props) {
    super(props);
    this.handle_search = this.handle_search.bind(this);
    this.state = {
      semestres: [],
      showModalDelete: false,
      showModalAdd: false,
      showModalEdit: false,
      semestrePorEliminar: null,
      semestrePorEditar: null,
      MostrarSemestres: [],
      search: ""
    };
  }

  static propTypes = {
    auth: PropTypes.object.isRequired,
  };

  async fetchSemestres() {
    console.log("Fetching semestres...");
    await fetch(process.env.REACT_APP_API_URL + `/semestres/`)
    .then(response => response.json())
    .then(semestres =>
      this.setState({
        semestres: semestres.sort((a, b) => {
          if (a.año < b.año)
            return 1;
          if (a.año> b.año)
            return -1;
          if (a.periodo < b.periodo)
            return 1;
          if (a.periodo > b.periodo)
            return -1;
          return 0;
        }),
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

  showModalDelete(semestre) {
    this.setState({ showModalDelete: true, semestrePorEliminar: semestre });
  }

  showModalAdd() {
    this.setState({ showModalAdd: true});
  }

  showModalEdit(semestre) {
    this.setState({ showModalEdit: true,  semestrePorEditar: semestre
    });
  }

  handleCancelDelete() {
    this.setState({ showModalDelete: false, semestrePorEliminar: null });
  }

  handleCancelAdd(){
    this.setState({ showModalAdd: false});
  }

  handleCancelEdit(){
    this.setState({ showModalEdit: false, semestrePorEliminar: null});
  }

  handleAdd(){
    this.setState({ showModalAdd: false});
    this.fetchSemestres();
  }

  handleEdit(){
    this.setState({ showModalEdit: false,semestrePorEditar:null});
    this.fetchSemestres();
  }

  async handleDelete() {
    let e = this.state.semestrePorEliminar.id
    console.log(e);
    const url = process.env.REACT_APP_API_URL + `/semestres/${e}/`
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
          showModalDelete: false,
          semestrePorEliminar: null
        });
        this.fetchSemestres();
      })
      .catch( (err) => {
        console.log(err);
        alert("[ERROR] No se pudo eliminar el semestre! ");
        this.setState({
          showModalDelete: false,
          semestrePorEliminar: null
        });
      });
  }

  render() {
      return (
        <Container>
          <DeleteSemestreModal
            semestre={this.state.semestrePorEliminar}
            show={this.state.showModalDelete}
            handleCancel={() => this.handleCancelDelete()}
            handleDelete={() => this.handleDelete()}
          />

          <NuevoSemestre
          show_form={this.state.showModalAdd} 
          handleCancel={() => this.handleCancelAdd()}
          handleAdd={() => this.handleAdd()}
          semestres={this.state.semestres}
          />
          
          {this.state.showModalEdit &&
          <EditarSemestre
          show_form={this.state.showModalEdit} 
          handleCancel={() => this.handleCancelEdit()}
          handleEdit={() => this.handleEdit()}
          semestre={this.state.semestrePorEditar}
          />}

            <ViewTitle>   
            <Link to="/">
           <OptionButton   icon={ArrowLeft} description="Volver a inicio" /></Link>
      Semestres</ViewTitle>
            <Row className="mb-3">
              <Col md={4}>
                <Form inline className="mr-auto" onSubmit={e => {e.preventDefault(); this.handle_search();}} >
                  <InputGroup
                    className="mr-sm-2"
                    value={this.state.search}
                    onChange={e => this.update_Search(e)} >
                    <FormControl type="text" placeholder="Buscar Semestre" className="mr-sm-2" />
                    <Button type="submit">Buscar</Button>
                  </InputGroup>
                </Form>
              </Col>
              <Col md={3}>
                  <Button href={process.env.PUBLIC_URL + '/template.xlsx'} download="template.xlsx" target="_blank" >Descargar Template Excel</Button>
              </Col>
              <Col>
                  <Button className="btn btn-primary float-right" onClick={() => this.showModalAdd()}>Nuevo Semestre</Button>
              </Col>
            </Row>

            {this.state.MostrarSemestres.map(semestre => (
            <SemesterItem
              id={semestre.id}
              año={semestre.año}
              semestre={ semestre.periodo===1 ? ("Otoño") : ("Primavera")}
              showModalDelete={() => this.showModalDelete(semestre)}
              showModalEdit={() => this.showModalEdit(semestre)}
            />
          ))}

          </Container>
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
      if(this.state.eliminar_año === "" || this.state.eliminar_periodo === ""){
        alert("Debe ingresar tanto el año como el periodo del semestre que esta eliminando")
        return false
      }
      var periodo = "" 
      if (this.state.eliminar_periodo.toLowerCase() === "primavera"){
        periodo = 2
      }
      if(this.state.eliminar_periodo.toLowerCase() === "otoño"){
        periodo = 1
      }
      console.log(semestre.año)
      console.log(this.state.eliminar_año)
      console.log(semestre.periodo)
      console.log(periodo)
      if(semestre.año === parseInt(this.state.eliminar_año) && semestre.periodo === periodo){
        this.setState({semestre_deleted: true});
        return true
      }
      alert("Los datos ingresados no coinciden con el semestre que se desea eliminar")
      return false
    }
    render(){
      const{show, handleCancel, handleDelete, semestre } = this.props;
      return (
        <Modal show={show} onHide={() => handleCancel()}>
        <Modal.Header className="header-delete" closeButton>
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
        <div class="w-100" >
          <Button variant="danger" onClick={() => this.deleteValidation(semestre) ? handleDelete() : this.setState({semestre_deleted: false})}>
            Eliminar
          </Button>
          <Button variant="secondary" className="float-right" onClick={() => handleCancel()}>
            Cancelar
          </Button>
          </div>
        </Modal.Footer>
      </Modal>
      )
    }
  } 

  class SemesterItem extends React.Component {

    render() {
      const año=this.props.año;
      const semestre= this.props.semestre;
      const id_periodo=(semestre==="Otoño" ? 1 : 2)
      return (
      
        <Alert variant="secondary">
            <Row>
                   <Col xs="auto">
                {año} {semestre}
              </Col>
             
              <Col className="text-center"></Col>
              <Col  xs="auto">
                  <Link to={`/calendario/${año}/${id_periodo}/`} >
                    <OptionButton  icon={Calendar}  description="Visualizar semestre" />
                  </Link>
                  <span style={{marginRight:'30px'}}></span> 
                  <Link  to={`${año}/${semestre}/`} >
                    <OptionButton  icon={Book}  description="Ver cursos" />
                  </Link>
                  <span style={{marginRight:'30px'}}></span> 
                    <OptionButton icon={Pencil} description="Modificar semestre"  onClick={() => this.props.showModalEdit()}    last={true}  />
                  <span style={{marginRight:'30px'}}></span> 

                  <OptionButton   icon={Trashcan} description="Eliminar semestre"  onClick={() => this.props.showModalDelete()}    last={true}  />
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