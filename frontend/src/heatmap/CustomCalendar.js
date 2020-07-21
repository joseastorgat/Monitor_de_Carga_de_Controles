import React from "react";
import {  Col,  Row,Table,  Container,Modal,Alert} from "react-bootstrap";

import "./Calendar.css";
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import 'moment/locale/es';
import axios from "axios"; //from "axios";
import Sidebar from "./CourseSelector";
import {EvaluacionDiaModal, FechaDiaModal} from "./Calendar"
import SaveCalendarModal from "./SaveCalendar";

const moment = extendMoment(Moment);
moment.locale("es");

export default class CustomCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show_evaluaciones_dia_Modal:false,
      evaluaciones_dia:[],
      found: true,
      nombre_calendario: "",
      semestre_id: -1,
      año: "",
      periodo: "",
      token: this.props.match.params.token,
      inicio: "",
      fin: "",
      courses: [],
      selectedCourses:[],
      evaluaciones: [],
      evaluaciones_a_mostrar: [],
      fechas_especiales:[],
      dias: [],
      dia_mostrar_modal:[],
      dia_mostrar_modal_fecha:[],
      semanas_oficiales_semestre:[],
    }
    this.contador_semanas=0
    this.weeks = [];
    this.handleChange.bind(this);
    this.mostrar_evaluaciones_dia.bind(this);
  }


  handleChange(checks, target) {

    const courses = this.state.courses.slice();
    const evaluaciones = this.state.evaluaciones.slice();
    let evaluaciones_a_mostrar = this.state.evaluaciones_a_mostrar.slice();
    let selected_courses=this.state.selectedCourses
    console.log(this.state.selectedCourses)

    checks.forEach(i => {
      if(courses[i].checked !== target){
        courses[i].checked = target !== undefined ? target : !courses[i].checked;
        if(courses[i].checked){
          const evaluaciones_curso = evaluaciones.filter( evaluacion => evaluacion.curso === courses[i].id);
          evaluaciones_a_mostrar = evaluaciones_a_mostrar.concat(evaluaciones_curso);
          selected_courses.push(courses[i])
        }
        else{
          evaluaciones_a_mostrar = evaluaciones_a_mostrar.filter(evaluacion => evaluacion.curso !== courses[i].id);
          selected_courses = selected_courses.filter(course => course.ramo !== courses[i].ramo);
        }
      }
    });

    const dias = evaluaciones_a_mostrar.map(evaluacion => evaluacion.fecha);

    this.setState({ courses: courses, evaluaciones_a_mostrar: evaluaciones_a_mostrar, dias: dias,selectedCourses:selected_courses});
  }

  async componentDidMount() {
  
    const {token} = this.state;
    let sem
    let res = await axios.get(process.env.REACT_APP_API_URL + `/calendario/${token}/`);
    let selected_courses = []
    // let res = await axios.get(process.env.REACT_APP_API_URL + `/semestres/?año=${año}&periodo=${periodo}`);

    if(res.status !== 200 || !res.data.token === token){
      this.setState( {"found": false });
    }

    else{

      sem = await axios.get(process.env.REACT_APP_API_URL + `/semestres/${res.data.semestre}/`);
      if(res.status !== 200){
        this.setState( {"found": false });
      }
      else{
        this.setState({"inicio": sem.data.inicio, "fin": sem.data.fin,"año": sem.data.año, "periodo": sem.data.periodo, "semestre_id": sem.data.id, "nombre_calendario": res.data.nombre})
        selected_courses = res.data.cursos
      }
    }

    if(this.state.found){
      let semes = await axios.get(process.env.REACT_APP_API_URL + `/semestres/${sem.data.id}/semanas/`);
      this.setState({semanas_oficiales_semestre:semes.data})
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
      // obtener fechas especiales del semestre
      let fechas_especiales = await fetch(
        process.env.REACT_APP_API_URL + `/semestres/${this.state.semestre_id}/fechas_especiales/`
      ).then(res => res.json());

      // obtener cursos del semestre
      let coursesPre = await fetch(
        process.env.REACT_APP_API_URL + `/semestres/${this.state.semestre_id}/cursos/`
      ).then(res => res.json());

      // ordenar los cursos por semestre malla - codigo - seccion
      coursesPre.sort((a, b) => {
        if (a.semestre_malla < b.semestre_malla)
          return -1;
        
        if (a.semestre_malla > b.semestre_malla)
          return 1;
        
        if (a.ramo > b.ramo)
          return 1;
        
        if (a.ramo < b.ramo)
          return -1;

        if (a.seccion < b.seccion)
          return -1;

        return 1;
      })

      

      // obtener evaluaciones del semestre
      const semestre_id = this.state.semestre_id
      const evaluaciones = await fetch(
        process.env.REACT_APP_API_URL + `/semestres/${semestre_id}/evaluaciones/`
      ).then(res => res.json());
      
      let courses = coursesPre.map( (course, i) => 
      (
        { 
          ...course, index: i, 
          checked: selected_courses.some(c => c === course.id) ? true : false
        })
      );
      
      let selected_courses_list = [];
      selected_courses.forEach(i => {
          selected_courses_list.push(coursesPre.filter(c=> c.id==i)[0])
        })

      let evaluaciones_a_mostrar = []
      courses.forEach(c =>{

        const evaluaciones_curso = evaluaciones.filter( evaluacion => evaluacion.curso === c.id && c.checked);
        evaluaciones_a_mostrar = evaluaciones_a_mostrar.concat(evaluaciones_curso);
        }
      )

      this.setState({evaluaciones_a_mostrar: evaluaciones_a_mostrar})
      this.setState({ courses: courses, evaluaciones: evaluaciones,fechas_especiales:fechas_especiales,selectedCourses:selected_courses_list});
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
  mostrar_evaluaciones_dia(evaluaciones_del_dia,fechas_del_dia,dia,dia_n,semana,color){
    this.showModal(evaluaciones_del_dia,fechas_del_dia,dia,dia_n,semana,color)
  }
  mostrar_fechas_dia(fechas_del_dia,dia,dia_n,semana,color){
    this.showModal_fechas(fechas_del_dia,dia,dia_n,semana,color)
  }

  mostrar_guardar_calendario(){
    this.showModal_guardar();
  }
  
  showModal(evaluaciones_del_dia,fechas_del_dia,dia,dia_n,semana,color) {

    this.setState({ show_evaluaciones_dia_Modal: true, evaluaciones_dia: evaluaciones_del_dia, dia_mostrar_modal:[dia,dia_n,semana,color],fechas_dia: fechas_del_dia})
  }
  showModal_fechas(fechas_del_dia,dia,dia_n,semana,color) {
    this.setState({ show_fechas_dia_Modal: true, fechas_dia: fechas_del_dia, dia_mostrar_modal_fecha:[dia,dia_n,semana,color]})
  }
  showModal_guardar(){
    this.setState({ show_guardar_calendario_Modal: true})
  }

  handleCancel() {
    this.setState({ show_evaluaciones_dia_Modal: false,  evaluaciones_dia: [] , dia_mostrar_modal:[], fechas_dia: [] })
  }

  handleCancel_fechas() {
      this.setState({ show_fechas_dia_Modal: false,  fechas_dia: [] , dia_mostrar_modal_fecha:[]})
  }
  handleCancel_guardar() {
    this.setState({ show_guardar_calendario_Modal: false})
}
weeks_semester(week,i){
  var contador=this.contador_semanas
  if(this.state.semanas_oficiales_semestre!=[] && week!=[]){
    if (contador<this.state.semanas_oficiales_semestre.length && week[0]===this.state.semanas_oficiales_semestre[contador].inicio){
      var indice=contador+1
      this.contador_semanas=indice;
      return "S"+indice
    }
    else{
     return ""
    }
  }
}
  render() {
    this.contador_semanas=0
    const { courses } = this.state;
    
    if(!this.state.found){

      return (
        <h1>Calendario no válido </h1> 
      );

    }
    else{
    
    return (
      <Container>
        { this.state.show_evaluaciones_dia_Modal &&
          <EvaluacionDiaModal 
            show={this.state.show_evaluaciones_dia_Modal}
            handleCancel={() => this.handleCancel()}
            evaluaciones={this.state.evaluaciones_dia}
            info={this.state.dia_mostrar_modal}
            fechas={this.state.fechas_dia}
          />
        }
        { this.state.show_fechas_dia_Modal &&
          <FechaDiaModal 
            show={this.state.show_fechas_dia_Modal}
            handleCancel={() => this.handleCancel_fechas()}
            fechas={this.state.fechas_dia}
            info={this.state.dia_mostrar_modal_fecha}
          />
        }
        { this.state.show_guardar_calendario_Modal &&
          <SaveCalendarModal 
            show={this.state.show_guardar_calendario_Modal}
            handleCancel={() => this.handleCancel_guardar()}
            semestre={this.state.semestre_id}
            cursos={this.state.courses}
          />
        }
        <Row >
        
        <Col xs={9} md={3}>
          <Sidebar 
              courses={courses}
              handleChange={(i, t) => this.handleChange(i, t)}
              handleGuardar={() => this.mostrar_guardar_calendario()}
            />
        </Col>
        <Col xs="auto" md={7} >
          <h4 >Calendario: {this.state.nombre_calendario} - {this.state.periodo===1 ? "Otoño": "Primavera"}  {this.state.año} </h4>
          <div style={{textAlign:'center'}} > 
          <Table className="calendar" size="sm" responsive style={{display: 'block',maxHeight:"350px",maxWidth:"800px",overflowY:'scroll'}}>
             <thead>
                <tr>
                <th><h6>Mes</h6></th>
                <th> <h6>Sem</h6> </th>
                <th> <h6>Lun</h6> </th>
                <th> <h6>Mar</h6> </th>
                <th> <h6>Mie </h6></th>
                <th> <h6>Jue</h6> </th>
                <th> <h6>Vie</h6></th>
                <th> <h6>Sáb </h6></th>
                <th>  <h6>Dom</h6> </th>
              </tr>
            </thead>
            <tbody>
            { this.weeks.map( (week, i) => (
              <tr>
              <td className="gris"><h6>{ this.encontrar_mes(week)}</h6></td>
              <td  className="gris">{this.weeks_semester(week)}</td>
                {week.map((day, di ) => {
                    const fechas_del_dia=this.state.fechas_especiales.filter(fecha => (fecha.inicio <= day && fecha.fin >= day ))
                    const hay_fecha= fechas_del_dia.length
                    const evaluaciones_del_dia=this.state.evaluaciones_a_mostrar.filter(evaluacion => evaluacion.fecha === day)
                    const cantidad_evaluaciones_dia= evaluaciones_del_dia.length

                    if(hay_fecha>0 && cantidad_evaluaciones_dia==0){
                      return (<td className="sortable"  key={di} id={day} style={{fontWeight:"600",color: "red"}} onClick={this.mostrar_fechas_dia.bind(this,fechas_del_dia ,day,di,i+1,"#46A5A7")}>{day.split("-")[2] || "\u00a0" }  </td>)
                    }
                   
                    else if(cantidad_evaluaciones_dia===1){
                      return (<td className="sortable"  key={di} id={day} style={{backgroundColor: "#FDBC5F"}}  onClick={this.mostrar_evaluaciones_dia.bind(this, evaluaciones_del_dia,fechas_del_dia,day,di,i+1,"#FDBC5F")}> {day.split("-")[2] || "\u00a0" }  </td>)
                    }
                    else if(cantidad_evaluaciones_dia===2){
                      return (<td className="sortable"  key={di} id={day} style={{backgroundColor: "#F9680A"}} onClick={this.mostrar_evaluaciones_dia.bind(this, evaluaciones_del_dia,fechas_del_dia,day,di, i+1,"#F9680A")}> {day.split("-")[2] || "\u00a0" } </td>)
                    } 
                    else if(cantidad_evaluaciones_dia===3){
                      return (<td className="sortable" key={di} id={day} style={{backgroundColor: "#FF0000"}} onClick={this.mostrar_evaluaciones_dia.bind(this, evaluaciones_del_dia,fechas_del_dia,day,di,i+1,"#FF0000")} > {day.split("-")[2] || "\u00a0" }  </td>)
                    } 
                    else if(cantidad_evaluaciones_dia>3){
                      return (<td  className="sortable" key={di} id={day} style={{backgroundColor: "#800000"}} onClick={this.mostrar_evaluaciones_dia.bind(this, evaluaciones_del_dia,fechas_del_dia,day,di,i+1,"#800000")}> {day.split("-")[2] || "\u00a0" }  </td>)
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
        
            <Alert variant="secondary" >
              <h5>Cursos Seleccionados</h5>
              <ul>{
                console.log(this.state.selectedCourses)
              }
              {this.state.selectedCourses.map( (course, i) => (<li>{course.ramo}-{course.seccion} {course.nombre}</li>))}
              </ul>
            </Alert>
          </Col>
          <Col xs="auto" md={2} lg={2}>
          <Table responsive style={{textAlign:'center'}}> 
              <thead>
              <tr>
              <th style={{background:"#007BFF"}}> Leyenda </th>
              </tr>
              </thead>
              <tbody>
              <tr className="tr_leyenda" >
                <td className="td_leyenda"><div className="cuadrado" style={{background:"#FDBC5F"}}></div> 1 Evaluaciones</td>
              </tr>
              <tr className="tr_leyenda" >
              <td className="td_leyenda"><div className="cuadrado" style={{background:"#F9680A"}}></div>2 Evaluaciones</td>
              </tr>
              <tr className="tr_leyenda" >
              <td className="td_leyenda"><div className="cuadrado" style={{background:"#FF0000"}}></div> 3 Evaluaciones</td>
              </tr>
              <tr className="tr_leyenda" >
              <td className="td_leyenda"> <div className="cuadrado" style={{background:"#800000"}}></div> 4+Evaluaciones</td>
              </tr>
              <tr className="tr_leyenda" >
              <td className="td_leyenda"> <div className="cuadrado" style={{fontWeight:"600",color:"red",textAlign:"center",border:"1px solid #ddd"}}> 23</div> Fecha especial</td>
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