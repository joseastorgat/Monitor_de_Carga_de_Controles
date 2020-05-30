import React from "react";
import {   Alert,Button,   Container,   Col,   Row,   Form,   FormControl,   InputGroup } from "react-bootstrap";
import ViewTitle from "../common/ViewTitle";
import { Link } from "react-router-dom";
import OptionButton from "../common/OptionButton";
import { Gear, Trashcan} from "@primer/octicons-react";
import { LinkContainer } from "react-router-bootstrap";

export default class lista_fechas extends React.Component {
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


  async fetchFechas() {
    console.log("Fetching...")
    let fechas = [];
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
      (o.name.toString()+" " + o.codigo.toString() ).includes(busqueda)
    );
    console.log("Buscados")
    console.log(fechas_buscados)
    this.setState({MostrarFechas: fechas_buscados});
  }

  update_Search(e){
    this.setState({search: e.target.value});
  }

  render() {
    return (
      <main>
        <Container>
          <ViewTitle>Feriados</ViewTitle>
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
              inicio={fecha.inicio}
              fin={fecha.fin}
              nombre={fecha.name}
              tipo={fecha.tipo}
              showModal={() => this.showModal(fecha)}
            />
          ))}

          </Container>
          
          <LinkContainer  activeClassName=""  to="/administrar" className="float-left " style={{'marginLeft':"10vw"}}>
            <button className="btn btn-primary" >Volver</button>
          </LinkContainer>
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
      const inicio = this.props.inicio;
      const fin= this.props.fin;
      const tipo=this.props.tipo;
      const id = this.props.id;
      return (
        <Alert variant="secondary">
            <Row>
              <Col xs="auto">
                {inicio} {fin}  {nombre}
              </Col>
              <Col className="text-center"></Col>
              <Col  xs="auto">
                 
                  <Link to={`fechas_especiales/${id}/editar`}>
                  <OptionButton icon={Gear} description="Modificar fecha" />
                  </Link>

                  <OptionButton   icon={Trashcan} description="Eliminar fecha"  onClick={() => alert("No implementado")}    last={true}  />
              </Col>
            </Row>
            </Alert>
      );
    }
  }