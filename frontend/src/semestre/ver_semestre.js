import React from "react";
import {   Alert,Button,   Container,   Col,   Row,   Form,   FormControl,   InputGroup } from "react-bootstrap";
import ViewTitle from "../common/ViewTitle";
import { Link } from "react-router-dom";
import OptionButton from "../common/OptionButton";
import { File,  Pencil, Trashcan,ArrowLeft} from "@primer/octicons-react";
import DeleteModal from "../common/DeleteModal";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import NuevoCurso from "../curso/nuevo_curso"
import EditarCurso from "../curso/editar_curso"

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
          <Alert variant="secondary">
            <Row>
              <Col>
              <span style={{'fontWeight': "500"}} >
                  {this.props.codigo} {this.props.nombre}
                </span>
                <p className="mb-0">Sección {this.props.seccion}</p>
                <div>Profesor:<ul> {this.props.profesor.map(profesor=> (<li>{profesor }</li>))}</ul></div>
              </Col>
              <Col xs="auto">
                <span style={{marginRight:'30px'}}></span> 
                <Link to={`${this.info.codigo}/${this.info.seccion}/evaluaciones/`}>
                  <OptionButton
                    icon={File}
                    description={this.descriptions.evals}
                    
                  />
                </Link>
                <span style={{marginRight:'30px'}}></span> 
                  <OptionButton icon={Pencil} description={this.descriptions.edit} onClick={() => this.props.showModalEdit()}  />
                <span style={{marginRight:'30px'}}></span> 
                  <OptionButton
                    icon={Trashcan} description={this.descriptions.delete} last={true} onClick={() => this.props.showModalDelete()}  />
              </Col>
            </Row>
          </Alert>
      );
    }
  }
  

export class ver_semestre extends React.Component {
  constructor(props) {
    super(props);
    this.handle_search = this.handle_search.bind(this);
    this.state = {
      cursos: [],
      showModalDelete: false,
      showModalAdd:false, 
      showModalEdit:false,
      cursoPorEliminar: null,
      cursoPorEditar: null,
      MostrarCursos: [],
      search: "",
    };
  }
  static propTypes={
    auth: PropTypes.object.isRequired,
  };
  
  async fetchCursos() {
    const { ano, semestre } = this.props.match.params;
    const periodo= (semestre==="Otoño" ? "otoño" : "primavera")
    await fetch(`http://127.0.0.1:8000/api/cursos/detalle/?semestre=${ano}&periodo=${periodo}`)
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
          showModalDelete: false,
          rcursoPorEliminar: null
        });
        this.fetchCursos();
      })
      .catch( (err) => {
        console.log(err);
        alert("[ERROR] No se pudo eliminar el curso! ");
        this.setState({
          showModalDelete: false,
          cursoPorEliminar: null
        });
      });
  }

  async componentDidMount() {
    this.fetchCursos();
  }

  showModalAdd() {
    this.setState({ showModalAdd: true});
  }

  showModalDelete(curso) {
    this.setState({ 
      showModalDelete: true, 
      cursoPorEliminar: curso,
      deleteModalMsg: `¿Está seguro que desea eliminar el curso: ${curso.ramo}-${curso.seccion}  ${curso.nombre}?`
    });
  }
  showModalEdit(curso) {
    this.setState({ 
      showModalEdit: true, 
      cursoPorEditar: curso
    });
  }

  handleCancelAdd(){
    this.setState({ showModalAdd: false});
  }
  handleCancelEdit(){
    this.setState({ showModalEdit: false, cursoPorEditar: null});
  }
  handleAdd(){
    this.setState({ showModalAdd: false});
    this.fetchCursos();
  }

  handleEdit(){
    this.setState({ showModalEdit: false,cursoPorEditar:null});
    this.fetchCursos();
  }

  handleCancelDelete() {
    this.setState({ showModalDelete: false, cursoPorEliminar: null });
  }
  handle_search(){
    const busqueda= this.state.search;
    const Cursos= this.state.cursos;
    const cursos_buscados= Cursos.filter(o=>
      (o.ramo.toString()+" " + o.nombre.toString() + "Sección " + o.seccion.toString()+"Seccion " + o.seccion.toString()).includes(busqueda)
    );
    console.log("Buscados")
    console.log(cursos_buscados)
    this.setState({MostrarCursos: cursos_buscados});
  }

  update_Search(e){
    this.setState({search: e.target.value});
  };

  render(){
    const { ano, semestre } = this.props.match.params;
    const path= this.props.match.url

    return(
          <main>
          <DeleteModal
            msg={this.state.deleteModalMsg}
            show={this.state.showModalDelete}
            handleCancel={() => this.handleCancelDelete()}
            handleDelete={() => this.handleDelete()}
          />
           <NuevoCurso
          show_form={this.state.showModalAdd} 
          handleCancel={() => this.handleCancelAdd()}
          handleAdd={() => this.handleAdd()}
          periodo={semestre}
          año={ano}
        />

        {this.state.showModalEdit &&
          <EditarCurso
          show_form={this.state.showModalEdit} 
          handleCancel={() => this.handleCancelEdit()}
          handleEdit={() => this.handleEdit()}
          curso={this.state.cursoPorEditar}
          periodo={semestre}
          año={ano}
          seccion={this.state.cursoPorEditar.seccion}
          codigo={this.state.cursoPorEditar.ramo}
          />}
          <Container>
          <Container>
            <ViewTitle>
            <Link  to="/semestres/"><OptionButton   icon={ArrowLeft} description="Volver a semestres" /></Link>
            Cursos de semestre {semestre} {ano}</ViewTitle>
            <Row className="mb-3">
              <Col>

                <Form inline className="mr-auto"  onSubmit={e => {e.preventDefault(); this.handle_search();}}>
                  <InputGroup
                    value={this.state.search}
                    onChange={e => this.update_Search(e)} >
                    <FormControl type="text" placeholder="Buscar Curso" className="mr-sm-2" />
                    <Button type="submit">Buscar</Button>
                  </InputGroup>
                </Form>

              </Col>
              <Col md="auto">
              <Button  className="btn btn-primary float-right">Exportar Semestre</Button>
            </Col>
              <Col xs="auto">

                  <Button className="btn btn-primary float-right" onClick={()=>this.showModalAdd()}>Nuevo Curso</Button>
              </Col>
            </Row>
            {this.state.MostrarCursos.map(curso => (
                <CursoItem
                key={curso.id}
                id={curso.id}
                nombre={curso.nombre}
                seccion={curso.seccion}
                codigo={curso.ramo}
                showModalDelete={() => this.showModalDelete(curso)}
                showModalEdit={() => this.showModalEdit(curso)}
                semestre_malla={curso.semestre_malla}
                profesor={curso.profesor}
                />
            ))}  

          </Container>
          </Container>
        </main>
        );
    }
}
const mapStateToProps = (state) => ({
  auth: state.auth
});
 
export default connect(mapStateToProps)(ver_semestre);