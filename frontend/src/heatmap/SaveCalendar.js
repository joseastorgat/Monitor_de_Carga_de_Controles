import React from "react";
import { Button,Row,Col,Modal} from "react-bootstrap";
import OptionButton from "../common/OptionButton";
import axios from "axios"; //from "axios";
import { Clippy} from "@primer/octicons-react";
export default  class SaveCalendarModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nombre: "",
            token: "",
            cursos: this.props.cursos.filter(c => c.checked),
            semestre: this.props.semestre,
            form_errors: {},
            errors_checked: {},
            coppied: false,

            calendario_created: false
        }
        // this.url = React.createRef()
        // this.button = React.createRef()
    }

    onChange = e => {
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

    handleGuardar = () => {
        console.log("post calendario ...")
        if(this.state.cursos.length === 0){
          return 
        }
        // if(!this.validateForm()){
        //     return;
        // }
        const url = process.env.REACT_APP_API_URL + "/calendario/auto_token/"
        let cursos = []
        this.state.cursos.map(c => cursos.push(c.id))
		let options = {
			method: 'POST',
			url: url,
			headers: {
		
				'Content-Type': 'application/json',
				// 'Authorization': `Token ${this.props.auth.token}`
			},
			data: {
				"nombre": this.state.nombre,
                // "semestre": this.state.semestre,
                "cursos": cursos
				}
        }
        console.log(options.data)
		axios(options)
			.then( (res) => {
				console.log(res);
				console.log("create calendario");
				this.setState({"calendario_created": true});
                this.setState({
                    nombre: "",
                    calendario_created: true,
                    token: res.data.token,
                    cursos: [],
                    form_errors: {},
                    errors_checked: {},

                })
			})
			.catch( (err) => {
				console.log(err);
				console.log("cant create calendar");
				alert("No se pudo crear el calendario!");
                this.setState({
                    nombre: "",
                    cursos: [],
                    form_errors: {},
                    errors_checked: {},

                })
		});
  };
  
  copyText = () =>{
    if(!this.state.coppied){
      var aux = document.createElement("input");
      aux.setAttribute("value", window.location.origin + "/calendario/" + this.state.token + "/");
      document.body.appendChild(aux);
      aux.select();
      document.execCommand("copy");
      document.body.removeChild(aux);
      
      this.setState({
        coppied: true
      })
    }
    

  }

    render() {
      const { show, handleCancel, handleGuardar} = this.props;
      const divStyle = {
        backgroundColor: "blue",
        color:"white"
      };
      return (
        <Modal transparent={true} size="" centered show={show} onHide={() => handleCancel()} >
          <Modal.Header  className="header-add" closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Guardar Calendario
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
              {
                this.state.calendario_created && !this.state.already_created &&
                <label> <span style={{color:"green", fontSize:"13px"}}>¡Calendario creado exitosamente!</span> </label>
              }
              {
                this.state.cursos.length === 0 && !this.state.calendario_created &&
                <label> <span style={{color:"red", fontSize:"13px"}}>Se debe seleccionar al menos un curso para guardar el calendario</span> </label>
              }
              <Row>
                <Col xs="auto">
                    <label >Nombre <span style={{color:"red"}}>*</span> </label>
                </Col>
                <Col lg={8} xs={12}>
                    <input type="text" className="form-control" name="nombre" onChange={this.onChange} style={{textAlignLast:'center'}} />
                </Col>
              </Row>

                {this.state.calendario_created &&
                <Row>
                    <Col xs={2}>
                        <label >Url </label>
                    </Col>
                    <Col lg={8} xs={12}>
                        <input type="text"  className="form-control" value={window.location.origin + "/calendario/" + this.state.token + "/"} name="url" onChange={this.onChange} style={{textAlignLast:'center'}} readOnly="readOnly"/>
                    </Col>
                    <Col lg={1} ><OptionButton icon={Clippy} description={this.state.coppied ? "Copiado!!": "Copiar"} onClick={() => this.copyText()} last={true}  /></Col>
  
                </Row>
                }

          </Modal.Body>
          <Modal.Footer>
            <div class="w-100" >
            <Button variant="success" onClick={() => this.handleGuardar()}>
                Guardar
            </Button>
            <Button variant="secondary" className="float-right" onClick={() => handleCancel()}>
                Cancelar
            </Button>
            </div>
            </Modal.Footer>
        </Modal>
       );
    }
  }