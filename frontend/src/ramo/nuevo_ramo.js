import React from "react";
import {LinkContainer } from "react-router-bootstrap";

export default class nuevo_ramo extends React.Component {
    render() {
        return (
            <div>
                <h4 className="titulo">Agregar nuevo ramo</h4>
                    <form className="" name="form">
                        <div class="generic-form">
                            <div class="row">
                                <div class="col-sm-1"></div>
                                <div class="col-sm-6" >
                                    <div class="row">
                                        <div class="col-sm-2" >
                                            <label >Ramo</label>
                                        </div>
                                        <div class="col-sm-9" >
                                            <input type="text" className="form-control" name="nombre_ramo" placeholder="Algoritmo y Estructura de Datos" style={{textAlignLast:'center'}} />
                                        </div>
                                    </div>
                                </div>  

                                <div class="col-md-4">
                                    <div class="row" style={{justifyContent: 'center'}} >
                                        <div class="col-md-3" >
                                            <label >Código</label>
                                        </div>
                                        <div class="col-sm-9" >
                                        <input type="text" className="form-control" name="codigo_ramo" placeholder="CC3001" style={{textAlignLast:'center'}}  />
                                        </div>
                                    
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-sm-1"></div>
                                <div class="col-sm-6" >
                                    <div class="row">
                                        <div class="col-sm-2" >
                                            <label >Semestre</label>
                                        </div>
                                        <div class="col-sm-9" >
                                        {/* No pude centrarlo, hay un problema con prioridades de css de react */}
                                            <select className="form-control center" name="semestre_malla" style={{textAlignLast:'center',textAlign:'center'}}  >
                                                <option value="5">Quinto</option>
                                                <option value="6">Sexto</option>
                                                <option value="7">Séptimo</option>
                                                <option value="8">Octavo</option>
                                                <option value="9">Noveno</option>
                                                <option value="10">Décimo</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>  
                            </div>

                            
                    
                        </div>
                        <div class="form-group" style={{'marginTop':"4rem"}}>
                        <LinkContainer  activeClassName=""  to="/ramos" className="float-left " style={{ 'marginLeft':"10vw"}}>
                            <button className="btn btn-primary" >Volver</button>
                        </LinkContainer>

                        <LinkContainer activeClassName=""  to="/ramos" style={{'marginRight':"14vw"}}>
                            <button className="btn btn-primary" type="submit">Guardar</button>
                        </LinkContainer>
                        </div>
                    </form>
            </div>
        );
      } 
}