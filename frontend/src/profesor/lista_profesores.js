import React from "react";
import {   Alert,Button,   Container,   Col,   Row,   Form,   FormControl,   InputGroup } from "react-bootstrap";
import ViewTitle from "../common/ViewTitle";
import { Link } from "react-router-dom";
import OptionButton from "../common/OptionButton";
import {Pencil, Trashcan,ArrowLeft} from "@primer/octicons-react";
import DeleteModal from "../common/DeleteModal";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import NuevoProfesor from "./nuevo_profesor"
import EditarProfesor from "./editar_profesor"

export class lista_profesores extends React.Component {
  constructor(props) {
    super(props);
    this.handle_search = this.handle_search.bind(this);
    this.state = {
      profesores: [],
      showModalDelete: false,
      showModalAdd:false,
      showModalEdit:false,
      profesorPorEliminar: null,
      profesorPorEditar:null,
      MostrarProfesores: [],
      search: ""
    };

  }
  static propTypes = {
    auth: PropTypes.object.isRequired,
  };

  state = {
    nombre: "",
  };

  async fetchProfesores() {
    console.log("Fetching...")
    // let profesores = [];
    await fetch(`http://127.0.0.1:8000/api/profesores/`)
    .then(response => response.json())
    .then(profesores =>
      this.setState({
        profesores: profesores.sort((a, b) => {
          if (a.nombre < b.nombre)
            return -1;
          if (a.nombre > b.nombre)
            return 1;
          return 0;
        }),
        MostrarProfesores: profesores
      })
      )    
  }

  async componentDidMount() {
    this.fetchProfesores();
  }

  handle_search(){
    const busqueda= this.state.search;
    const profesores= this.state.profesores;
    const profesores_buscados= profesores.filter(o=>
      (o.nombre.toString()).includes(busqueda)
    );
    console.log("Buscados")
    console.log(profesores_buscados)
    this.setState({MostrarProfesores: profesores_buscados});
  }

  update_Search(e){
    this.setState({search: e.target.value});
  }
  showModalAdd() {
    this.setState({ showModalAdd: true});
  }
  showModalDelete(profesor) {
    this.setState({ 
      showModalDelete: true, 
      profesorPorEliminar: profesor,
      deleteModalMsg: `¿Está seguro que desea eliminar el/la profesor/a: ${profesor.nombre}?`
    });
  }
  showModalEdit(profesor) {
    this.setState({ 
      showModalEdit: true, 
      profesorPorEditar: profesor
    });
  }

  handleCancelDelete() {
    this.setState({ showModalDelete: false, profesorPorEliminar: null });
  }
  handleCancelAdd(){
    this.setState({ showModalAdd: false});
  }
  handleCancelEdit(){
    this.setState({ showModalEdit: false, profesorPorEliminar: null});
  }
  handleAdd(){
    this.setState({ showModalAdd: false});
    this.fetchProfesores();
  }

  handleEdit(){
    this.setState({ showModalEdit: false,profesorPorEditar:null});
    this.fetchProfesores();
  }

  async handleDelete() {
    let e = this.state.profesorPorEliminar.id
    console.log(e)
    const url = `http://127.0.0.1:8000/api/profesores/${e}/`
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
          profesorPorEliminar: null
        });
        this.fetchProfesores();
      })
      .catch( (err) => {
        console.log(err);
        alert("[ERROR] No se pudo eliminar el profesor! ");
        this.setState({
          showModalDelete: false,
          profesorPorEliminar: null
        });
      });
  }


    render() {
      return (
        <main>
        <Container>
        <NuevoProfesor
          show_form={this.state.showModalAdd} 
          handleCancel={() => this.handleCancelAdd()}
          handleAdd={() => this.handleAdd()}
        />
        {this.state.showModalEdit &&
        <EditarProfesor
          show_form={this.state.showModalEdit} 
          handleCancel={() => this.handleCancelEdit()}
          handleEdit={() => this.handleEdit()}
          profesor={this.state.profesorPorEditar}
        />}
          <DeleteModal
            msg={this.state.deleteModalMsg}
            show={this.state.showModalDelete}
            handleCancel={() => this.handleCancelDelete()}
            handleDelete={() => this.handleDelete()}
        />
          <Container>
            <ViewTitle>
            <Link to="/" ><OptionButton   icon={ArrowLeft} description="Volver a inicio" /></Link>
            Profesores</ViewTitle>
            <Row className="mb-3">
              <Col  md={4}>
                <Form inline className="mr-auto" onSubmit={e => {e.preventDefault(); this.handle_search();}} >
                  <InputGroup
                    value={this.state.search}
                    onChange={e => this.update_Search(e)} >
                    <FormControl type="text" placeholder="Buscar Profesor" className="mr-sm-2" />
                    <Button type="submit">Buscar</Button>
                  </InputGroup>
                </Form>

              </Col>
              <Col >
                  <Button className="btn btn-primary float-right"  onClick={() => this.showModalAdd()}>Nuevo Profesor</Button>
              </Col>
            </Row>
              {this.state.MostrarProfesores.map(profesor => (
                  <ProfesorItem
                  key={profesor.id}
                  id={profesor.id}
                  nombre={profesor.nombre}
                  showModalDelete={() => this.showModalDelete(profesor)}
                  showModalEdit={() => this.showModalEdit(profesor)}
                  />
              ))}
          </Container>
          </Container>
        </main>
      );
    }
  }


  class ProfesorItem extends React.Component {
    render() {
      const nombre =this.props.nombre;
      return (
        <Alert variant="secondary">
            <Row>
              <Col xs="auto">
                {nombre}
              </Col>
              <Col className="text-center"></Col>
              <Col xs="auto">
                  <OptionButton icon={Pencil} description="Modificar profesor"  onClick={() => this.props.showModalEdit()} last={true} />
                  <span style={{marginRight:'30px'}}></span> 
                  <OptionButton   icon={Trashcan} description="Eliminar profesor" onClick={() => this.props.showModalDelete()} last={true} />
              </Col>
            </Row>
            </Alert>
      );
    }
  }

const mapStateToProps = (state) => ({
  auth: state.auth
});
  
export default connect(mapStateToProps)(lista_profesores);
    