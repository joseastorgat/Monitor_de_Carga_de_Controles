import React from "react";
import { Alert,Button, Modal,Container,   Col,   Row,   Form,   FormControl,   InputGroup } from "react-bootstrap";
import ViewTitle from "../common/ViewTitle";
import { Link } from "react-router-dom";
import OptionButton from "../common/OptionButton";
import { Pencil, Trashcan,ArrowLeft} from "@primer/octicons-react";
import DeleteModal from "../common/DeleteModal";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import NuevoRamo from "./nuevo_ramo"
import EditarRamo from "./editar_ramo"
import Alert_2 from '@material-ui/lab/Alert';

export class lista_ramos extends React.Component {
  constructor(props) {
    super(props);
    this.handle_search = this.handle_search.bind(this);
    this.state = {
      ramos: [],
      showModalDelete: false,
      showModalAdd:false, 
      showModalEdit:false,
      ramoPorEliminar: null,
      ramoPorEditar: null,
      cursosPorEliminar: [],
      MostrarRamos: [],
      search: ""
    };
  }
  
  static propTypes = {
    auth: PropTypes.object.isRequired,
  };

  async fetchRamos() {
    // console.log("Fetching...")
    await fetch(process.env.REACT_APP_API_URL + '/ramos/')
    .then(response => response.json())
    .then(ramos =>
      this.setState({
        ramos: ramos.sort((a, b) => {
          if (a.semestre_malla < b.semestre_malla)
            return -1;
          if (a.semestre_malla > b.semestre_malla)
            return 1;
          return 0;
        }),
        MostrarRamos: ramos
      })
      )    
  }

  async fetchCursosRamo(ramo){
    let semestres = await axios.get(process.env.REACT_APP_API_URL + `/semestres/`)
    let cursos = await axios.get(process.env.REACT_APP_API_URL + `/cursos/?ramo=${ramo.codigo}`)
    cursos.data.map(c => {
      let semestre = semestres.data.find( s => s.id === c.semestre)
      c["periodo"] = semestre.periodo
      c["año"] = semestre.año
      c["nombre"] = ramo.nombre
    })
    return cursos.data
  }

  async componentDidMount() {
    this.fetchRamos();
  }

  handle_search(){
    const busqueda= this.state.search;
    const ramos= this.state.ramos;
    const ramos_buscados= ramos.filter(o=>
      (o.nombre.toString() + " " + o.codigo.toString() + " Semestre " + o.semestre_malla.toString()).includes(busqueda)
    );
    console.log("Buscados");
    this.setState({MostrarRamos: ramos_buscados});
  }

  update_Search(e){
    this.setState({search: e.target.value});
  }

