import React from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "../common/PrivateRoute"
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { BsGearFill} from 'react-icons/bs';
import { Link } from "react-router-dom";
import administrar from "./Administrar";
import Header from "./Header";
import {nuevo_semestre , lista_semestres,editar_semestre, ver_semestre} from "../semestre/index_semestre";
import {nuevo_curso , ver_curso, editar_curso} from "../curso/index_curso";
import {nuevo_ramo ,editar_ramo, lista_ramos} from "../ramo/index_ramo";
import {nuevo_fecha,editar_fecha, lista_fechas} from "../fechas/index_fecha";
import {evaluaciones} from "../evaluacion/index_evaluacion";
import {nuevo_profesor, editar_profesor, lista_profesores} from "../profesor/index_profesor";
import Calendar from "../heatmap/Calendar";
import { Button } from "react-bootstrap";
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
    var semestres= await fetch(`http://127.0.0.1:8000/api/semestres/`)
    .then(response => response.json())
    .then(semestres =>
        this.setState({
        semestres: semestres.sort((a, b) => {
          if (a.año < b.año)
            return -1;
          if (a.año > b.año)
            return 1;
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
    const { user, logout } = this.props;
    const { isAuthenticated} = this.props.auth;
    const n =  new Date();
    const y = n.getFullYear();
    return (
    <main>
      <Container >
      <div>
        <div className="centrar">
            <h2 className="titulo">Monitor de Carga de Controles</h2>
            <p style={{marginTop: '46px',fontSize:'20px'}}>Bienvenido</p>
        </div>
        <div className="centrar">
        {this.state.MostrarSemestres.map(semestre=>(
          <Link to={`/calendar/${semestre.año}/${semestre.periodo}`} >
            <button className="btn btn-secondary botones_hacia_abajo" >Calendario Semestre {semestre.año} {semestre.periodo===1 ? "Otoño": "Primavera"}</button>
          </Link>
        ))}
          {/* <Link to="/calendar/2019/1/" >
            <button className="rectangulo_azul" >Ver Semestre Otoño 2020</button>
          </Link>
          <Link to="/calendar/2019/2/" >
            <button className="rectangulo_azul" >Ver Semestre Otoño 2020</button>
          </Link> */}
          {/* {isAuthenticated ? authLinks: '' } */}
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
          <Route exact path="/calendar/:anho/:periodo" component={Calendar} />

          {/* VISTAS DE ADMINISTRAR */}
          <PrivateRoute exact path="/administrar" component={administrar} />

          {/* VISTAS DE SEMESTRE */}
          <PrivateRoute exact path="/semestres" component={lista_semestres} />
          <PrivateRoute exact path="/semestres/nuevo_semestre" component={nuevo_semestre} />
          <PrivateRoute exact path="/semestres/:ano/:semestre" component={ver_semestre}  />
          <PrivateRoute exact path="/semestres/:ano/:semestre/editar" component={editar_semestre} />

          {/* VISTAS DE CURSO */}
          <PrivateRoute exact path="/semestres/:ano/:semestre/nuevo_curso" component={nuevo_curso} />
          <PrivateRoute exact path="/semestres/:ano/:semestre/:cod/:seccion" component={ver_curso} />
          <PrivateRoute exact  path="/semestres/:ano/:semestre/:cod/:seccion/editar"  component={editar_curso}  />

          {/* VISTAS DE RAMO */}
          <PrivateRoute exact path="/ramos" component={lista_ramos} />
          <PrivateRoute exact path="/ramos/nuevo_ramo" component={nuevo_ramo} />
          <PrivateRoute exact path="/ramos/:id/editar" component={editar_ramo} />

          {/* VISTAS DE EVALUACION */}
          <Route exact path="/semestres/:ano/:semestre/:cod/:seccion/evaluaciones" component={evaluaciones} />

          {/* VISTAS DE PROFESOR */}
          <Route exact path="/profesores" component={lista_profesores} />
          <Route exact path="/profesores/nuevo_profesor" component={nuevo_profesor} />
          <Route exact path="/profesores/:id/editar" component={editar_profesor} />

          {/* VISTAS DE FECHAS ESPECIALES */}
          <PrivateRoute exact path="/fechas_especiales" component={lista_fechas} />
          <PrivateRoute exact path="/fechas_especiales/nueva_fecha" component={nuevo_fecha} />
          <PrivateRoute exact path="/fechas_especiales/:id/editar" component={editar_fecha} />

        </Switch>
      </div>
      <FooterPage ></FooterPage>
      </div>
    );
  }
}