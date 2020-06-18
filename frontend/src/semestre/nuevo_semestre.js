import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';

export class nuevo_semestre extends React.Component {
    static propTypes={
        auth: PropTypes.object.isRequired,
    };

    state={
        año_semestre: "",
        periodo_semestre: "",
        inicio_semestre: "",
        fin_semestre:"",
        estado_semestre:"1",
        forma_creacion_semestre:0,
        semestre_created: false,
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
        this.create_semestre_normal();
    }

    create_semestre_normal() {  
        console.log("post semestre ...")
        const url = "http://127.0.0.1:8000/api/semestres/"
        let options = {
          method: 'POST',
          url: url,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${this.props.auth.token}`
        },
          data: {
            "año": parseInt(this.state.año_semestre),
            "estado": parseInt(this.state.estado_semestre),
            "periodo": parseInt(this.state.periodo_semestre),
            "inicio":this.state.inicio_semestre,
            "fin": this.state.fin_semestre
           }
        }
        
        axios(options)
          .then( (res) => {
            console.log(res);
            console.log("create semestre");
            this.setState({"semestre_created": true});
          })
          .catch( (err) => {
            console.log(err);
            console.log("cant create semestre");
            alert("No se pudo crear semestre!");
          });
      }

    render() {
        if (this.state.semestre_created) {
            return <Redirect to="/semestres" />;
        }
        return (
            <div>
                <h4 className="titulo">Agregar semestre</h4>
                    <form className="" name="form" onSubmit={this.handleSubmit}>
                        <div class="generic-form">
                            <div class="row">
                                <div class="col-sm-1"></div>
                                <div class="col-sm-5" >
                                    <div class="row">
                                        <div class="col-sm-2" >
                                            <label >Año</label>
                                        </div>
                                        <div class="col-sm-10" style={{textAlignLast:'center', textAlign:'center'}} >
                                            <input type="number" required min="2019" max="2030" step="1" className="form-control" placeholder="2020" name="año_semestre" onChange={this.onChange}  />
                                        </div>
                                    </div>
                                </div>  

                                <div class="col-md-4">
                                <div class="row" style={{justifyContent: 'center'}} >
                                        <div class="col-md-2" >
                                            <label >Tipo</label>
                                        </div>

                                    <div  class="custom-control custom-radio custom-control-inline"  >
                                        <input required type="radio" id="otoño" name="periodo_semestre" value="1" onChange={this.onChange} class="custom-control-input" />
                                        <label class="custom-control-label" htmlFor="otoño" >Otoño</label>
                                    </div>
                                    <div style={{textAlign:'center'}} class="custom-control custom-radio custom-control-inline" >
                                        <input type="radio" id="primavera" name="periodo_semestre" value="2" onChange={this.onChange} class="custom-control-input" />
                                        <label class="custom-control-label" htmlFor="primavera">Primavera</label>
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
                                        <input required type="date" className="form-control" name="inicio_semestre" onChange={this.onChange} />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-5" >
                                    <div class="row" style={{justifyContent: 'center'}}>
                                        <div class="col-md-2" >
                                            <label >Fin</label>
                                        </div>
                                        <div class="col-md-10" style={{textAlignLast:'center', textAlign:'center'}}>
                                            <input required type="date" className="form-control" name="fin_semestre" onChange={this.onChange} />
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
                                            <select required className="form-control center" name="estado_semestre" onChange={this.onChange} style={{textAlignLast:'center',textAlign:'center'}}  >
                                                <option value="1" selected>Por comenzar</option>
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
                            <button className="btn btn-secondary" >Volver a Semestres</button>
                        </LinkContainer>

                        {/* <LinkContainer activeClassName=""  to="/semestres" style={{'marginRight':"14vw"}}> */}
                            <button className="btn btn-success" type="submit">Guardar Semestre</button>
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
   
export default connect(mapStateToProps)(nuevo_semestre);