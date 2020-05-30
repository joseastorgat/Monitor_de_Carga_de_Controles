import React from "react";
import {LinkContainer } from "react-router-bootstrap";

export default class editar_semestre extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            semestre: {
              año: "",
              tipo: "",

            }
          };
        const { year, semester } = this.props.match.params;
    }
    

    render() {
        return (
            <div>
                <h4 className="titulo">Editar semestre</h4>
                    <form className="" name="form">
                        <div class="generic-form">
                            <div class="row">
                                <div class="col-sm-1"></div>
                                <div class="col-sm-5" >
                                    <div class="row">
                                        <div class="col-sm-2" >
                                            <label >Año</label>
                                        </div>
                                        <div class="col-sm-10" style={{textAlignLast:'center', textAlign:'center'}} >
                                            <input type="number"  min="2019" max="2030" step="1" className="form-control" placeholder="2020" name="año"  />
                                        </div>
                                    </div>
                                </div>  

                                <div class="col-md-4">
                                <div class="row" style={{justifyContent: 'center'}} >
                                        <div class="col-md-2" >
                                            <label >Tipo</label>
                                        </div>

                                    <div  class="custom-control custom-radio custom-control-inline" >
                                        <input type="radio" id="otoño" name="tipo_semestre" class="custom-control-input" />
                                        <label class="custom-control-label" htmlFor="otoño">Otoño</label>
                                    </div>
                                    <div style={{textAlign:'center'}} class="custom-control custom-radio custom-control-inline" >
                                        <input type="radio" id="primavera" name="tipo_semestre" class="custom-control-input" />
                                        <label class="custom-control-label" htmlFor="primavera" >Primavera</label>
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
                            <div class="row" >
                                <div class="col-md-1" ></div>
                                <div class="col-md-5" >
                                    <div class="row">
                                        <div class="col-md-2" >
                                            <label >Estado</label>
                                        </div>
                                        <div class="col-md-10" style={{textAlignLast:'center', textAlign:'center'}}>
                                            <select className="form-control center" name="nombre_ramo" style={{textAlignLast:'center',textAlign:'center'}}  >
                                                <option value="1">Por comenzar</option>
                                                <option value="2">En curso</option>
                                                <option value="3">Finalizado</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div> 
                       </div> 
                        <div class="row" style={{textAlign:'center', justifyContent:'center'}}>
                            <div class="cuadrado-form">
                            <div style={{textAlignLast:'center', textAlign:'center'}} class="custom-control custom-radio custom-control-inline" >
                                        <input type="radio" id="replicar_semestre" name="semestre_opcion" class="custom-control-input" />
                                         <label class="custom-control-label" htmlFor="replicar_semestre" >Clonar Semestre</label>
                                        <div class="col-sm-10" >
                                        <input type="text" className="form-control" name="semestre_replicado" placeholder="Primavera 2020" />
                                        </div>
                                    </div>                                         
                            </div>
                            <div class="cuadrado-form">
                                <div style={{textAlign:'center'}} class="custom-control custom-radio custom-control-inline" >
                                        <input type="radio" id="archivo_excel" name="semestre_opcion" class="custom-control-input" />
                                         <label class="custom-control-label" htmlFor="archivo_excel" >Subir desde archivo</label>
                                        <div class="col-sm-10" >
                                            <input type="file" className="form-control" name="archivo_excel"  />
                                        </div>
                                    </div>
                            </div>
                        </div>

                        <div class="form-group" style={{'marginTop':"4rem"}}>
                        <LinkContainer  activeClassName=""  to="/semestres" className="float-left " style={{ 'marginLeft':"10vw"}}>
                            <button className="btn btn-primary" >Volver</button>
                        </LinkContainer>

                        <LinkContainer activeClassName=""  to="/semestres" style={{'marginRight':"14vw"}}>
                            <button className="btn btn-primary" type="submit">Guardar</button>
                        </LinkContainer>
                        </div>
                    </form>
            </div>
        );
      } 
}