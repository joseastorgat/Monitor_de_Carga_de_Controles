import React from "react";
import {LinkContainer } from "react-router-bootstrap";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Select from 'react-select';
import { Button,Row,Col,Modal} from "react-bootstrap";


export class editar_curso extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            semestre_año:"",
            semestre_periodo:"",
            profesores: [],
            ramos:[],
            ramo:"",
            codigo:"",
            profesores_curso:[],
            seccion:"1",
            MostrarProfesores: [],
            MostrarRamos:[],
            semestre_id:"",
            id_curso:"",
            curso_update: false,
            sacar_pop_up:this.props.handleEdit
          };
    }

    static propTypes={
        auth: PropTypes.object.isRequired,
    };

    async fetchProfesores() {
        console.log("Fetching Profesores...")
        await fetch(`http://127.0.0.1:8000/api/profesores/`)
        .then(response => response.json())
        .then(profesores =>
          this.setState({
            profesores: profesores,
            MostrarProfesores: profesores
          }))    
      }
      
    async fetchRamos() {
        console.log("Fetching Ramos...")
        await fetch(`http://127.0.0.1:8000/api/ramos/`)
        .then(response => response.json())
        .then(ramos =>
          this.setState({
            ramos: ramos,
            MostrarRamos:ramos
          }))    
      }
    
    async fetchCurso() {
        const { año, periodo ,codigo,seccion} = this.props
        console.log(this.props)
        this.setState({ semestre_año: año, semestre_periodo:periodo})
        await fetch(`http://127.0.0.1:8000/api/cursos/?ramo=${codigo}&seccion=${seccion}&semestre=${año}&periodo=${periodo}` )
        .then( res=> res.json())  
        .then( res => { 
                  this.setState({
                      ramo: res[0].ramo,
                      codigo:res[0].ramo,
                      seccion: res[0].seccion,
                      semestre_id:res[0].semestre,
                      id_curso:res[0].id
                  })
                  let profesores_selected=[]
                  let profesores=res[0].profesor
                  Promise.all(profesores.map(profesor => {
                    fetch(`http://127.0.0.1:8000/api/profesores/${profesor}/` )
                    .then(response=> response.json())
                    .then(response=> 
                        {profesores_selected.push({value:response.id,label:response.nombre})}) 
                  }));   
                  this.setState({profesores_curso:profesores_selected})               
              })
    }

    async componentDidMount() {
        this.fetchProfesores();
        this.fetchRamos();
        this.fetchCurso();          
    }
    
    onChange = e => {
        if (e.target.name==="ramo"){
            this.setState({
                ["codigo"]: 
                e.target.value
            })
        }
        this.setState({
            [e.target.name]: 
            e.target.value
      })
    };

    onChangeSelected = e => {
        this.setState({profesores_curso:e }); 
    }
    
    handleSubmit = e => {
        e.preventDefault();
        console.log("submit");
        this.update_curso();
    }

    update_curso() {  
		console.log("post curso ...")
        console.log(this.state.ramo)
        // No pude encontrar otra forma de sacar el id, hay un problema con el formato del json
        console.log(this.state.seccion)
        console.log(this.state.profesores_curso)
        var profesores=[]
        this.state.profesores_curso.map(profesor => profesores.push(profesor.value))
        console.log("Profes")
        console.log(profesores)
        const url = `http://127.0.0.1:8000/api/cursos/${this.state.id_curso}/`
	    let options = {
			method: 'PATCH',
			url: url,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Token ${this.props.auth.token}`
			},
			data: {
				'ramo': this.state.ramo,
                'semestre': this.state.semestre_id,
                'seccion' : this.state.seccion,
                'profesor': profesores
				}
		}
		
        axios(options)
			.then( (res) => {
				console.log(res);
				console.log("update curso");
                this.setState({"curso_update": true});
                this.state.sacar_pop_up();
			})
			.catch( (err) => {
                console.log(this.state)
				console.log(err);
				console.log("cant update curso");
                alert("No se pudo actualizar curso!");
                this.state.sacar_pop_up();
			});
	}

    render() {
        const options=this.state.MostrarProfesores.map(profesor => (
            {value:profesor.id,label:profesor.nombre}
           ))
        const customControlStyles = base => ({
            ...base,
            fontSize:"15px",
        });
        const { show_form, handleCancel} = this.props;
        
        return (
            <Modal size="lg" centered show={show_form} onHide={() => handleCancel()}>
                <Modal.Header className="header-edit" closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Editar curso
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="" name="form" onSubmit={this.handleSubmit}>
                            <Row>
                                <Col xs="1"></Col>
                                <Col lg={5} >
                                    <Row>
                                        <Col xs={3}>
                                            <label >Semestre</label>
                                        </Col>
                                        <Col lg={9} xs={12}>
                                        <input className="form-control" style={{textAlignLast:'center'}}  placeholder={this.state.semestre_año+ "-"+ this.state.semestre_periodo} type="text" readOnly="readonly"/>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="1"></Col>
                                <Col lg={5} >
                                    <Row>
                                        <Col xs={3}>
                                            <label >Ramo</label>
                                        </Col>
                                        <Col lg={9} xs={12}>
                                            <select  className="form-control center" name="ramo" value={this.state.ramo} style={{textAlignLast:'center',textAlign:'center'}} onChange={this.onChange} >
                                                {this.state.MostrarRamos.map(ramos => (
                                                <option value={ramos.codigo}>{ramos.nombre}</option>
                                                ))}
                                            </select>
                                            
                                        </Col>
                                    </Row>
                                </Col>  

                                <Col lg={5} >
                                    <Row>
                                        <Col xs={3}>
                                            <label >Código</label>
                                        </Col>
                                        <Col lg={9} xs={12}>
                                            <input type="text" className="form-control" name="codigo" value={this.state.codigo}  style={{textAlignLast:'center'}} readOnly="readonly"/>
                                        </Col>
                                    
                                    </Row>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs="1"></Col>
                                <Col lg={5} >
                                    <Row>
                                        <Col xs={3}>
                                            <label >Sección</label>
                                        </Col>
                                        <Col lg={9} xs={12}>
                                        <input type="number" required className="form-control" name="seccion"  value={this.state.seccion} min="1" max="10" style={{textAlignLast:'center'}}  onChange={this.onChange} />
                                        </Col>
                                    </Row>
                                </Col>

                                <Col lg={5} >
                                    <Row>
                                        <Col xs={3}>
                                            <label >Profesor</label>
                                        </Col>
                                        <Col lg={9} xs={12}>
                                            <Select placeholder="Seleccionar profesor" className="select_profesores" styles={{control: customControlStyles}}   isMulti options={options} defaultValue={this.state.profesores_curso} value={this.state.profesores_curso} name="profesores_curso" style={{textAlignLast:'center',textAlign:'center'}} onChange={this.onChangeSelected} />
                                        </Col>
                                    </Row>
                                </Col>  
                            </Row>


                    <Row></Row><Row></Row><Row></Row>
                    <Row>
                        <div className="col-md-6" > </div>
                        <Button variant="success" type="submit">          Actualizar </Button>
                    </Row>
                <Row></Row><Row></Row>
                </form>
        </Modal.Body>
      </Modal>
            
        );
      } 
}
const mapStateToProps = (state) => ({
    auth: state.auth
});
   
export default connect(mapStateToProps)(editar_curso);