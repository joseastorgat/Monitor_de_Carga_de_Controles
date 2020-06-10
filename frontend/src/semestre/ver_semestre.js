import React from "react";
import {   Alert,Button,   Container,   Col,   Row,   Form,   FormControl,   InputGroup } from "react-bootstrap";
import ViewTitle from "../common/ViewTitle";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import OptionButton from "../common/OptionButton";
import { File,  Gear, Trashcan} from "@primer/octicons-react";


class CursoItem extends React.Component {
    constructor(props) {
      super(props);

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
        <Link style={{ textDecoration: "none" }} to="">
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
                <Link to={`Primavera/${this.info.codigo}/${this.info.seccion}/evaluaciones`}>
                  <OptionButton
                    icon={File}
                    description={this.descriptions.evals}
                    
                  />
                </Link>
                <Link to="#">
                  <OptionButton
                    icon={Gear}
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
  

export default class ver_semestre extends React.Component {
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
  
  async fetchCursos() {
    const query = new URLSearchParams(this.props.location.search);
    console.log("Fetching...")
    console.log(query.get('id'))
    var id = query.get('id')
    // let profesores = [];
    await fetch(`http://127.0.0.1:8000/api/cursos/`)
    .then(response => response.json())
    .then(cursos =>
      this.setState({
        cursos: cursos.filter(o => o.semestre == id),
        MostrarCursos: cursos.filter(o => o.semestre == id)
      })
      )    
    console.log(this.state.profesores)
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
                <Link to={path + "/nuevo_curso"}>
                  <Button className="btn btn-primary">Nuevo Curso</Button>
                </Link>
              </Col>
            </Row>
            {this.state.MostrarCursos.map(curso => (
                <CursoItem
                key={curso.id}
                nombre={curso.ramo}
                seccion={curso.seccion}
                codigo={curso.ramo}
                
                />
            ))}
            <CursoItem id="1" nombre="Algoritmo y Estructura de Datos" codigo="CC3001" seccion="1" />
            <CursoItem id="2" nombre="Metodologías de Diseño y Programación" codigo="CC3002" seccion="1" />
            <CursoItem id="3" nombre="Programación de Software de Sistemas" codigo="CC3301" seccion="1" />
            

          </Container>

          <LinkContainer  to="/semestres" className="float-left " style={{width: '7%', 'marginLeft':"10vw",borderRadius: '8px'}}>
                            <button className="btn btn-primary" >Volver</button>
          </LinkContainer>
        </main>
        );
    }
}