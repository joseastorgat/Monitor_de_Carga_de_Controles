import React from "react";
import {
  Alert,
  Form,
  Card,
  Accordion,
  Button,
  Col,
  Row,Table,
  Container,Modal
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
      <Alert variant="secondary" >
        <h4>Seleccione Cursos</h4>
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
      <Row></Row><Row></Row>
      <Row></Row>
       <Row className="justify-content-md-center"> 
        <Button >Guardar Calendario</Button>
        </Row>
      </Alert>
    );
  }
}

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show_evaluaciones_dia_Modal:false,
      evaluaciones_dia:[],
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
      dia_mostrar_modal:[]
    }
    
    this.weeks = [];
    this.handleChange.bind(this);
    this.mostrar_evaluaciones_dia.bind(this);
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
      const semestre_id=this.state.semestre_id
      console.log(courses);
      console.log(groups);
      console.log(courses)
      const evaluaciones = await fetch(
        `http://127.0.0.1:8000/api/semestres/${semestre_id}/evaluaciones/`
      ).then(res => res.json());

      // console.log(evaluaciones);
      this.setState({ courses: courses, groups: groups, evaluaciones: evaluaciones});
    }
  }
  
  encontrar_mes(arreglo_semana){
    let mes=0
    mes=arreglo_semana[arreglo_semana.length-1].split("-")[1]
    if (mes==="01") return "Ene"
    else if (mes==="02") return "Feb"
    else if (mes==="03") return "Mar"
    else if (mes==="04") return "Abr"
    else if (mes==="05") return "May"
    else if(mes==="06") return "Jun"
    else if(mes==="07") return "Jul"
    else if(mes==="08") return "Ago"
    else if(mes==="09") return "Sep"
    else if(mes==="10") return "Oct"
    else if(mes==="11") return "Nov"
    else return "Dic"
  }
  mostrar_evaluaciones_dia(evaluaciones_del_dia,dia,semana,color){
    this.showModal(evaluaciones_del_dia,dia,semana,color)
  }
  
  showModal(evaluaciones_del_dia,dia,semana,color) {
    this.setState({ show_evaluaciones_dia_Modal: true, evaluaciones_dia: evaluaciones_del_dia, dia_mostrar_modal:[dia,semana,color]})
  }

  handleCancel() {
    this.setState({ show_evaluaciones_dia_Modal: false,  evaluaciones_dia: [] , dia_mostrar_modal:[]})
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
        <Evaluacion_dia_Modal 
          show={this.state.show_evaluaciones_dia_Modal}
          handleCancel={() => this.handleCancel()}
          evaluaciones={this.state.evaluaciones_dia}
          info={this.state.dia_mostrar_modal}
        />
        <Row >
        <Col xs={3}>
            <Sidebar xs={3}
              groups={groups}
              courses={courses}
              handleChange={(i, t) => this.handleChange(i, t)}
              handleAccordion={i => this.handleAccordion(i)}
            />
        </Col>
        <Col  style={{textAlign:'center'}} >
          <h4 >Heatmap Semestre {this.state.periodo==1 ? "Otoño": "Primavera"}  {this.state.año} </h4>
          <div > 
          <Table size="sm" responsive >
             <thead>
                <tr>
                <th><h6>Mes</h6></th>
                <th> <h6>Semana</h6> </th>
                <th> <h6>Lunes</h6> </th>
                <th> <h6>Martes</h6> </th>
                <th> <h6>Miércoles </h6></th>
                <th> <h6>Jueves</h6> </th>
                <th> <h6>Viernes</h6></th>
                <th> <h6>Sábado </h6></th>
                <th>  <h6>Domingo</h6> </th>
              </tr>
            </thead>
            <tbody>
            { this.weeks.map( (week, i) => (
              <tr>
              <th><h6>{ this.encontrar_mes(week)}</h6></th>
              <th>S{i+1}</th>
                {week.map((day, di ) => {
                    const evaluaciones_del_dia=this.state.evaluaciones_a_mostrar.filter(evaluacion => evaluacion.fecha == day)
                    const cantidad_evaluaciones_dia= evaluaciones_del_dia.length
                    if(cantidad_evaluaciones_dia==1){
                      return (<td class="sortable" style={{backgroundColor: "#F9680A"}}  onClick={this.mostrar_evaluaciones_dia.bind(this, evaluaciones_del_dia,day,i+1,"#F9680A")}> {day.split("-")[2] || "\u00a0" }  </td>)
                    }
                    else if(cantidad_evaluaciones_dia==2){
                      return (<td class="sortable"  key={di} id={day} style={{backgroundColor: "#F9680A"}} onClick={this.mostrar_evaluaciones_dia.bind(this, evaluaciones_del_dia,day,i+1,"#F9680A")}> {day.split("-")[2] || "\u00a0" } </td>)
                    } 
                    else if(cantidad_evaluaciones_dia==3){
                      return (<td class="sortable" key={di} id={day} style={{backgroundColor: "#FF0000"}} onClick={this.mostrar_evaluaciones_dia.bind(this, evaluaciones_del_dia,day,i+1,"#FF0000")} > {day.split("-")[2] || "\u00a0" }  </td>)
                    } 
                    else if(cantidad_evaluaciones_dia>3){
                      return (<td  class="sortable" key={di} id={day} style={{backgroundColor: "#800000"}} onClick={this.mostrar_evaluaciones_dia.bind(this, evaluaciones_del_dia,day,i+1,"#800000")}> {day.split("-")[2] || "\u00a0" }  </td>)
                    } 
                    else{
                      return <td key={di} id={day}> {day.split("-")[2] || "\u00a0" } </td>
                    }
                
                  })
                }
                </tr>
              ))
            } 
            </tbody>
          </Table>
          </div>  
          </Col>
          <Col xs="auto" >
          <Table responsive className="leyenda" size="sm" style={{textAlign:'center'}}> 
              <thead>
              <th style={{background:"#007BFF"}}> Leyenda </th>
              </thead>
              <tbody>
              <tr style={{display:'flex'}}>
                <span className="espacio"></span><div class="cuadrado" style={{background:"#FDBC5F"}}></div>1 Evaluaciones
              </tr>
              <tr style={{display:'flex'}}>
                <span className="espacio"></span><div class="cuadrado" style={{background:"#F9680A"}}></div>2 Evaluaciones
              </tr>
              <tr style={{display:'flex'}}>
                <span className="espacio"></span> <div class="cuadrado" style={{background:"#FF0000"}}></div>3 Evaluaciones
              </tr>
              <tr style={{display:'flex'}}>
                <span className="espacio"></span> <div class="cuadrado" style={{background:"#800000"}}></div>Más de 3 Evaluaciones
              </tr>
              </tbody>
            </Table>
            </Col>
        </Row>
      </Container>
    );
  }
}
}


export class Evaluacion_dia_Modal extends React.Component {
  render() {
    const { show, handleCancel, evaluaciones,info} = this.props;
    const semana=info[1];
    const color=info[2];
    const divStyle = {
      backgroundColor: color,
      color:"white"
  };
    const fecha=info[0];

  // PROBLEMAS ACA
    // alert(fecha)
    // console.log(fecha)
    // var date = new Date(fecha[0],fecha[1],fecha[2]);
    var dias = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
    var meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  
    return (
      <Modal size="sm" centered show={show} onHide={() => handleCancel()}>
        <Modal.Header style={divStyle} closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h6>Semana {semana}: {fecha}</h6>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {evaluaciones.map(evaluacion=>
          <Row>
          <Container>
            <h6>{evaluacion.codigo}-{evaluacion.nombre_curso}</h6>
            <div>{evaluacion.titulo} {evaluacion.tipo}</div>
          </Container>
        </Row>
        )}
        
        </Modal.Body>

      </Modal>
    );
  }
}