import React from "react";
import { LinkContainer } from "react-router-bootstrap";

export default class nuevo_curso extends React.Component {
    render() {
        return (
            <div>
                <h4 className="titulo">Agregar semestre</h4>
                    <form className="" name="form">
                        <div class="semestre-form">
                            <div class="row">
                                <div class="col-sm-2"></div>
                                <div class="col-sm-4" >
                                    <div class="row">
                                        <div class="col-sm-2" >
                                            <label >Año</label>
                                        </div>
                                        <div class="col-sm-6" >
                                            <input type="number"  min="2019" max="2030" step="1" className="form-control en-linea" name="año"  />
                                        </div>
                                    </div>
                                </div>  

                                <div class="col-md-4">
                                <div class="row" style={{justifyContent: 'center'}} >
                                        <div class="col-md-2" >
                                            <label >Tipo</label>
                                        </div>

                                    <div  class="custom-control custom-radio custom-control-inline">
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
                                <div class="col-md-2" ></div>
                                <div class="col-md-4" >
                                    <div class="row">
                                        <div class="col-md-2" >
                                        <label >Inicio</label>
                                        </div>
                                        <div class="col-md-6" >
                                        <input type="date" className="form-control" name="fecha_inicio"  />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4" >
                                    <div class="row" style={{justifyContent: 'center'}}>
                                        <div class="col-md-2" >
                                            <label >Fin</label>
                                        </div>
                                        <div class="col-md-6" >
                                            <input type="date" className="form-control" name="fecha_fin"  />
                                        </div>
                                    </div>
                                </div>
                            </div>
                       </div> 
                        <div class="row" style={{textAlign:'center', justifyContent:'center'}}>
                            <div class="cuadrado-form">
                            <div style={{textAlign:'center'}} class="custom-control custom-radio custom-control-inline" >
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
                        <LinkContainer  activeClassName=""  to="/semestres" className="float-left " style={{width: '7%', 'marginLeft':"10vw",borderRadius: '8px'}}>
                            <button >Volver</button>
                        </LinkContainer>

                        <LinkContainer activeClassName=""  to="/semestres" style={{width: '7%','marginRight':"14vw",borderRadius: '8px'}}>
                            <button type="submit">Guardar</button>
                        </LinkContainer>
                        </div>
                    </form>
            </div>
        );
      } 
}