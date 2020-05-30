import React from "react";
import {   Alert,Button,   Container,   Col,   Row,   Form,   FormControl,   InputGroup } from "react-bootstrap";
import ViewTitle from "../common/ViewTitle";
import { Link } from "react-router-dom";
import OptionButton from "../common/OptionButton";
import { Gear, Trashcan} from "@primer/octicons-react";
import { LinkContainer } from "react-router-bootstrap";

export default class lista_ramos extends React.Component {
  constructor(props) {
    super(props);
    this.handle_search = this.handle_search.bind(this);
    this.state = {
      ramos: [],
      showModal: false,
      ramoPorEliminar: null,
      MostrarRamos: [],
      search: ""
    };

    this.deleteModalMsg = `¿Está seguro que desea eliminar el ramo?`;
  }


  async fetchRamos() {
    console.log("Fetching...")
    let ramos = [];
    await fetch(`http://127.0.0.1:8000/api/ramos/`)
    .then(response => response.json())
    .then(ramos =>
      this.setState({
        ramos: ramos,
        MostrarRamos: ramos
      })
      )    
    console.log(this.state.ramos)
  }

  async componentDidMount() {
    this.fetchRamos();
  }

  handle_search(){
    const busqueda= this.state.search;
    const ramos= this.state.ramos;
    const ramos_buscados= ramos.filter(o=>
      (o.name.toString()+" " + o.codigo.toString() ).includes(busqueda)
    );
    console.log("Buscados")
    console.log(ramos_buscados)
    this.setState({MostrarRamos: ramos_buscados});
  }

  update_Search(e){
    this.setState({search: e.target.value});
  }

  render() {
    return (
      <main>
        <Container>
          <ViewTitle>Ramos</ViewTitle>
            <Row className="mb-3">
              <Col>

                <Form inline className="mr-auto" onSubmit={e => {e.preventDefault(); this.handle_search();}} >
                  <InputGroup
                    value={this.state.search}
                    onChange={e => this.update_Search(e)} >
                    <FormControl type="text" placeholder="Buscar Ramo" className="mr-sm-2" />
                    <Button type="submit">Buscar</Button>
                  </InputGroup>
                </Form>

              </Col>
              <Col xs="auto">
                <Link to="/ramos/nuevo_ramo">
                  <Button className="btn btn-primary">Nuevo Ramo</Button>
                </Link>
              </Col>
            </Row>
            {this.state.MostrarRamos.map(ramo => (
            <RamoItem
              key={ramo.id}
              semestre={ramo.semestre_malla}
              codigo={ramo.codigo}
              nombre={ramo.name}
              codigo_antiguo={ramo.codigo_antiguo}
              showModal={() => this.showModal(ramo)}
            />
          ))}

          </Container>
          
          <LinkContainer  activeClassName=""  to="/administrar" className="float-left " style={{width: '7%', 'marginLeft':"10vw",borderRadius: '8px'}}>
            <button >Volver</button>
          </LinkContainer>
        </main>
      );
    }
  }


  class RamoItem extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      const nombre =this.props.nombre;
      const codigo = this.props.codigo;
      const semestre= this.props.semestre;
      const id = this.props.id;
      return (
        <Alert variant="secondary">
            <Row>
              <Col xs="auto">
                {codigo}   {nombre}
              </Col>
              <Col className="text-center"></Col>
              <Col  xs="auto">
                 
                  <Link to={`ramos/${id}/editar`}>
                  <OptionButton icon={Gear} description="Modificar ramo" />
                  </Link>

                  <OptionButton   icon={Trashcan} description="Eliminar ramo"  onClick={() => alert("No implementado")}    last={true}  />
              </Col>
            </Row>
            </Alert>
      );
    }
  }