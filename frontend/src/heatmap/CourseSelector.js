import React from "react";
import {
  Alert,
  Form,
  Card,
  Accordion,
  Button,
  Row
} from "react-bootstrap";

import { ChevronRight, ChevronDown } from "@primer/octicons-react";
import Octicon from "@primer/octicons-react";
import "./Calendar.css";

// Element (course) inside SidebarGroup
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
  
// A group inside the Sidebar 
class SidebarGroup extends React.Component {
    constructor(props) {
      super(props);
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
  
    handleCheckGroup() {
      const { handleChange, courses, checked } = this.props;
      handleChange(courses.map(course => course.index), !checked)
    }
  
    handleCheckSingle(course_index) {
      const { handleChange} = this.props;  
      handleChange([course_index]);
    }
  
    render() {
        const {handleAccordion, nsemester, courses, checked } = this.props;
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
                  checked={checked}
                  onChange={() => this.handleCheckGroup()}
                  label={this.getVariant(nsemester)}
                />
              </div>
            </Card.Header>
            
            <Accordion.Collapse eventKey={nsemester}>
              <Card.Body className="card-body-checkbox">
                {courses.map((course, i) => (
                  <SidebarElement
                    key={i}
                    onChange={() => this.handleCheckSingle(course.index)}
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
  
export default class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        
        let groups = [5, 6, 7, 8, 9, 10, 15];
        groups = groups.map(group => ({ number: group, icon: ChevronRight }));

        this.state = {
            groups: groups
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
            {this.state.groups.map((group, idx) => {
              const group_courses = courses.filter(c => c.semestre_malla === group.number);
              
              return <SidebarGroup 
                key={idx}
                nsemester={group.number}
                courses={group_courses}
                checked={group_courses.reduce( (acc, course) => acc && course.checked , group_courses.length > 0)}
                handleAccordion={this.handleAccordion}
                handleChange={handleChange}
                icon={group.icon}
              />
            })}
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
  