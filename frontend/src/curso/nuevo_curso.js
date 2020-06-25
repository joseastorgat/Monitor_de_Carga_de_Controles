import React from "react";
import {LinkContainer } from "react-router-bootstrap";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {ArrowLeft} from "@primer/octicons-react";
import ViewTitle from "../common/ViewTitle";
import { Link } from "react-router-dom";
import OptionButton from "../common/OptionButton";
import { Container} from "react-bootstrap";
import Select from 'react-select'

export class nuevo_curso extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            profesores: [],
            ramos:[],
            ramo:"",
            codigo:"",
            profesores_curso:[],
            seccion:"1",
            MostrarProfesores: [],
            MostrarRamos:[],
            semestre:null,
            curso_created: false
          };
    
        const { ano, semestre } = this.props.match.params;
        this.paths = `/semestres/${ano}/${semestre}/`;
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
        .then(res =>{
          this.setState({
            ramos: res,
            MostrarRamos:res,
            })
            if (res.length>0){
                this.setState({
                codigo:res[0].codigo,
                ramo:res[0].nombre})
            }
        }
          )
      }
      //Colocar un if si no hay ramos
    
    async fetchSemestre() {
        const { ano, semestre } = this.props.match.params;
        const se= (semestre=="Otoño" ? 1 : 2)
        console.log("Fetching Semestre...")
        await fetch(`http://127.0.0.1:8000/api/semestres/?año=${ano}&periodo=${se}`)
        .then(response => response.json())
        .then(semestre =>
          this.setState({
            semestre: semestre,
          }))  
    }

    async componentDidMount() {
        this.fetchProfesores();
        this.fetchRamos();
        this.fetchSemestre();
    }
    
    onChange = e => {
        if (e.target.name=="ramo"){
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
        this.create_curso();
    }

    create_curso() {  
		console.log("post curso ...")
        // No pude encontrar otra forma de sacar el id, hay un problema con el formato del json
        let id="0";
        this.state.semestre.map(semestre => (
            id=semestre.id
        ))
        var profesores=[]
        this.state.profesores_curso.map(profesor => profesores.push(profesor.value))
		const url = "http://127.0.0.1:8000/api/cursos/"
		let options = {
			method: 'POST',
			url: url,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Token ${this.props.auth.token}`
			},
			data: {
				'ramo': this.state.codigo,
                'semestre': id,
                'seccion' : this.state.seccion,
                'profesor': profesores
				}
		}
		
		axios(options)
			.then( (res) => {
				console.log(res);
				console.log("create curso");
				this.setState({"curso_created": true});
				window.location.href=this.paths;
			})
			.catch( (err) => {
				console.log(err);
				console.log("cant create curso");
				alert("No se pudo crear curso!");
			});
	}

    render() {
        const options=this.state.MostrarProfesores.map(profesor => (
            {value:profesor.id,label:profesor.nombre, style: { color: 'red' }}
           ))
        const { ano, semestre } = this.props.match.params;
        const customStyles = {
            control: (base, state) => ({
              ...base,

              '&:hover': {
                borderColor:'#ddd'
              }
            })
          }
        return (
            <Container>
            <ViewTitle>
            <Link  to="../"><OptionButton icon={ArrowLeft} description="Volver a cursos" /></Link>Nuevo curso</ViewTitle>
                    <form className="" name="form" onSubmit={this.handleSubmit}>
                        <div class="generic-form">
                            <div class="row">
                            <div class="col-sm-1"></div>
                                <div class="col-sm-6" >
                                    <div class="row">
                                        <div class="col-sm-2" >
                                            <label >Semestre</label>
                                        </div>
                                        <div class="col-sm-8" >
                                        <input className="form-control" style={{textAlignLast:'center'}}  placeholder={ano+ "-"+ semestre} type="text" readOnly="readonly"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-1"></div>
                                <div class="col-sm-6" >
                                    <div class="row">
                                        <div class="col-sm-2" >
                                            <label >Ramo</label>
                                        </div>
                                        <div class="col-sm-8" >
                                            <select className="form-control center" name="ramo" style={{textAlignLast:'center',textAlign:'center'}} onChange={this.onChange} >
                                                {this.state.MostrarRamos.map(ramos => (
                                                <option value={ramos.codigo}>{ramos.nombre}</option>
                                                ))}
                                            </select>
                                            
                                        </div>
                                    </div>
                                </div>  

                                <div class="col-md-4">
                                    <div class="row" style={{justifyContent: 'center'}} >
                                        <div class="col-md-3" >
                                            <label >Código</label>
                                        </div>
                                        <div class="col-sm-9" >
                                            <input type="text" className="form-control" name="codigo" value={this.state.codigo}  style={{textAlignLast:'center'}} readOnly="readonly"/>
                                        </div>
                                    
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-sm-1"></div>
                                <div class="col-md-6">
                                    <div class="row"  >
                                        <div class="col-md-2" >
                                            <label >Sección</label>
                                        </div>
                                        <div class="col-sm-8" >
                                        <input type="number" required className="form-control" value={this.state.seccion} name="seccion"  min="1" max="10" style={{textAlignLast:'center'}}  onChange={this.onChange} />
                                        </div>
                                    </div>
                                </div>

                                <div class="col-sm-4" >
                                    <div class="row">
                                        <div class="col-sm-3" >
                                            <label >Profesor</label>
                                        </div>
                                        <div class="col-sm-9 " >
                                        <Select placeholder="Selecciona profesor" className="select_profesores"  style={{ color: "red",fontSize:"12px" }}   isMulti options={options} label="Seleccione profesores" value={this.state.profesores_curso} name="profesores_curso" style={{textAlignLast:'center',textAlign:'center'}} onChange={this.onChangeSelected} required />
                                        </div>
                                    </div>
                                </div>  
                            </div>

                        </div>
                        <div class="form-group" style={{'marginTop':"4rem"}}>
                        <LinkContainer  activeClassName=""  to={this.paths} className="float-left " style={{'marginLeft':"10vw"}}>
                            <button className="btn btn-secondary" >Volver a Semestre</button>
                        </LinkContainer>

                        {/* <LinkContainer activeClassName=""  to={this.paths} style={{'marginRight':"14vw"}}> */}
                            <button className="btn btn-success" type="submit">Guardar Curso</button>
                        {/* </LinkContainer> */}
                        </div>
                    </form>
            </Container>
        );
      } 
}
const mapStateToProps = (state) => ({
    auth: state.auth
});
   
export default connect(mapStateToProps)(nuevo_curso);