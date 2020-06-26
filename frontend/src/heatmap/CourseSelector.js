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
          return "Electivos";
      }
    }
  
    componentDidMount() {
  
      const { nsemester, courses } = this.props;
      const this_courses = [];
      
      courses.map(course =>
        course.semestre_malla === nsemester  ? this_courses.push(course) : null
      );
  
      this.setState({ courses: this_courses });
    }
  
    handleCheckGroup() {
      const { handleChange, courses } = this.props;
      const check = this.state.checked;
      this.setState({ checked: !check });
      handleChange(this.state.courses.map(course => courses.indexOf(course)), !check);
  
    }
  
    handleCheckSingle(course_index) {      
      const { handleChange} = this.props;
  
      if(this.state.checked){
        this.setState({ checked: false });
      }
  
      handleChange([course_index]);
    }

    componentDidUpdate(){
        let all_selected = true;
        
        this.state.courses.forEach( (course) => {
            all_selected = all_selected && (course.checked);
        })

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
                  onChange={() => this.handleCheckGroup()}
                  label={this.getVariant(nsemester)}
                />
              </div>
            </Card.Header>
            
            <Accordion.Collapse eventKey={nsemester}>
              <Card.Body className="card-body-checkbox">
                {this.state.courses.map((course, i) => (
                  <SidebarElement
                    key={i}
                    onChange={() => this.handleCheckSingle(courses.indexOf(course))}
                    title={`${course.ramo}-${course.seccion} ${course.nombre}`}
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
  
export default class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            groups: this.props.groups
        }
        this.handleAccordion = this.handleAccordion.bind(this);
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

    render() {
      const { courses, handleChange} = this.props;
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
                handleAccordion={this.handleAccordion}
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
  