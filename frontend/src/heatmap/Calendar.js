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
    console.log(courses);
    courses.map(course =>
      course.ramo_semestre === nsemester  ? this_courses.push(course) : null
    );
    console.log(this_courses);
    this.setState({ courses: this_courses });
  }

  handleChange() {
    const { handleChange, courses } = this.props;
    this.setState({ checked: !this.state.checked });
    this.state.courses.map(course =>
      handleChange(courses.indexOf(course), !this.state.checked)
    );
  }

  render() {
    const { handleChange, handleAccordion, nsemester, courses } = this.props;
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
                onChange={() => this.handleChange()}
                label={this.getVariant(nsemester)}
              />
            </div>
          </Card.Header>
          
          <Accordion.Collapse eventKey={nsemester}>
            <Card.Body className="card-body-checkbox">
              {this.state.courses.map((course, i) => (
                <SidebarElement
                  key={i}
                  onChange={() => handleChange(courses.indexOf(course))}
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
        
    const range = moment.range('2020-04-27', '2020-07-29');
    this.weeks = [];

    for (let week of range.by('week')) {
      this.weeks.push(week);
    }

    this.weeks = this.weeks.map( (week) =>  {
        let week_format = [];
        for (let i=0; i<7; i++){
          week_format.push(week.weekday(i).format("DD-MM"));
        }
        return week_format;
      })

    this.state = {
      year: 2020,
      semester: 1,
      courses: [],
      groups: []
    };
    this.pathNames = ["Calendario"];

    this.handleChange.bind(this);
  }

  // updateCalendar(){
  //   document.getElementById("30-06").style.backgroundColor = "red";
  // }



  handleChange(i, target) {
    const courses = this.state.courses.slice(); // ver tutorial de react
    courses[i].checked = target !== undefined ? target : !courses[i].checked;
    this.setState({ courses: courses });
    console.log(this.state.courses);
    // this.updateCalendar();
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
    
      const { year, semester } = this.state;
      const coursesPre = await fetch(
        `http://127.0.0.1:8000/api/semestres/${this.state.semester}/cursos/`
      ).then(res => res.json());

      let courses = [];
      for(let course in coursesPre){
        console.log(course);
        const ramo = await fetch(
          `http://127.0.0.1:8000/api/ramos/${coursesPre[course].ramo}/`
        ).then(res => res.json())
        
        // console.log(ramo);
        courses.push({ ...coursesPre[course], checked:false, ramo_nombre:ramo.nombre, ramo_semestre:ramo.semestre_malla });

      }
      // const courses = coursesPre.map(course => ({ ...course, checked: false }));
      console.log(courses);
      var groups = [];
      
      courses.map(course =>
        groups.includes(course.ramo_semestre) ? null : groups.push(course.ramo_semestre)
      );
      groups = groups.map(group => ({ number: group, icon: ChevronRight }));

      console.log(groups);
      this.setState({ courses: courses, groups: groups });

  }

  render() {
    const { courses, groups } = this.state;

    return (
      <Container>

        <Row>
          <Col lg={4}>
            <Sidebar
              groups={groups}
              courses={courses}
              handleChange={(i, t) => this.handleChange(i, t)}
              handleAccordion={i => this.handleAccordion(i)}
            />
          </Col>


          <Col lg={8}>
          <div className="calendar">
            <div className="week">
              <div className="day"> Sem </div>
              <div className="day"> Lun </div>
              <div className="day"> Mar </div>
              <div className="day"> Mie </div>
              <div className="day"> Jue </div>
              <div className="day"> Vie </div>
              <div className="day"> Sab </div>
              <div className="day"> Dom </div>
    
            </div>


            { this.weeks.map( (week, i) => (
              // <div> <h4> Semana {i}</h4>
              
              <div className="week" key={i}>
                <div className="day"> {i+1} </div>
                {  week.map((day, di ) => (
                    <div className="day" key={di} id={day}> {day  || "\u00a0" } </div> )) 
                }
              </div>
            ))
            } 
            
          </div>

            
          </Col>
        </Row>
      </Container>
    );
  }
}

