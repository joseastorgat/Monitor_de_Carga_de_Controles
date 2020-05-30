import React from "react";
import {LinkContainer } from "react-router-bootstrap";

export default class editar_fecha extends React.Component {
    render() {
        return (
            <div>
                <h4 className="titulo">Editar fecha</h4>
                <form className="" name="form">
                        <div class="generic-form">
                            <div class="row">
                                <div class="col-sm-1"></div>
                                <div class="col-sm-5" >
                                    <div class="row">
                                        <div class="col-sm-2" >
                                            <label >Nombre</label>
                                        </div>
                                        <div class="col-sm-10" >
                                            <input type="text" className="form-control" name="nombre_fecha" placeholder="Feriado 1 mayo" style={{textAlignLast:'center'}} />
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
                                            <select className="form-control center" name="tipo_fecha" style={{textAlignLast:'center',textAlign:'center'}}  >
                                                <option value="5">Feriado</option>
                                                <option value="6">Vacaciones de Invierno</option>
                                                <option value="7">Semana Olimpica</option>
                                                <option value="8">Semana de Vacaciones</option>
                                                <option value="8">Otro</option>
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
                                        <input type="date" className="form-control" name="fecha_inicio"  />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-5" >
                                    <div class="row" style={{justifyContent: 'center'}}>
                                        <div class="col-md-2" >
                                            <label >Fin</label>
                                        </div>
                                        <div class="col-md-10" style={{textAlignLast:'center', textAlign:'center'}}>
                                            <input type="date" className="form-control" name="fecha_fin"  />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            
                    
                        </div>
                        <div class="form-group" style={{'marginTop':"4rem"}}>
                        <LinkContainer  activeClassName=""  to="/fechas_especiales" className="float-left " style={{ 'marginLeft':"10vw"}}>
                            <button className="btn btn-primary" >Volver</button>
                        </LinkContainer>

                        <LinkContainer activeClassName=""  to="/fechas_especiales" style={{'marginRight':"14vw"}}>
                            <button className="btn btn-primary" type="submit">Guardar</button>
                        </LinkContainer>
                        </div>
                    </form>
            </div>
        );
      } 
}