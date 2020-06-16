import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import axios from "axios";
import { connect } from "react-redux";

export class editar_profesor extends React.Component {
    state = {
        id: "",
        nombre: "", 
        apellido: "",
        profesor_modified: false,
    };

    async componentDidMount () {  
        const id  = this.props.match.params.id;
        axios.get(`http://127.0.0.1:8000/api/profesores/${id}/`)
          .then( (res) => { 
            this.setState({
                id: res.data.id,
                nombre: res.data.nombre.split(" ")[0],
                apellido: res.data.nombre.split(" ")[1]
            })
        })
    };
    onChange = e => {
        this.setState({
          [e.target.name]: 
          e.target.value
        })
    };

    handleSubmit = e => {
        e.preventDefault();
        console.log("submit");
        this.update_profesor();
    };
    
    update_profesor() {  
        console.log("post ramo ...")
        console.log(this.state.id)
        
        const url = `http://127.0.0.1:8000/api/profesores/${this.state.id}/`
        let options = {
            method: 'PATCH',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.props.auth.token}`
            },
            data: {
                "nombre": this.state.nombre + " " + this.state.apellido
            }
        }
        
        axios(options)
            .then( (res) => {
                console.log(res);
                console.log("profesor updated");
                this.setState({"profesor_modified": true});
                window.location.href = "/profesores"
            })
            .catch( (err) => {
                console.log(err);
                console.log("cant update profesor");
                alert("No se pudo actualizar el profesor!");
            });
    }
    render() {
        return (
            <div>
                <h4 className="titulo">Editar Profesor</h4>
                    <form className="" name="form" onSubmit={this.handleSubmit}>
                        <div class="generic-form">
                            <div class="row">
                                <div class="col-sm-1"></div>
                                <div class="col-sm-5" >
                                    <div class="row">
                                        <div class="col-sm-2" >
                                            <label >Nombre</label>
                                        </div>
                                        <div class="col-sm-10" >
                                            <input type="text" className="form-control" name="nombre" defaultValue={this.state.nombre} onChange={this.onChange} style={{textAlignLast:'center'}} />
                                        </div>
                                    </div>
                                </div>  

                                <div class="col-sm-5">
                                    <div class="row" style={{justifyContent: 'center'}} >
                                        <div class="col-sm-2" >
                                            <label >Apellido</label>
                                        </div>
                                        <div class="col-sm-10" >
                                        <input type="text" className="form-control" name="apellido" defaultValue={this.state.apellido} onChange={this.onChange} style={{textAlignLast:'center'}}  />
                                        </div>
                                    
                                    </div>
                                </div>
                            </div>                    
                        </div>
                        <div class="form-group" style={{'marginTop':"4rem"}}>
                        <LinkContainer  activeClassName=""  to="/profesores" className="float-left btn btn-primary" style={{width: '7%', 'marginLeft':"10vw",borderRadius: '8px'}}>
                            <button >Volver</button>
                        </LinkContainer>

                            <button className="btn btn-primary"  type="submit">Guardar</button>
                        </div>
                    </form>
            </div>
        );
      } 
}

const mapStateToProps = (state) => ({
    auth: state.auth
}); 

export default connect(mapStateToProps)(editar_profesor);
