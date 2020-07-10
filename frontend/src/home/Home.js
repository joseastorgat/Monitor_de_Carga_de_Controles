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
import Calendar from "../heatmap/Calendar";
import FooterPage from "./Footer";
import {  Container } from "react-bootstrap";

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
    await fetch(`http://127.0.0.1:8000/api/semestres/`)
    .then(response => response.json())
    .then(semestres =>
        this.setState({
        semestres: semestres.sort((a, b) => {
          if (a.año < b.año)
            return 1;
          if (a.año > b.año)
            return -1;
          if( a.periodo < b.periodo)
            return 1;
          if (a.periodo > b.periodo)
            return -1;

          return 0;
        }),
        MostrarSemestres: semestres,
      })
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
        <div className="centrar" style={{marginTop:"130px"}}>
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

        </Switch>
      </div>
      <FooterPage ></FooterPage>
      </div>
    );
  }
}