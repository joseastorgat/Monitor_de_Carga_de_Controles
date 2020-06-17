import React from "react";
import {   Alert,Button,   Container,   Col,   Row,   Form,   FormControl,   InputGroup } from "react-bootstrap";
import ViewTitle from "../common/ViewTitle";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import OptionButton from "../common/OptionButton";
import { File,  Pencil, Trashcan} from "@primer/octicons-react";
import DeleteModal from "../common/DeleteModal";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class CursoItem extends React.Component {
    constructor(props) {
      super(props);
      this.state={
        semestre:null,
      };
      this.info = {
        nombre: this.props.nombre,
        seccion: this.props.seccion,
        codigo: this.props.codigo
      };

      this.descriptions = {
        edit: "Modificar curso",
        evals: "Evaluaciones",
        delete: "Eliminar curso"
      };
    }
  
    render() {
      return (
        <Link style={{ textDecoration: "none" }} to={`${this.info.codigo}/${this.info.seccion}/evaluaciones`}>
          <Alert variant="primary">
            <Row>
              <Col>
                <p className="mb-0">
                  {this.props.codigo} {this.props.nombre}
                </p>
                <p className="mb-0">Sección {this.props.seccion}</p>
              </Col>
              <Col xs="auto">

                {/*Temporal : Cambiar Primavera por el correspondiente al semestre que se esta revisando
                */ }
                <Link to={`${this.info.codigo}/${this.info.seccion}/evaluaciones`}>
                  <OptionButton
                    icon={File}
                    description={this.descriptions.evals}
                    
                  />
                </Link>
                <Link to="#">
                  <OptionButton
                    icon={Pencil}
                    description={this.descriptions.edit}
                  />
                </Link>
                <Link to="#">
                  <OptionButton
                    icon={Trashcan}
                    description={this.descriptions.delete}
                    last={true}
                    onClick={() => this.props.showModal()}
                  />
                </Link>
              </Col>
            </Row>
          </Alert>
        </Link>
      );
    }
  }
  

export class ver_semestre extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cursos: [],
      showModal: false,
      cursoPorEliminar: null,
      MostrarCursos: [],
      search: ""
    };
    this.deleteModalMsg = `¿Está seguro que desea eliminar el curso?`;
  }
  static propTypes={
    auth: PropTypes.object.isRequired,
  };
  
  async fetchCursos() {
    const { ano, semestre } = this.props.match.params;
    const periodo= (semestre=="Otoño" ? "otoño" : "primavera")
    await fetch(`http://127.0.0.1:8000/api/cursos/?semestre=${ano}&periodo=${periodo}`)
    .then(response => response.json())
    .then(cursos =>
        this.setState({
        cursos: cursos,
        MostrarCursos: cursos
        })
    )    
  }

  async handleDelete() {
    let e = this.state.cursoPorEliminar.id
    console.log(e)
    const url = `http://127.0.0.1:8000/api/cursos/${e}/`
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
          rcursoPorEliminar: null
        });
        this.fetchCursos();
      })
      .catch( (err) => {
        console.log(err);
        alert("[ERROR] No se pudo eliminar el curso! ");
        this.setState({
          showModal: false,
          cursoPorEliminar: null
        });
      });
  }

  async componentDidMount() {
    this.fetchCursos();
  }

  showModal(curso) {
    this.setState({ showModal: true, cursoPorEliminar: curso });
  }

  handleCancel() {
    this.setState({ showModal: false, cursoPorEliminar: null });
  }
  render(){
    const handle_search = e => {
      e.preventDefault();
      alert("No implementado, pero se busco "+ this.state.search)
    }
  
    const update_Search= e => {
      this.state.search=e.target.value;
    };
    const { ano, semestre } = this.props.match.params;
    const path= this.props.match.url

    return(
          <main>
          <DeleteModal
            msg={this.deleteModalMsg}
            show={this.state.showModal}
            handleCancel={() => this.handleCancel()}
            handleDelete={() => this.handleDelete()}
          />
          <Container>
            <ViewTitle>Cursos de semestre {semestre} {ano}</ViewTitle>
            <Row className="mb-3">
              <Col>

                <Form inline className="mr-auto" onSubmit={handle_search} >
                  <InputGroup
                    value={this.state.search}
                    onChange={update_Search} >
                    <FormControl type="text" placeholder="Buscar Curso" className="mr-sm-2" />
                    <Button type="submit">Buscar</Button>
                  </InputGroup>
                </Form>

              </Col>
              <Col md="auto">
              <Button >Exportar Semestre</Button>
            </Col>
              <Col xs="auto">
                <Link to={path + "nuevo_curso"}>
                  <Button className="btn btn-primary">Nuevo Curso</Button>
                </Link>
              </Col>
            </Row>
            {this.state.MostrarCursos.map(curso => (
                <CursoItem
                key={curso.id}
                nombre={curso.id}
                seccion={curso.seccion}
                codigo={curso.ramo}
                showModal={() => this.showModal(curso)}
                />
            ))}  

          </Container>

          <LinkContainer  to="/semestres" className="float-left " style={{'marginLeft':"10vw"}}>
              <button className="btn btn-primary" >Volver a Semestres</button>
          </LinkContainer>
        </main>
        );
    }
}
const mapStateToProps = (state) => ({
  auth: state.auth
});
 
export default connect(mapStateToProps)(ver_semestre);