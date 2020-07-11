import React from "react";
import {   Alert,Button,   Container,   Col,   Row,   Form,   FormControl,   InputGroup,Gir } from "react-bootstrap";
import ViewTitle from "../common/ViewTitle";
import { Link } from "react-router-dom";
import OptionButton from "../common/OptionButton";
import { Pencil, Trashcan,ArrowLeft} from "@primer/octicons-react";
import DeleteModal from "../common/DeleteModal";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import NuevaFecha from "./nueva_fecha"
import EditarFecha from "./editar_fecha"

export class lista_fechas extends React.Component {
  constructor(props) {
    super(props);
    this.handle_search = this.handle_search.bind(this);
    this.state = {
      fechas: [],
      showModalDelete: false,
      showModalAdd: false,
      showModalEdit: false,
      fechaPorEliminar: null,
      fechaPorEditar: null,
      MostrarFechas: [],
      search: "",
    };
  }

  static propTypes = {
    auth: PropTypes.object.isRequired,
  };


  async fetchFechas() {
    console.log("Fetching...")
    await fetch(`http://127.0.0.1:8000/api/fechas-especiales/`)
    .then(response => response.json())
    .then(fechas =>{
      this.setState({
        fechas: fechas.sort((a, b) => {
          if (a.inicio < b.inicio)
            return -1;
          if (a.inicio > b.inicio)
            return 1;
          return 0;
        }),
        MostrarFechas: fechas
      })
    })
  }

  async componentDidMount() {
    this.fetchFechas();
  }

  handle_search(){
    const busqueda= this.state.search;
    const fechas= this.state.fechas;
    const fechas_buscados= fechas.filter(o=>
      (o.nombre.toString().toLowerCase() +" " + o.tipo.toString().toLowerCase() + " "+ o.inicio.toString().toLowerCase() + " "+ o.fin.toString().toLowerCase() ).includes(busqueda.toLowerCase())
    );
    this.setState({MostrarFechas: fechas_buscados});
  }

  update_Search(e){
    this.setState({search: e.target.value});
  }

  async handleDelete() {
    let e = this.state.fechaPorEliminar.id
    const url = `http://127.0.0.1:8000/api/fechas-especiales/${e}/`
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
          fechaPorEliminar: null
        });
        this.fetchFechas();
      })
      .catch( (err) => {
        console.log(err);
        alert("[ERROR] No se pudo eliminar la fecha! ");
        this.setState({
          showModalDelete: false,
          fechaPorEliminar: null
        });
      });
  }

  showModalAdd() {
    this.setState({ showModalAdd: true});
  }

  showModalDelete(fecha) {
    this.setState({ 
      showModalDelete: true, 
      fechaPorEliminar: fecha,
      deleteModalMsg: `¿Está seguro que desea eliminar la fecha: ${fecha.nombre}?`
    });
  }

  showModalEdit(fecha) {
    this.setState({ 
      showModalEdit: true, 
      fechaPorEditar: fecha,
    });
  }

  handleCancelDelete() {
    this.setState({ showModalDelete: false, fechaPorEliminar: null });
  }

  handleCancelAdd(){
    this.setState({ showModalAdd: false});
  }

  handleCancelEdit() {
    this.setState({ showModalEdit: false, fechaPorEditar: null });
  }
  handleAdd(){
    this.setState({ showModalAdd: false});
    this.fetchFechas();
  }
  handleEdit(){
    this.setState({ showModalEdit: false,fechaPorEditar:null});
    this.fetchFechas();
  }

  render() {
    return (
      <main>
      <Container fixed>
      <NuevaFecha
          show_form={this.state.showModalAdd} 
          handleCancel={() => this.handleCancelAdd()}
          handleAdd={() => this.handleAdd()}
        />

      {this.state.showModalEdit &&
        <EditarFecha
          show_form={this.state.showModalEdit} 
          handleCancel={() => this.handleCancelEdit()}
          handleEdit={() => this.handleEdit()}
          fecha={this.state.fechaPorEditar}
        />}

      <DeleteModal
          msg={this.state.deleteModalMsg}
          show={this.state.showModalDelete}
          handleCancel={() => this.handleCancelDelete()}
          handleDelete={() => this.handleDelete()}
        />
        <Container>
          <ViewTitle>
          <Link to="/">
          <OptionButton   icon={ArrowLeft} description="Volver a inicio" /></Link>
          Fechas Especiales</ViewTitle>
            <Row className="mb-3">
              <Col  md={4}>
                <Form inline className="mr-auto" onSubmit={e => {e.preventDefault(); this.handle_search();}} >
                  <InputGroup
                    value={this.state.search}
                    onChange={e => this.update_Search(e)} >
                    <FormControl type="text" placeholder="Buscar Fecha" className="mr-sm-2" />
                    <Button type="submit">Buscar</Button>
                  </InputGroup>
                </Form>

              </Col>
              <Col>
                  <Button className="btn btn-primary float-right" onClick={() => this.showModalAdd()}>Nueva Fecha</Button>
              </Col>
            </Row>
            {this.state.MostrarFechas.map(fecha => (
            <FechaItem
              key={fecha.id}
              id={fecha.id}
              inicio={fecha.inicio}
              fin={fecha.fin}
              nombre={fecha.nombre}
              tipo={fecha.tipo}
              showModalDelete={() => this.showModalDelete(fecha)}
              showModalEdit={() => this.showModalEdit(fecha)}
            />
          ))}

          </Container>
          
          </Container>
        </main>
      );
    }
  }


  class FechaItem extends React.Component {

    render() {
      const nombre =this.props.nombre;
      const fec_i=this.props.inicio.split("-")
      const inicio= fec_i[2]+"-"+fec_i[1]+"-"+fec_i[0]
      const fec_f=this.props.fin.split("-")
      const fin= fec_f[2]+"-"+fec_f[1]+"-"+fec_f[0]
      // const id = this.props.id;
      return (
        <Alert variant="secondary">
            <Row>
              <Col xs="auto">
              <h6> {nombre}  </h6> 
               <p > <span style={{'fontWeight': "500"}} >Inicio: </span>{inicio} <span style={{'fontWeight': "500"}}>   Fin: </span>{fin} </p>
              </Col>
              <Col className="text-center"></Col>
              <Col xs="auto">
                 
                  <OptionButton icon={Pencil} description="Modificar fecha"  onClick={() => this.props.showModalEdit()} last={true} />
                  <span style={{marginRight:'30px'}}></span> 
                  <OptionButton icon={Trashcan} description="Eliminar fecha" onClick={() => this.props.showModalDelete()} last={true} />
              </Col>
            </Row>
            </Alert>
      );
    }
  }

const mapStateToProps = (state) => ({
    auth: state.auth
  });
    
export default connect(mapStateToProps)(lista_fechas);