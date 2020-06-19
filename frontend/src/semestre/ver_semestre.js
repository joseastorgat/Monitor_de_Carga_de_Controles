import React from "react";
import {   Alert,Button,   Container,   Col,   Row,   Form,   FormControl,   InputGroup } from "react-bootstrap";
import ViewTitle from "../common/ViewTitle";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import OptionButton from "../common/OptionButton";
import { File,  Pencil, Trashcan} from "@primer/octicons-react";
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
          <Alert variant="secondary">
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
  }
  static propTypes={
    auth: PropTypes.object.isRequired,
};
  
  async fetchCursos() {
    const { ano, semestre } = this.props.match.params;
    const periodo= (semestre=="Otoño" ? "otoño" : "primavera")
    await fetch(`http://127.0.0.1:8000/api/cursos/detalle/?semestre=${ano}&periodo=${periodo}`)
    .then(response => response.json())
    .then(cursos =>
        this.setState({
        cursos: cursos,
        MostrarCursos: cursos
        })
    )    
  }

  async componentDidMount() {
    this.fetchCursos();
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
          <Container>
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
                nombre={curso.nombre}
                seccion={curso.seccion}
                codigo={curso.ramo}
                semestre_malla={curso.semestre_malla}
                />
            ))}  

          </Container>

          <LinkContainer  to="/semestres"  >
              <button className="btn btn-secondary" >Volver a Semestres</button>
          </LinkContainer>
          </Container>
        </main>
        );
    }
}
const mapStateToProps = (state) => ({
  auth: state.auth
});
 
export default connect(mapStateToProps)(ver_semestre);