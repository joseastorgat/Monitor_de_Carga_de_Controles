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

export class lista_profesores extends React.Component {
  constructor(props) {
    super(props);
    this.handle_search = this.handle_search.bind(this);
    this.state = {
      profesores: [],
      showModal: false,
      profesorPorEliminar: null,
      MostrarProfesores: [],
      search: ""
    };

    this.deleteModalMsg = '¿Está seguro que desea eliminar el Profesor?';
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
        profesores: profesores,
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

  showModal(profesor) {
    this.setState({ showModal: true, profesorPorEliminar: profesor });
  }

  handleCancel() {
    this.setState({ showModal: false, ramoPorEliminar: null });
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
          showModal: false,
          profesorPorEliminar: null
        });
        this.fetchProfesores();
      })
      .catch( (err) => {
        console.log(err);
        alert("[ERROR] No se pudo eliminar el profesor! ");
        this.setState({
          showModal: false,
          profesorPorEliminar: null
        });
      });
  }


    render() {
      return (
        <main>
        <Container>
          <DeleteModal
            msg={this.deleteModalMsg}
            show={this.state.showModal}
            handleCancel={() => this.handleCancel()}
            handleDelete={() => this.handleDelete()}
        />
          <Container>
            <ViewTitle>
            <Link to="/" exact path><OptionButton   icon={ArrowLeft} description="Volver a inicio" /></Link>
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
              <Col>
                <Link to="/profesores/nuevo_profesor/">
                  <Button className="btn btn-primary float-right">Nuevo Profesor</Button>
                </Link>
              </Col>
            </Row>
              {this.state.MostrarProfesores.map(profesor => (
                  <ProfesorItem
                  key={profesor.id}
                  id={profesor.id}
                  nombre={profesor.nombre}
                  showModal={() => this.showModal(profesor)}
                  />
              ))}
          </Container>
          
          </Container>
        </main>
      );
    }
  }


  class ProfesorItem extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      const id = this.props.id
      const nombre =this.props.nombre;
      return (
        <Alert variant="secondary">
            <Row>
              <Col xs="auto">
                {nombre}
              </Col>
              <Col className="text-center"></Col>
              <Col  xs="auto">
                 
                  <Link to={`${id}/editar/`}>
                  <OptionButton icon={Pencil} description="Modificar profesor"/>
                  </Link>

                  <OptionButton   icon={Trashcan} description="Eliminar profesor"  onClick={() => this.props.showModal()}    last={true}   />
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
    