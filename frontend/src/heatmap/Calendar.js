import React from "react";
import {
  Alert,
  Form,
  Card,
  Accordion,
  Button,
  Col,
  Row,
  Container
} from "react-bootstrap";

import { ChevronRight, ChevronDown } from "@primer/octicons-react";
import Octicon from "@primer/octicons-react";
import "./Calendar.css";

import Moment, { weekdays } from 'moment';
import { extendMoment } from 'moment-range';
import 'moment/locale/es';

import axios from "axios"; //from "axios";
import { evaluaciones } from "../evaluacion/evaluaciones";


const moment = extendMoment(Moment);
moment.locale("es");

// A group inside the sidebar 
class SidebarGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      courses: [],
      checked: false
    };
  }

  getVariant() {
    switch (this.props.nsemester) {
      case 5:
        return "Quinto Semestre";
      case 6:
        return "Sexto Semestre";
      case 7:
        return "Séptimo Semestre";
      case 8:
        return "Octavo Semestre";
      case 9:
        return "Noveno Semestre";
      case 10:
        return "Décimo Semestre";
      case 11:
        return "Undécimo Semestre";
      case 12:
        return "Duodécimo Semestre";
      default:
        return "Otros Cursos";
    }
  }

  componentDidMount() {

    const { nsemester, courses } = this.props;
    const this_courses = [];
    
    courses.map(course =>
      course.ramo_semestre === nsemester  ? this_courses.push(course) : null
    );

    this.setState({ courses: this_courses });
  }

  handleChangeGroup() {
    const { handleChange, courses } = this.props;
    this.setState({ checked: !this.state.checked });
     
    handleChange(this.state.courses.map(course => courses.indexOf(course)), !this.state.checked);

  }

  handleChangeSingle(course_index) {
    
    const { handleChange} = this.props;
    console.log(this.state.courses);

    if(this.state.checked){
      this.setState({ checked: false });
    }
    handleChange([course_index]);
  }

  render() {
    const {handleAccordion, nsemester, courses } = this.props;
    return (
      <div className="accordion-container">
        <Card>
          <Accordion.Toggle
            as={Button}
            variant="primary"
            onClick={() => handleAccordion(nsemester)}
            eventKey={nsemester}
            className="card-header-btn"
          >
            <span className="svg-container">
              <Octicon icon={this.props.icon} size="small" />
            </span>
          </Accordion.Toggle>
          
          <Card.Header bg="light" className="accordion-card-header">
            <div className="card-header-checkbox">
              <Form.Check
                checked={this.state.checked}
                onChange={() => this.handleChangeGroup()}
                label={this.getVariant(nsemester)}
              />
            </div>
          </Card.Header>
          
          <Accordion.Collapse eventKey={nsemester}>
            <Card.Body className="card-body-checkbox">
              {this.state.courses.map((course, i) => (
                <SidebarElement
                  key={i}
                  onChange={() => this.handleChangeSingle(courses.indexOf(course))}
                  title={`${course.ramo}-${course.seccion} ${course.ramo_nombre}`}
                  checked={course.checked}
                />
              ))}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </div>
    );
  }
}

class SidebarElement extends React.Component {
  render() {
    return (
      <Form.Check
        onChange={() => this.props.onChange()}
        checked={this.props.checked}
        label={this.props.title}
      />
    );
  }
}

class Sidebar extends React.Component {
  render() {
    const { courses, handleChange, handleAccordion } = this.props;
    return (
      <Alert variant="primary" className="mb-5">
        <h4>Seleccionar Cursos</h4>
        <Accordion>
          {this.props.groups.map((group, idx) => (
            <SidebarGroup
              key={idx}
              checked={group.checked}
              nsemester={group.number}
              courses={courses}
              handleAccordion={handleAccordion}
              handleChange={handleChange}
              icon={group.icon}
            />
          ))}
        </Accordion>
      </Alert>
    );
  }
}

export default class Calendar extends React.Component {
  constructor(props) {
    
    super(props);
    
    this.state = {
      found: true,
      semestre_id: -1,
      año: this.props.match.params.anho,
      periodo: this.props.match.params.periodo,
      inicio: "",
      fin: "",
      courses: [],
      groups: [],
      evaluaciones: [],
      evaluaciones_a_mostrar: [],
      dias: [],
    }
    
    this.weeks = [];
    this.handleChange.bind(this);
  }


