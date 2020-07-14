import React from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios"; //from "axios";
export default  class SaveCalendarModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nombre: "",
            cursos: this.props.cursos.filter(c => c.checked),
            semestre: this.props.semestre,
            form_errors: {},
            errors_checked: {},

            calendario_created: false
        }
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

    render() {
        
      const { show, handleCancel, handleGuardar} = this.props;
      const divStyle = {
        backgroundColor: "blue",
        color:"white"
      };
      return (
        <Modal transparent={true} size="x" centered show={show} onHide={() => handleCancel()} className="modal_calendar">
          <Modal.Header style={divStyle} className="header-add" closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              <h6>Guardar Calendario</h6>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
                <div class="col-sm-6" >
                    <label >Nombre <font color="red">*</font> </label>
                </div>
                <div class="col-sm-9" >
                    <input type="text" className="form-control" name="nombre" onChange={this.onChange} style={{textAlignLast:'center'}} />
                </div>

                <div class="col-sm-6" >
                    <label> (<font color="red">*</font>) No ingresar nombre generará un nombre aleatorio para el calendario </label>
                </div>
          
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