  async handleDelete() {
    let e = this.state.ramoPorEliminar.codigo;
    const url = process.env.REACT_APP_API_URL + `/ramos/${e}/`;
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
          ramoPorEliminar: null
        });
        this.fetchRamos();
      })
      .catch( (err) => {
        console.log(err);
        alert("[ERROR] No se pudo eliminar el ramo! ");
        this.setState({
          showModalDelete: false,
          ramoPorEliminar: null
        });
      });
  }
  showModalAdd() {
    this.setState({ showModalAdd: true});
  }

  async showModalDelete(ramo) {
    let cursos = await this.fetchCursosRamo(ramo)
    this.setState({ 
      showModalDelete: true, 
      ramoPorEliminar: ramo,
      cursosPorEliminar: cursos,
      deleteModalMsg: `¿Está seguro que desea eliminar el ramo: ${ramo.codigo} - ${ramo.nombre} ?`
    });
  }
  showModalEdit(ramo) {
    this.setState({ 
      showModalEdit: true, 
      ramoPorEditar: ramo
    });
  }

  handleCancelDelete() {
    this.setState({ showModalDelete: false, ramoPorEliminar: null, cursosPorEliminar: [] });
  }
  handleCancelAdd(){
    this.setState({ showModalAdd: false});
  }
  handleCancelEdit(){
    this.setState({ showModalEdit: false, ramoPorEliminar: null});
  }
  handleAdd(){
    this.setState({ showModalAdd: false});
    this.fetchRamos();
  }

  handleEdit(){
    this.setState({ showModalEdit: false,ramoPorEditar:null});
    this.fetchRamos();
  }

  render() {
    return (
      <main>
       <Container>
       <NuevoRamo
          show_form={this.state.showModalAdd} 
          handleCancel={() => this.handleCancelAdd()}
          handleAdd={() => this.handleAdd()}
        />

      {this.state.showModalEdit &&
        <EditarRamo
          show_form={this.state.showModalEdit} 
          handleCancel={() => this.handleCancelEdit()}
          handleEdit={() => this.handleEdit()}
          ramo={this.state.ramoPorEditar}
        />}

      <RamoDeleteModal
          msg={this.state.deleteModalMsg}
          show={this.state.showModalDelete}
          cursos={this.state.cursosPorEliminar}
          ramo={this.state.ramoPorEliminar}
          handleCancel={() => this.handleCancelDelete()}
          handleDelete={() => this.handleDelete()}
        />
        <Container>
          <ViewTitle>
          <Link to="/" exact path>
          <OptionButton   icon={ArrowLeft} description="Volver a inicio" /></Link>
          Ramos</ViewTitle>
            <Row className="mb-3">
              <Col md={4}>
                <Form inline className="mr-auto" onSubmit={e => {e.preventDefault(); this.handle_search();}} >
                  <InputGroup
                    value={this.state.search}
                    onChange={e => this.update_Search(e)} >
                    <FormControl type="text" placeholder="Buscar Ramo" className="mr-sm-2" />
                    <Button type="submit">Buscar</Button>
                  </InputGroup>
                </Form>

              </Col>
              <Col>
                  <Button className="btn btn-primary float-right" onClick={() => this.showModalAdd()}>Nuevo Ramo</Button>
              </Col>
            </Row>
            {this.state.MostrarRamos.map(ramo => (
              <RamoItem
                key={ramo.codigo}
                id={ramo.codigo}
                semestre={ramo.semestre_malla}
                codigo={ramo.codigo}
                nombre={ramo.nombre}
                showModalDelete={() => this.showModalDelete(ramo)}
                showModalEdit={() => this.showModalEdit(ramo)}
              />
          ))}

          </Container>
          </Container>
        </main>
      );
    }
  }

  class RamoDeleteModal extends React.Component {
    render() {
      const { show, handleCancel, handleDelete, msg, cursos, ramo} = this.props;
      if(cursos.length <= 0){
        return (
          <DeleteModal
          msg={msg}
          show={show}
          handleCancel={() => handleCancel()}
          handleDelete={() => handleDelete()}
        />
        )
      }
      else{
        return (
          <Modal show={show}  centered onHide={() => handleCancel()}>
            <Modal.Header className="header-delete" closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Confirmación de eliminación
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <label><font color="red">[ADVERTENCIA]</font> Al eliminar el ramo {ramo.codigo} los siguientes cursos asociados seran eliminados: </label>
              {
                cursos.map(c => {
                  return (
                    <Row>
                      <Col xs="1"></Col>
                      <Col> <Alert_2 severity="warning">{c.ramo}-{c.seccion} {c.nombre}  - {c.periodo === 1 ? "Otoño" : "Primavera"} {c.año}</Alert_2> </Col>
                      <Col xs="1"></Col>
                    </Row>)
                })
              }

            </Modal.Body>
            <Modal.Footer >
            <div className="w-100"><label >¿Esta seguro de que desea proceder con la eliminación del ramo?</label></div>
            <div className="w-100" >
              <Button  variant="danger" onClick={() => handleDelete()}>
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
  }

  class RamoItem extends React.Component {

    render() {
      const nombre =this.props.nombre;
      const codigo = this.props.codigo;
      const semestre = this.props.semestre;
      const nombre_semestre= "Semestre "+ semestre
      return (
        <Alert variant="secondary">
            <Row>
              <Col xs="auto">
              <span style={{'fontWeight': "500"}} >{codigo} </span>  {nombre}
              <p>{semestre===15 ? "Electivo" :  nombre_semestre }</p>
              </Col>
              <Col className="text-center"></Col>
              <Col  xs="auto">
                  <OptionButton icon={Pencil} description="Modificar ramo" onClick={() => this.props.showModalEdit()} last={true}/>
                    <span style={{marginRight:'30px'}}></span> 
                  <OptionButton   icon={Trashcan} description="Eliminar ramo"  onClick={() => this.props.showModalDelete()}    last={true}  />
              </Col>
            </Row>
            </Alert>
      );
    }
  }


const mapStateToProps = (state) => ({
  auth: state.auth
});
  
export default connect(mapStateToProps)(lista_ramos);
  