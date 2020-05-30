import React from "react";
import {LinkContainer } from "react-router-bootstrap";

export default class nuevo_curso extends React.Component {
    constructor(props) {
        super(props);

    const { ano, semestre } = this.props.match.params;
    this.paths = `/semestres/${ano}/${semestre}`;
}

    render() {
        return (
            <div>
                <h4 className="titulo">Agregar nuevo curso</h4>
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
                                            <input type="text" className="form-control" name="nombre_curso" placeholder="Algoritmo y Estructura de Datos" style={{textAlignLast:'center'}} />
                                        </div>
                                    </div>
                                </div>  

                                <div class="col-md-4">
                                    <div class="row" style={{justifyContent: 'center'}} >
                                        <div class="col-md-2" >
                                            <label >Código</label>
                                        </div>
                                        <div class="col-sm-10" >
                                        <input type="text" className="form-control" name="codigo_curso" placeholder="CC3001" style={{textAlignLast:'center'}}  />
                                        </div>
                                    
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-sm-1"></div>
                                <div class="col-md-6">
                                    <div class="row" style={{justifyContent: 'center'}} >
                                        <div class="col-md-2" >
                                            <label >Sección</label>
                                        </div>
                                        <div class="col-sm-9" >
                                        <input type="text" className="form-control" name="codigo_ramo" placeholder="CC3001" style={{textAlignLast:'center'}}  />
                                        </div>
                                    
                                    </div>
                                </div>

                                <div class="col-sm-4" >
                                    <div class="row">
                                        <div class="col-sm-2" >
                                            <label >Profesor</label>
                                        </div>
                                        <div class="col-sm-10" >
                                        {/* No pude centrarlo, hay un problema con prioridades de css de react */}
                                            <select className="form-control center" name="profesor" style={{textAlignLast:'center',textAlign:'center'}}  >
                                                <option value="5">Jeremy Barbay</option>
                                                <option value="6">Nelson Baloian</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>  
                            </div>

                            <div class="row">
                                <div class="col-sm-1"></div>
                                <div class="col-md-6">
                                    <div class="row" style={{justifyContent: 'center'}} >
                                        <div class="col-md-2" >
                                            <label >Descripción</label>
                                        </div>
                                        <div class="col-sm-9" >
                                        <textarea type="text"  rows="8" class="noresize form-control" name="descripcion_curso" placeholder="" style={{textAlignLast:'center'}}  />
                                        </div>
                                    
                                    </div>
                                </div>
                                </div>


                            
                    
                        </div>
                        <div class="form-group" style={{'marginTop':"4rem"}}>
                        <LinkContainer  activeClassName=""  to={this.paths} className="float-left " style={{width: '7%', 'marginLeft':"10vw",borderRadius: '8px'}}>
                            <button >Volver</button>
                        </LinkContainer>

                        <LinkContainer activeClassName=""  to={this.paths} style={{width: '7%','marginRight':"14vw",borderRadius: '8px'}}>
                            <button type="submit">Guardar</button>
                        </LinkContainer>
                        </div>
                    </form>
            </div>
        );
      } 
}