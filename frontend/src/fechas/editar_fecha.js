import React from "react";
import {LinkContainer } from "react-router-bootstrap";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';
import {ArrowLeft} from "@primer/octicons-react";
import ViewTitle from "../common/ViewTitle";
import { Link } from "react-router-dom";
import OptionButton from "../common/OptionButton";
import { Container} from "react-bootstrap";


export class editar_fecha extends React.Component {
    static propTypes={
        auth: PropTypes.object.isRequired,
    };

    state={
        id:"",
        nombre_fecha: "",
        tipo_fecha: "",
        inicio_fecha: "",
        fin_fecha:"",
        fecha_modified: false,
    }

    onChange = e => {
        this.setState({
          [e.target.name]: 
          e.target.value
        })
    };

    handleSubmit = e => {
        e.preventDefault();
        console.log("submit");
        this.update_fecha();
    }

    async componentDidMount () {  
        const id  = this.props.match.params.id;
        axios.get(`http://127.0.0.1:8000/api/fechas-especiales/${id}/`)
          .then( (res) => { 
            this.setState({
                id: res.data.id,
                nombre_fecha: res.data.nombre,
                tipo_fecha: res.data.tipo,
                inicio_fecha: res.data.inicio,
                fin_fecha:res.data.fin,
            })
        })
      }

    update_fecha() {  
        console.log("post fecha ...")

        const fecha_fin = this.state.fin_fecha === "" ? this.state.inicio_fecha : this.state.fin_fecha;

        const url = `http://127.0.0.1:8000/api/fechas-especiales/${this.state.id}/`
        let options = {
            method: 'PATCH',
            url: url,
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${this.props.auth.token}`
        },
            data: {
                "nombre": this.state.nombre_fecha,
                "tipo":this.state.tipo_fecha,
                "inicio": this.state.inicio_fecha,
                "fin": fecha_fin,
            }
        }
        
        axios(options)
          .then( (res) => {
            console.log(res);
            console.log("update fecha");
            this.setState({"fecha_modified": true});
          })
          .catch( (err) => {
            console.log(err);
            console.log("cant update fecha");
            alert("No se pudo actualizar fecha!");
          });
      }


    render() {
        if (this.state.fecha_modified) {
            return <Redirect to="/fechas_especiales/" />;
        }
        return (
            <Container>
            <ViewTitle>
            <Link  to="../../"><OptionButton icon={ArrowLeft} description="Volver a fechas" /></Link>Editar fecha</ViewTitle>
                
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
                                            <input type="text" className="form-control" name="nombre_fecha" value={this.state.nombre_fecha} onChange={this.onChange} placeholder="Nombre Feriado" style={{textAlignLast:'center'}} />
                                        </div>
                                    </div>
                                </div>  

                                <div class="col-sm-5" >
                                    <div class="row">
                                        <div class="col-sm-2" >
                                            <label >Tipo</label>
                                        </div>
                    
                                        <div class="col-sm-10" >
                                        {/* No pude centrarlo, hay un problema con prioridades de css de react */}
                                            <select className="form-control center" name="tipo_fecha" onChange={this.onChange} value={this.state.tipo_fecha}  style={{textAlignLast:'center',textAlign:'center'}}  >
                                                <option value="1">Feriado</option>
                                                <option value="2">Vacaciones de Invierno</option>
                                                <option value="3">Semana Olimpica</option>
                                                <option value="4">Semana de Vacaciones</option>
                                                <option value="5">Otro</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                    
                            </div>

                            <div class="row" >
                                <div class="col-md-1" ></div>
                                <div class="col-md-5" >
                                    <div class="row">
                                        <div class="col-md-2" >
                                        <label >Inicio</label>
                                        </div>
                                        <div class="col-md-10" style={{textAlignLast:'center', textAlign:'center'}}>
                                        <input type="date" className="form-control" name="inicio_fecha" onChange={this.onChange} value={this.state.inicio_fecha}   />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-5" >
                                    <div class="row" style={{justifyContent: 'center'}}>
                                        <div class="col-md-2" >
                                            <label >Fin</label>
                                        </div>
                                        <div class="col-md-10" style={{textAlignLast:'center', textAlign:'center'}}>
                                            <input type="date" className="form-control" name="fin_fecha" onChange={this.onChange} value={this.state.fin_fecha}  />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            
                    
                        </div>
                        <div class="form-group" style={{'marginTop':"4rem"}}>
                        <LinkContainer  activeClassName=""  to="/fechas_especiales/" className="float-left " style={{ 'marginLeft':"10vw"}}>
                            <button className="btn btn-secondary" type="button" >Volver</button>
                        </LinkContainer>

                    
                            <button className="btn btn-success" type="submit">Guardar</button>
                        </div>
                    </form>
            </Container>
        );
      } 
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps)(editar_fecha);