import React from "react";
import { Link, LinkContainer } from "react-router-bootstrap";
import {   Button ,Col} from "react-bootstrap";

export default class nuevo_semestre extends React.Component {
    render() {
        return (
            <div>
                <h4 className="titulo">Agregar semestre</h4>
                    <form className="semestre-form" name="form">
                        <div className="form-group" >
                            <div className="col-xs-3 en-linea" >
                                <label>Año <input type="number"  min="2019" max="2030" step="1" className="form-control en-linea" name="año"  /></label>
                            </div>  

                                <div className="en-linea" style={{'marginLeft':"14rem"}}>
                                    <div class="custom-control custom-radio custom-control-inline">
                                        <input type="radio" id="otoño" name="tipo_semestre" class="custom-control-input" />
                                        <label class="custom-control-label" >Otoño</label>
                                    </div>
                                    <div className="custom-control custom-radio custom-control-inline">
                                        <input type="radio" id="primavera" name="tipo_semestre" class="custom-control-input" />
                                        <label class="custom-control-label" >Primavera</label>
                                    </div>
                                </div>
                            </div>

                            <div class="outside">
                                <div className="en-linea">
                                    <div className="col-xs-3">
                                    <label >Inicio</label>
                                    <input type="date" className="form-control" name="fecha_inicio"  />
                                    </div>
                                </div>
                                <div className="en-linea" style={{'marginLeft':"14rem"}}>
                                    <div class="col-xs-3">
                                        <label >Fin</label>
                                        <input type="date" className="form-control" name="fecha_fin"  />
                                    </div>
                                </div>
                            </div>


                        <div className="outside" style={{'marginTop':"4rem"}}>
                        <LinkContainer  activeClassName=""  to="/semestres" className="en-linea float-left " style={{width: '7%', 'marginLeft':"10vw",borderRadius: '8%'}}>
                            <button >Volver</button>
                        </LinkContainer>

                        <LinkContainer activeClassName=""  to="/semestres" style={{width: '7%','marginRight':"14vw",borderRadius: '8%'}}>
                            <button type="submit">Guardar</button>
                        </LinkContainer>
                        </div>
                    </form>
            </div>
        );
      } 
}