  handleChange(checks, target) {

    const courses = this.state.courses.slice();
    const evaluaciones = this.state.evaluaciones.slice();
    let evaluaciones_a_mostrar = this.state.evaluaciones_a_mostrar.slice();
    console.log(checks);

    checks.forEach(i => {
    
      courses[i].checked = target !== undefined ? target : !courses[i].checked;
  
      if(courses[i].checked){
        console.log(i);
        const evaluaciones_curso = evaluaciones.filter( evaluacion => evaluacion.curso == courses[i].id);
        evaluaciones_a_mostrar = evaluaciones_a_mostrar.concat(evaluaciones_curso);
      }
      else{
        console.log("filtrando curso");
        console.log(i);
        evaluaciones_a_mostrar = evaluaciones_a_mostrar.filter(evaluacion => evaluacion.curso !== courses[i].id);
        console.log(evaluaciones_a_mostrar);
      }

    });

    const dias = evaluaciones_a_mostrar.map(evaluacion => evaluacion.fecha);

    this.setState({ courses: courses, evaluaciones_a_mostrar: evaluaciones_a_mostrar, dias: dias});
  }


  handleAccordion(i) {
    const groups = this.state.groups.map(group =>
      group.number === i
        ? group.icon === ChevronRight
          ? { number: i, icon: ChevronDown }
          : { number: i, icon: ChevronRight }
        : { number: group.number, icon: ChevronRight }
    );
    this.setState({ groups: groups });
  }

  async componentDidMount() {
  
    const {año, periodo} = this.state;
    let res = await axios.get(`http://127.0.0.1:8000/api/semestres/?año=${año}&periodo=${periodo}`);

    if(res.status !== 200 || res.data.length !== 1){
      this.setState( {"found": false });
    }

    else{
      this.setState({"inicio": res.data[0].inicio, "fin": res.data[0].fin, "semestre_id": res.data[0].id})
    }

    if(this.state.found){
      
      // generación de calendario
      const range = moment.range(this.state.inicio, this.state.fin);
      this.weeks = [];

      for (let week of range.by('week')) {
        this.weeks.push(week);
      }

      this.weeks = this.weeks.map( (week) =>  {
          let week_format = [];
          for (let i=0; i<7; i++){
            week_format.push(week.weekday(i).format("YYYY-MM-DD"));
          }
          return week_format;
        })

      const { year, semester } = this.state;
      

      // obtener cursos
      const coursesPre = await fetch(
        `http://127.0.0.1:8000/api/semestres/${this.state.semestre_id}/cursos/`
        ).then(res => res.json());

      // console.log(coursesPre)

      let courses = [];
      

      for(let course in coursesPre){
        // console.log(course);
        const ramo = await fetch(
          `http://127.0.0.1:8000/api/ramos/${coursesPre[course].ramo}/`
        ).then(res => res.json())
        
        // console.log(ramo);
        courses.push({ ...coursesPre[course], checked:false, ramo_nombre:ramo.nombre, ramo_semestre:ramo.semestre_malla });
      }
      courses.sort((a, b) => {
        if (a.ramo_semestre< b.ramo_semestre)
          return -1;
        if (a.ramo_semestre > b.ramo_semestre)
          return 1;
        return 0;
      })
      courses = courses.map(course => ({ ...course, checked: false }));
      var groups = [];
      
      courses.map(course =>
        groups.includes(course.ramo_semestre) ? null : groups.push(course.ramo_semestre)
      );
      groups = groups.map(group => ({ number: group, icon: ChevronRight }));

      console.log(courses);
      console.log(groups);
      
      const evaluaciones = await fetch(
        `http://127.0.0.1:8000/api/evaluaciones/`
      ).then(res => res.json());

      // console.log(evaluaciones);
      this.setState({ courses: courses, groups: groups, evaluaciones: evaluaciones});
    }
  }
  
  encontrar_mes(arreglo_semana){
    let mes=0
    mes=arreglo_semana[arreglo_semana.length-1].split("-")[1]
    if (mes==="01") return "Enero"
    else if (mes==="02") return "Febrero"
    else if (mes==="03") return "Marzo"
    else if (mes==="04") return "Abril"
    else if (mes==="05") return "Mayo"
    else if(mes==="06") return "Junio"
    else if(mes==="07") return "Julio"
    else if(mes==="08") return "Agosto"
    else if(mes==="09") return "Septiembre"
    else if(mes==="10") return "Octubre"
    else if(mes==="11") return "Noviembre"
    else return "Diciembre"
  }

