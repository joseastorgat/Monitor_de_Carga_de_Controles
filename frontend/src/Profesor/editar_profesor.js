import React from "react";
import { LinkContainer } from "react-router-bootstrap";

export default class editar_profesor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          profesor: {
            nombre: ""
          }
        };
    }

    render() {
        const id= this.props.match.params.id
        return (
            <div>
                <h4 className="titulo">Editar Profesor</h4>
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
                                            <input type="text" className="form-control" name="nombre" defaultValue="Sergio" style={{textAlignLast:'center'}} />
                                        </div>
                                    </div>
                                </div>  

                                <div class="col-sm-5">
                                    <div class="row" style={{justifyContent: 'center'}} >
                                        <div class="col-sm-2" >
                                            <label >Apellido</label>
                                        </div>
                                        <div class="col-sm-10" >
                                        <input type="text" className="form-control" name="apellido" defaultValue="Ochoa" style={{textAlignLast:'center'}}  />
                                        </div>
                                    
                                    </div>
                                </div>
                            </div>                    
                        </div>
                        <div class="form-group" style={{'marginTop':"4rem"}}>
                        <LinkContainer  activeClassName=""  to="/profesores" className="float-left " style={{width: '7%', 'marginLeft':"10vw",borderRadius: '8px'}}>
                            <button >Volver</button>
                        </LinkContainer>

                        <LinkContainer activeClassName=""  to="/profesores" style={{width: '7%','marginRight':"14vw",borderRadius: '8px'}}>
                            <button type="submit">Guardar</button>
                        </LinkContainer>
                        </div>
                    </form>
            </div>
        );
      } 
}