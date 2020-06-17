import React from "react";
import {LinkContainer } from "react-router-bootstrap";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';

export class nueva_fecha extends React.Component {

    static propTypes={
        auth: PropTypes.object.isRequired,
    };

    state={
        nombre_fecha: "",
        tipo_fecha: "1",
        inicio_fecha: "",
        fin_fecha:"",
        fecha_created: false,
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
        this.create_fecha();
    }

    create_fecha() {  
        console.log("post fecha ...")
        const url = "http://127.0.0.1:8000/api/fechas-especiales/"
        let options = {
          method: 'POST',
          url: url,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${this.props.auth.token}`
        },
          data: {
            "nombre": this.state.nombre_fecha,
            "tipo":this.state.tipo_fecha,
            "inicio": this.state.inicio_fecha,
            "fin": this.state.fin_fecha
           }
        }
        
        axios(options)
          .then( (res) => {
            console.log(res);
            console.log("create fecha");
            this.setState({"fecha_created": true});
          })
          .catch( (err) => {
            console.log(err);
            console.log("cant create fecha");
            alert("No se pudo crear fecha!");
          });
      }

    render() {
        if (this.state.fecha_created) {
            return <Redirect to="/fechas_especiales/" />;
        }
        return (
            <div>
                <h4 className="titulo">Agregar nueva fecha</h4>
                    <form className="" name="form" onSubmit={this.handleSubmit} >
                        <div class="generic-form">
                            <div className="row">
                                <div className="col-sm-1"></div>
                                <div className="col-sm-5" >
                                    <div className="row">
                                        <div className="col-sm-2" >
                                            <label >Nombre</label>
                                        </div>
                                        <div className="col-sm-10" >
                                            <input required type="text" className="form-control" name="nombre_fecha" onChange={this.onChange} placeholder="Feriado 1 mayo" style={{textAlignLast:'center'}} />
                                        </div>
                                    </div>
                                </div>  

                                <div class="col-sm-5" >
                                    <div class="row">
                                        <div class="col-sm-2" >
                                            <label >Tipo</label>
                                        </div>
                    
                                        <div class="col-sm-10 centrado" >
                                        {/* No pude centrarlo, hay un problema con prioridades de css de react */}
                                            <select className="form-control"  onChange={this.onChange} name="tipo_fecha" style={{textAlignLast:'center',textAlign:'center'}}  >
                                                <option value="1" selected>Feriado</option>
                                                <option value="2">Vacaciones de Invierno</option>
                                                <option value="3">Semana Olimpica</option>
                                                <option value="4">Semana de Vacaciones</option>
                                                <option value="5">Otros</option>
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
                                            <input required type="date" onChange={this.onChange} className="form-control" name="inicio_fecha"  required pattern="[0-9]{2}-[0-9]{2}-[0-9]{4}"/>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-5" >
                                    <div class="row" style={{justifyContent: 'center'}}>
                                        <div class="col-md-2" >
                                            <label >Fin</label>
                                        </div>
                                        <div class="col-md-10" style={{textAlignLast:'center', textAlign:'center'}}>
                                            <input type="date" onChange={this.onChange} className="form-control" name="fin_fecha"  />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            
                    
                        </div>
                        <div class="form-group" style={{'marginTop':"4rem"}}>
                        <LinkContainer  activeClassName=""  to="/fechas_especiales" className="float-left " style={{ 'marginLeft':"10vw"}}>
                            <button className="btn btn-primary" >Volver a Fechas</button>
                        </LinkContainer>

                        {/* <LinkContainer activeClassName=""  to="/fechas_especiales" style={{'marginRight':"14vw"}}> */}
                            <button className="btn btn-primary" type="submit">Guardar Fecha</button>
                        {/* </LinkContainer> */}
                        </div>
                    </form>
            </div>
        );
      } 
}
const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps)(nueva_fecha);