  render() {
    console.log(this.state)
    
    const { courses, groups } = this.state;
    console.log("rendering");
    if(!this.state.found){

      return (
        <h1>Año / Semestre no válido </h1> 
      );

    }
    else{
    
    return (
      <Container>
        <Row >
          <Col lg={3}>
            <Sidebar
              groups={groups}
              courses={courses}
              handleChange={(i, t) => this.handleChange(i, t)}
              handleAccordion={i => this.handleAccordion(i)}
            />
          </Col>

          <Col >
          <div className="calendar">
          <Container >
          <h4 style={{textAlign:'justify'}}>Heatmap Semestre {this.state.año} {this.state.periodo===1 ? "Otoño": "Primavera"} </h4>
          <div style={{display:"flex"}}> 
            <div>
              <div className="week">
                <div className="day-header"> <h6>Mes</h6> </div>
                <div className="day-header"> <h6>Semana</h6> </div>
                <div className="day-header"> <h6>Lunes</h6> </div>
                <div className="day-header"> <h6>Martes</h6> </div>
                <div className="day-header"> <h6>Miércoles </h6></div>
                <div className="day-header"> <h6>Jueves</h6> </div>
                <div className="day-header"> <h6>Viernes</h6> </div>
                <div className="day-header"> <h6>Sábado </h6></div>
                <div className="day-header"> <h6>Domingo</h6> </div>
              </div>
          
            { this.weeks.map( (week, i) => (
              // <div> <h4> Semana {i}</h4>
              
              <div className="week" key={i}>
              <div className="day-header"> <h6>{ this.encontrar_mes(week)}</h6></div>
                <div className="day-header">S{i+1} </div>
      
                {  week.map((day, di ) => {
                    const evaluaciones_del_dia=this.state.evaluaciones_a_mostrar.filter(evaluacion => evaluacion.fecha == day).length
                    if(evaluaciones_del_dia==1){
                      return <div className="day" key={di} id={day} style={{backgroundColor: "#FEFD71"}}> {day.split("-")[2] || "\u00a0" } </div> 
                    }
                    else if(evaluaciones_del_dia==2){
                      return <div className="day" key={di} id={day} style={{backgroundColor: "#FDBC5F"}}> {day.split("-")[2] || "\u00a0" } </div> 
                    } 
                    else if(evaluaciones_del_dia==3){
                      return <div className="day" key={di} id={day} style={{backgroundColor: "#F9680A"}}> {day.split("-")[2] || "\u00a0" } </div> 
                    } 
                    else if(evaluaciones_del_dia==4){
                      return <div className="day" key={di} id={day} style={{backgroundColor: "#FF0000"}}> {day.split("-")[2] || "\u00a0" } </div> 
                    } 
                    else if(evaluaciones_del_dia>4){
                      return <div className="day" key={di} id={day} style={{backgroundColor: "#800000"}}> {day.split("-")[2] || "\u00a0" } </div> 
                    } 

                    /* else if (this.state.dias.indexOf(day)>1){
                      return <div className="day" key={di} id={day} style={{backgroundColor: "green"}}> {day.split("-")[2] || "\u00a0" } {console.log(this.state.evaluaciones_a_mostrar.filter(evaluacion => evaluacion.fecha == day))}</div> 
                    }  */
                    else{
                      return <div className="day" key={di} id={day}> {day.split("-")[2] || "\u00a0" } </div> 
                    }
                
                  })
                }
              </div>
              ))
            } 
          </div>
          <Col className="text-center"></Col>
          <Col className="mb-2 " >
             <table className="leyenda">
              <tr style={{background:"#007BFF"}}>
               <h3> Leyenda</h3>
              </tr>
              <tr style={{display:'flex'}}>
               <span className="espacio" ></span> <span class="cuadrado" style={{background:"#FEFD71"}}></span>1 Evaluacion
              </tr>
              <tr style={{display:'flex'}}>
                <span className="espacio"></span><div class="cuadrado" style={{background:"#FDBC5F"}}></div>2 Evaluaciones
              </tr>
              <tr style={{display:'flex'}}>
                <span className="espacio"></span><div class="cuadrado" style={{background:"#F9680A"}}></div>3 Evaluaciones
              </tr>
              <tr style={{display:'flex'}}>
                <span className="espacio"></span> <div class="cuadrado" style={{background:"#FF0000"}}></div>4 Evaluaciones
              </tr>
              <tr style={{display:'flex'}}>
                <span className="espacio"></span> <div class="cuadrado" style={{background:"#800000"}}></div>Más de 4 Evaluaciones
              </tr>
            </table>
  
            </Col>
          </div>  
          </Container>
          </div>  

          </Col>

        </Row>
      </Container>
    );
  }
}
}

