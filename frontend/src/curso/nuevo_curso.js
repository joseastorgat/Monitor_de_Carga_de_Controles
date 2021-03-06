import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Select from 'react-select';
import { Button,Row,Col,Modal} from "react-bootstrap";
import Alert_2 from '@material-ui/lab/Alert';

export class nuevo_curso extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            profesores: [],
            ramos:[],
            ramo:"",
            codigo:"",
            profesor:[],
            seccion:"1",
            MostrarProfesores: [],
            MostrarRamos:[],

            form_errors: {},
            errors_checked: {},
                
            semestre:null,
            curso_created: false,
            sacar_pop_up:this.props.handleAdd
          };
    }

    static propTypes={
        auth: PropTypes.object.isRequired,
    };

    async fetchProfesores() {
        console.log("Fetching Profesores...")
        await fetch(process.env.REACT_APP_API_URL + `/profesores/`)
        .then(response => response.json())
        .then(profesores =>
          this.setState({
            profesores: profesores,
            MostrarProfesores: profesores
          }))    
      }
      
    async fetchRamos() {
        console.log("Fetching Ramos...")
        await fetch(process.env.REACT_APP_API_URL + `/ramos/`)
        .then(response => response.json())
        .then(res =>{
          this.setState({
            ramos: res,
            MostrarRamos:res,
            })
            // if (res.length>0){//Setear primero por default, pero ver si existe al menos un ramo creado
            //     this.setState({
            //     codigo:res[0].codigo,
            //     ramo:res[0].nombre})
            // }
        }
          )
      }
    //Colocar un if si no hay ramos
    
    async fetchSemestre() {
        const { año, periodo } = this.props
        const se= (periodo==="Otoño" ? 1 : 2)
        console.log("Fetching Semestre...")
        await fetch(process.env.REACT_APP_API_URL + `/semestres/?año=${año}&periodo=${se}`)
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
        if (e.target.name==="ramo"){
            this.setState({
                codigo: 
                e.target.value
            })
        }
        let errors_checked = this.state.errors_checked
        let form_errors = this.state.form_errors
        errors_checked[e.target.name] = false
        form_errors[e.target.name] = ""
        this.setState({
        [e.target.name]: e.target.value,
        errors_checked: errors_checked,
        form_errors: form_errors
        })
    };

    onChangeSelected = e => {
        this.setState({profesor:e }); 
    }
    handleSubmit = e => {
        e.preventDefault();
        console.log("submit");
        this.create_curso();
    }

    validateForm(){
        let errores = {}
        let isValid = true
        let ramo = this.state.ramo
        let seccion = this.state.seccion
        let profesores = this.state.profesor
        let errors_checked = {
            ramo: true,
            profesores: true,
            seccion: true
        }

        if(ramo === ""){
            errores["ramo"] = "Debe seleccionar un ramo"
            isValid = false
        }

        else if(!this.state.ramos.some(e => e.codigo === ramo)){
            errores["ramo"]= "Ramo seleccionado no válido"
            isValid = false
        }
        // if(profesores === null || profesores === "" || profesores.length <= 0){
        //     errores["profesores_curso"] = "Debe seleccionar al menos un profesor"
        //     isValid = false
        // }
        if(profesores !== null && profesores !== "" && profesores.length > 0){
            profesores.forEach(p => {
                if(!this.state.profesores.some(e => e.id === p.value)){
                    errores["profesor"] = "Profesor seleccionado no válido"
                    isValid = false
                }
            })
        }
        if(seccion == ""){
            errores["seccion"] = "Debe ingresar una sección"
            isValid = false
        }
        if(isNaN(parseInt(seccion))){
            errores["seccion"] ="La sección debe ser un número entero"
            isValid = false
        }
        else{
            if(parseInt(seccion) % 1 != 0){
                errores["seccion"] ="La sección debe ser un número entero"
                isValid = false
            }
            else if(parseInt(seccion) <= 0){
                errores["seccion"] ="La sección debe ser un número entero positivo"
                isValid = false
            }
        }
        this.setState({
            form_errors: errores,
            errors_checked: errors_checked
        })
        return isValid

    }
    create_curso() {  
        console.log("post curso ...")
        if(!this.validateForm()){
            return;
        }
        // No pude encontrar otra forma de sacar el id, hay un problema con el formato del json
        let id="0";
        this.state.semestre.map(semestre => (
            id=semestre.id
        ))
        var profesores=[]
        let profesor = this.state.profesor ? this.state.profesor : []
        profesor.map(profesor => profesores.push(profesor.value))
        if (profesores==[]){
            profesores=null
        }
		const url = process.env.REACT_APP_API_URL + "/cursos/"
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
                this.setState(
                {   
                    "curso_created": true,
                    "form_errors": {},
                    "errors_checked": {},
                    ramo:"",
                    codigo:"",
                    profesor:[],
                    seccion:"1"
                });
                this.state.sacar_pop_up();
			})
			.catch( (err) => {
				console.log(err);
				console.log("cant create curso");
                let errors = this.state.form_errors
                for (let [key, value] of Object.entries(err.response.data)){
                    if(Array.isArray(err.response.data[key]))
                        errors[key] = value[0]
                    else if(typeof(err.response.data[key] === "string"))
                        errors[key] = value
                }
                this.setState({
                    form_errors:errors
                })
			});
	}

    render() {
        const options=this.state.MostrarProfesores.map(profesor => (
            {value:profesor.id,label:profesor.nombre, style: { color: 'red' }}
           ))
        const { año, periodo} = this.props
        const { show_form, handleCancel} = this.props;
        let resetState = () => {
			this.setState({
				ramos:[],
                ramo:"",
                codigo:"",
                profesor:[],
                seccion:"1",
				form_errors: {},
				errors_checked: {},
			  })
        }
        const campos = ["ramo", "seccion", "profesor"]
        return (
            <Modal size="lg" centered show={show_form} onHide={() => {handleCancel(); resetState()}}>
            <Modal.Header className="header-add" closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Nuevo Curso
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                { 
                Object.keys(this.state.form_errors).map(k => {
                if(!(campos.includes(k))){
                    return (
                    <Alert_2  severity="error">{this.state.form_errors[k]}</Alert_2>
                    )
                }
                })
                }
                    <form className="" name="form" onSubmit={this.handleSubmit}>
                            <Row>
                                <Col xs="1"></Col>
                                <Col lg={5} >
                                    <Row>
                                        <Col xs={3}>
                                            <label >Semestre</label>
                                        </Col>
                                        <Col lg={9} xs={12}>
                                        <input className="form-control" style={{textAlignLast:'center'}}  placeholder={año+ "-"+ periodo} type="text" readOnly="readonly"/>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="1"></Col>
                                <Col lg={5} >
                                    <Row>
                                        <Col xs={3}>
                                            <label >Ramo<span style={{color:"red"}}>*</span></label>
                                        </Col>
                                        <Col lg={8} xs={11}>
                                            <select className={this.state.form_errors["ramo"] ? "form-control center is-invalid" : this.state.errors_checked["ramo"] ? "form-control center is-valid" : "form-control center"} name="ramo" style={{textAlignLast:'center',textAlign:'center'}} onChange={this.onChange} >
                                                <option disabled="disabled" selected="selected" hidden>Seleccione Ramo</option>
                                                {this.state.MostrarRamos.map(ramos => (
                                                <option  value={ramos.codigo}>{ramos.nombre}</option>
                                                ))}
                                            </select>
                                            <span style={{color: "red", fontSize:"14px"}}>{this.state.form_errors["ramo"]}</span>
                                            
                                        </Col>
                                    </Row>
                                </Col>  

                                <Col lg={5} >
                                    <Row>
                                        <Col xs={3}>
                                            <label >Código</label>
                                        </Col>
                                        <Col lg={9} xs={12}>
                                            <input type="text" className={this.state.form_errors["codigo"] ? "form-control is-invalid" : this.state.errors_checked["codigo"] ? "form-control is-valid" : "form-control"} name="codigo" value={this.state.codigo}  style={{textAlignLast:'center'}} readOnly="readonly"/>
                                            <span style={{color: "red", fontSize:"14px"}}>{this.state.form_errors["codigo"]}</span>
                                        </Col>
                                    
                                    </Row>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs="1"></Col>
                                <Col lg={5} >
                                    <Row>
                                        <Col xs={3}>
                                            <label >Sección<span style={{color:"red"}}>*</span></label>
                                        </Col>
                                        <Col lg={8} xs={11}>
                                            <input type="number" className={this.state.form_errors["seccion"] ? "form-control is-invalid" : this.state.errors_checked["seccion"] ? "form-control is-valid" : "form-control"} value={this.state.seccion} name="seccion"  min="1" max="10" style={{textAlignLast:'center'}}  onChange={this.onChange} />
                                            <span style={{color: "red", fontSize:"14px"}}>{this.state.form_errors["seccion"]}</span>
                                        </Col>
                                    </Row>
                                </Col>

                                <Col lg={5} >
                                    <Row>
                                        <Col xs={3}>
                                            <label >Profesor</label>
                                        </Col>
                                        <Col lg={9} xs={12}>
                                        <Select placeholder="Selecciona profesor" className={this.state.form_errors["profesor"] ? "select_profesores is-invalid" : this.state.errors_checked["profesor"] ? "select_profesores is-valid" : "select_profesores"}  style={{ color: "red",fontSize:"12px", textAlignLast:'center', textAlign:'center' }}   isMulti options={options} label="Seleccione profesores" value={this.state.profesor} name="profesor" onChange={this.onChangeSelected}/>
                                        <span style={{color: "red", fontSize:"14px"}}>{this.state.form_errors["profesor"]}</span>
                                        </Col>
                                    </Row>
                                </Col>  
                            </Row>
                        <Row></Row><Row></Row><Row></Row>
                    <Row>
                    <div className="col-md-6" > </div>
                  <Button variant="success"  type="submit"> Agregar </Button> </Row>
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
   
export default connect(mapStateToProps)(nuevo_curso);