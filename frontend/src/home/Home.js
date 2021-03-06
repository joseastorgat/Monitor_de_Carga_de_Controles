import React from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "../common/PrivateRoute"
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Header from "./Header";
import {lista_semestres, ver_semestre} from "../semestre/index_semestre";
import {lista_ramos} from "../ramo/index_ramo";
import {lista_fechas} from "../fechas/index_fecha";
import {evaluaciones,lista_evaluaciones} from "../evaluacion/index_evaluacion";
import {lista_profesores} from "../profesor/index_profesor";
import About from "./About";
import Calendar from "../heatmap/Calendar";
import CustomCalendar from "../heatmap/CustomCalendar"
import FooterPage from "./Footer";
import {  Container,Row } from "react-bootstrap";
import ViewTitle from "../common/ViewTitle";

class Bloque_Calendario extends React.Component {
  state = {
    semestres: [],
    MostrarSemestres: [],
  };
  static propTypes = {
    auth: PropTypes.object.isRequired,
  };

  async fetchSemestres() {
    console.log("Fetching...")
    await fetch(process.env.REACT_APP_API_URL + '/semestres/')
    .then(response => response.json())
    .then(semestres =>{
        var sems=semestres.sort((a, b) => {
          if (a.año < b.año)
            return 1;
          if (a.año > b.año)
            return -1;
          if( a.periodo < b.periodo)
            return 1;
          if (a.periodo > b.periodo)
            return -1;

          return 0;
        })
        if (sems.length>5){
            sems=sems.slice(0, 5);
          }

        this.setState({
        semestres:sems ,
        MostrarSemestres: sems,
      })
    }
    )
  }
  async componentDidMount() {
    this.fetchSemestres();
  }
  render() {
    return (
    <main>
      <Container >
      <div>
        <div className="centrar" style={{marginTop:"80px"}}>
        <h2  style={{fontWeight:"600"}}>
      Calendarios disponibles para visualizar
      </h2>
      <Row></Row>
      <Row></Row>
        {this.state.MostrarSemestres.map(semestre=>(
          <Link to={`/calendario/${semestre.año}/${semestre.periodo}/`} >
            <button className="btn btn-dark botones_hacia_abajo" >Calendario Semestre {semestre.año} {semestre.periodo===1 ? "Otoño": "Primavera"}</button>
          </Link>
        ))}
        </div>
      </div>
     </Container>
     </main>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const Bloque_Calendario_con = connect(mapStateToProps)(Bloque_Calendario);

export default class Home extends React.Component {
  render() {
    return (
    <div>
      <Header />
      <div>
        <Switch>
          <Route exact path="/" component={Bloque_Calendario_con} />
          <Route exact path="/calendario/:anho/:periodo/" component={Calendar} />
          <Route exact path="/calendario/:token/" component={CustomCalendar} />

          {/* VISTAS DE SEMESTRE */}
          <PrivateRoute exact path="/semestres/" component={lista_semestres} />
          <PrivateRoute exact path="/semestres/:ano/:semestre/" component={ver_semestre}  />

          {/* VISTAS DE RAMO */}
          <PrivateRoute exact path="/ramos/" component={lista_ramos} />

          {/* VISTAS DE EVALUACION */}
          <PrivateRoute exact path="/semestres/:ano/:semestre/:cod/:seccion/evaluaciones/" component={evaluaciones} />
          <PrivateRoute exact path="/evaluaciones/" component={lista_evaluaciones} />

          {/* VISTAS DE PROFESOR */}
          <PrivateRoute exact path="/profesores/" component={lista_profesores} />

          {/* VISTAS DE FECHAS ESPECIALES */}
          <PrivateRoute exact path="/fechas_especiales/" component={lista_fechas} />

           {/* VISTAS DE ABOUT */}
           <Route exact path="/acerca-de/" component={About} />

        </Switch>
      </div>
      <FooterPage ></FooterPage>
      </div>
    );
  }
}