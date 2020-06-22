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

export class editar_semestre extends React.Component {
    state={
        id:"",
        año_semestre: "",
        periodo_semestre: "",
        inicio_semestre: "",
        fin_semestre:"",
        estado_semestre:"",
        forma_creacion_semestre:0,
        semestre_modified: false,
        semestre:[]
    }
    static propTypes={
        auth: PropTypes.object.isRequired,
    };

    async componentDidMount () {  
        const { ano, semestre } = this.props.match.params;
        this.paths = `/semestres/${ano}/${semestre}`;
        const se= (semestre==="Otoño" ? 1 : 2)
        console.log("Fetching Semestre...")
        await fetch(`http://127.0.0.1:8000/api/semestres/?año=${ano}&periodo=${se}`)
        .then( res=> res.json())
        .then( res => {
            this.setState({
                id: res[0].id,
                año_semestre: res[0].año,
                periodo_semestre: res[0].periodo,
                inicio_semestre: res[0].inicio,
                fin_semestre: res[0].fin,
                estado_semestre: res[0].estado,
            })
            if (res[0].periodo===1){
                document.getElementById("otoño").checked = true;
            }
            else{
                document.getElementById("primavera").checked = true;
            }
            
        })
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
        this.update_semestre()
    }

    update_semestre() {  
        console.log("post semestre ...")
        const url = `http://127.0.0.1:8000/api/semestres/${this.state.id}/`
        let options = {
            method: 'PATCH',
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
            console.log("update semestre");
            this.setState({"semestre_modified": true});

          })
          .catch( (err) => {
            alert("ERROR")
            console.log(err);
            console.log("cant update semestre");
            alert("No se pudo actualizar semestre!");
          });
      }
    

    render() {
        if (this.state.semestre_modified) {
            return <Redirect to="/semestres" />;
        }
        return (
            <Container>
            <ViewTitle>
            <Link  to="/semestres"><OptionButton icon={ArrowLeft} description="Volver a semestres" /></Link>Editar semestre</ViewTitle>
                
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
                                            <input type="number"  min="2019" max="2030" step="1" className="form-control" placeholder="2020" name="año_semestre" value={this.state.año_semestre} onChange={this.onChange}  />
                                        </div>
                                    </div>
                                </div>  

                                <div class="col-md-4">
                                <div class="row" style={{justifyContent: 'center'}} >
                                        <div class="col-md-2" >
                                            <label >Tipo</label>
                                        </div>

                                    <div  class="custom-control custom-radio custom-control-inline" >
                                        <input type="radio" id="otoño" name="periodo_semestre" value="1" onChange={this.onChange} class="custom-control-input" />
                                        <label class="custom-control-label" htmlFor="otoño">Otoño</label>
                                    </div>
                                    <div style={{textAlign:'center'}} class="custom-control custom-radio custom-control-inline" >
                                        <input type="radio" id="primavera" name="periodo_semestre" value="2" onChange={this.onChange} class="custom-control-input" />
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
                                        <input type="date" className="form-control" name="inicio_semestre" onChange={this.onChange} value={this.state.inicio_semestre}/>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-5" >
                                    <div class="row" style={{justifyContent: 'center'}}>
                                        <div class="col-md-2" >
                                            <label >Fin</label>
                                        </div>
                                        <div class="col-md-10" style={{textAlignLast:'center', textAlign:'center'}}>
                                            <input type="date" className="form-control" name="fin_semestre" onChange={this.onChange} value={this.state.fin_semestre}  />
                                        </div>
                                    </div>
                                </div>
                            </div>
                       </div> 
                        {/* <div class="row" style={{textAlign:'center', justifyContent:'center'}}>
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
                        </div> */}

                        <div class="form-group" style={{'marginTop':"4rem"}}>
                        <LinkContainer  activeClassName=""  to="/semestres" className="float-left " style={{ 'marginLeft':"10vw"}}>
                            <button className="btn btn-secondary" >Volver</button>
                        </LinkContainer>

                        {/* <LinkContainer activeClassName=""  to="/semestres" style={{'marginRight':"14vw"}}> */}
                            <button className="btn btn-success" type="submit">Guardar</button>
                        {/* </LinkContainer> */}
                        </div>
                    </form>
            </Container>
        );
      } 
}
const mapStateToProps = (state) => ({
    auth: state.auth
});
   
export default connect(mapStateToProps)(editar_semestre);