import React from "react";
import {   Alert,Button,   Container,   Col,   Row,   Form,   FormControl,   InputGroup } from "react-bootstrap";
import ViewTitle from "../common/ViewTitle";
import { Link } from "react-router-dom";
import OptionButton from "../common/OptionButton";
import { Pencil, Trashcan} from "@primer/octicons-react";
import { LinkContainer } from "react-router-bootstrap";
import DeleteModal from "../common/DeleteModal";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";

export class lista_fechas extends React.Component {
  constructor(props) {
    super(props);
    this.handle_search = this.handle_search.bind(this);
    this.state = {
      fechas: [],
      showModal: false,
      fechaPorEliminar: null,
      MostrarFechas: [],
      search: ""
    };

    this.deleteModalMsg = `¿Está seguro que desea eliminar la fecha?`;
  }

  static propTypes = {
    auth: PropTypes.object.isRequired,
  };


  async fetchFechas() {
    console.log("Fetching...")
    await fetch(`http://127.0.0.1:8000/api/fechas-especiales/`)
    .then(response => response.json())
    .then(fechas =>
      this.setState({
        fechas: fechas,
        MostrarFechas: fechas
      })
      )    
    console.log(this.state.fechas)
  }

  async componentDidMount() {
    this.fetchFechas();
  }

  handle_search(){
    const busqueda= this.state.search;
    const fechas= this.state.fechas;
    const fechas_buscados= fechas.filter(o=>
      (o.nombre.toString()+" " + o.tipo.toString() ).includes(busqueda)
    );
    console.log("Buscados")
    console.log(fechas_buscados)
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
          showModal: false,
          fechaPorEliminar: null
        });
        this.fetchFechas();
      })
      .catch( (err) => {
        console.log(err);
        alert("[ERROR] No se pudo eliminar la fecha! ");
        this.setState({
          showModal: false,
          fechaPorEliminar: null
        });
      });
  }

  showModal(fecha) {
    this.setState({ showModal: true, fechaPorEliminar: fecha });
  }

  handleCancel() {
    this.setState({ showModal: false, fechaPorEliminar: null });
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
          <ViewTitle>Fechas Especiales</ViewTitle>
            <Row className="mb-3">
              <Col>

                <Form inline className="mr-auto" onSubmit={e => {e.preventDefault(); this.handle_search();}} >
                  <InputGroup
                    value={this.state.search}
                    onChange={e => this.update_Search(e)} >
                    <FormControl type="text" placeholder="Buscar Fecha" className="mr-sm-2" />
                    <Button type="submit">Buscar</Button>
                  </InputGroup>
                </Form>

              </Col>
              <Col xs="auto">
                <Link to="/fechas_especiales/nueva_fecha">
                  <Button className="btn btn-primary">Nueva Fecha</Button>
                </Link>
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
              showModal={() => this.showModal(fecha)}
            />
          ))}

          </Container>
          
          <LinkContainer  activeClassName=""  to="/administrar" >
            <button className="btn btn-secondary" >Volver a Administrar</button>
          </LinkContainer>
          </Container>
        </main>
      );
    }
  }


  class FechaItem extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      const nombre =this.props.nombre;
      const fec_i=this.props.inicio.split("-")
      const inicio= fec_i[2]+"-"+fec_i[1]+"-"+fec_i[0]
      const fec_f=this.props.fin.split("-")
      const fin= fec_f[2]+"-"+fec_f[1]+"-"+fec_f[0]
      const id = this.props.id;
      return (
        <Alert variant="secondary">
            <Row>
              <Col xs="auto">
              <h6> {nombre}  </h6> 
               <p > <span style={{'font-weight': "500"}} >Inicio: </span>{inicio} <span style={{'font-weight': "500"}}>   Fin: </span>{fin} </p>
              </Col>
              <Col className="text-center"></Col>
              <Col  xs="auto">
                 
                  <Link to={`/fechas_especiales/${id}/editar`}>
                  <OptionButton icon={Pencil} description="Modificar fecha" />
                  </Link>

                  <OptionButton
                  icon={Trashcan}
                  description="Eliminar fecha"
                  onClick={() => this.props.showModal()} 
                  last={true} 
                  />
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