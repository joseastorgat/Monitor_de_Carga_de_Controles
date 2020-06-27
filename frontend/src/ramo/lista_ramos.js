import React from "react";
import {   Alert,Button, Modal,  Container,   Col,   Row,   Form,   FormControl,   InputGroup } from "react-bootstrap";
import ViewTitle from "../common/ViewTitle";
import { Link } from "react-router-dom";
import OptionButton from "../common/OptionButton";
import { Pencil, Trashcan,ArrowLeft} from "@primer/octicons-react";
import { LinkContainer } from "react-router-bootstrap";
import DeleteModal from "../common/DeleteModal";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Nuevo_ramo from "./nuevo_ramo"

export class lista_ramos extends React.Component {
  constructor(props) {
    super(props);
    this.handle_search = this.handle_search.bind(this);
    this.state = {
      ramos: [],
      showModal: false,
      showModalAdd:false, 
      sacar_pop_up:null,
      ramoPorEliminar: null,
      MostrarRamos: [],
      search: "",
      deleteModalMsg: `¿Está seguro que desea eliminar el ramo?`
    };
  }
  
  static propTypes = {
    auth: PropTypes.object.isRequired,
  };

  async fetchRamos() {
    // console.log("Fetching...")
    await fetch(`http://127.0.0.1:8000/api/ramos/`)
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
    // console.log(this.state.ramos)
  }

  async componentDidMount() {
    this.fetchRamos();
  }

  handle_search(){
    const busqueda= this.state.search;
    const ramos= this.state.ramos;
    const ramos_buscados= ramos.filter(o=>
      (o.nombre.toString()+" " + o.codigo.toString()+" "+ "Semestre "+o.semestre_malla.toString() ).includes(busqueda)
    );
    console.log("Buscados")
    console.log(ramos_buscados)
    this.setState({MostrarRamos: ramos_buscados});
  }

  update_Search(e){
    this.setState({search: e.target.value});
  }

  async handleDelete() {
    let e = this.state.ramoPorEliminar.codigo
    console.log(e)
    const url = `http://127.0.0.1:8000/api/ramos/${e}/`
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
          ramoPorEliminar: null
        });
        this.fetchRamos();
      })
      .catch( (err) => {
        console.log(err);
        alert("[ERROR] No se pudo eliminar la fecha! ");
        this.setState({
          showModal: false,
          ramoPorEliminar: null
        });
      });
  }
  showModalAdd() {
    this.setState({ showModalAdd: true});
  }

  showModal(ramo) {
    this.setState({ 
      showModal: true, 
      ramoPorEliminar: ramo,
      deleteModalMsg: `¿Está seguro que desea eliminar el ramo: ${ramo.codigo} - ${ramo.nombre} ?`

    });
  }

  handleCancel() {
    this.setState({ showModal: false, ramoPorEliminar: null });
  }
  handleCancelAdd(){
    this.setState({ showModalAdd: false});
  }
  handleAdd(){
    this.setState({ showModalAdd: false});
    this.fetchRamos();
  }

  render() {
    return (
      <main>
       <Container>
       <Nuevo_ramo
          show_form={this.state.showModalAdd} 
          handleCancel={() => this.handleCancelAdd()}
          handleAdd={() => this.handleAdd()}
        />

      <DeleteModal
          msg={this.state.deleteModalMsg}
          show={this.state.showModal}
          handleCancel={() => this.handleCancel()}
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
<<<<<<< HEAD
              <Col xs="auto">
                {/* <Link to="/ramos/nuevo_ramo"> */}
                  <Button className="btn btn-primary" onClick={() => this.showModalAdd()}>Nuevo Ramo</Button>
                {/* </Link> */}
=======
              <Col >
                <Link to="/ramos/nuevo_ramo/">
                  <Button className="btn btn-primary float-right">Nuevo Ramo</Button>
                </Link>
>>>>>>> master_actualizado
              </Col>
            </Row>
            {this.state.MostrarRamos.map(ramo => (
              <RamoItem
                key={ramo.codigo}
                id={ramo.codigo}
                semestre={ramo.semestre_malla}
                codigo={ramo.codigo}
                nombre={ramo.nombre}
                showModal={() => this.showModal(ramo)}
              />
          ))}

          </Container>
<<<<<<< HEAD
=======
          
>>>>>>> master_actualizado
          </Container>
        </main>
      );
    }
  }


  class RamoItem extends React.Component {

    render() {
      const nombre =this.props.nombre;
      const codigo = this.props.codigo;
      const semestre = this.props.semestre;
      const nombre_semestre= "Semestre "+ semestre
      const id = this.props.id;
      return (
        <Alert variant="secondary">
            <Row>
              <Col xs="auto">
              <span style={{'font-weight': "500"}} >{codigo} </span>  {nombre}
              <p>{semestre==15 ? "Electivo" :  nombre_semestre }</p>
              </Col>
              <Col className="text-center"></Col>
              <Col  xs="auto">
                 
                  <Link to={`/ramos/${id}/editar/`}>
                    <OptionButton icon={Pencil} description="Modificar ramo" />
                  </Link>

                  <OptionButton   icon={Trashcan} description="Eliminar ramo"  onClick={() => this.props.showModal()}    last={true}  />
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
  