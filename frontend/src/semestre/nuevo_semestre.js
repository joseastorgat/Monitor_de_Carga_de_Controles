import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';
import { Button } from "react-bootstrap";
import {ArrowLeft} from "@primer/octicons-react";
import ViewTitle from "../common/ViewTitle";
import { Link } from "react-router-dom";
import OptionButton from "../common/OptionButton";
import { Container} from "react-bootstrap";

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

        required: "required",
        subir_archivo: false,
        clonar_semestre: false,
        archivo: null,
        archivo_cargado: false,
    }

    onChange = e => {
        this.setState({
          [e.target.name]: 
          e.target.value
        })
    };

    onSelect = e => {

        const {clonar_semestre, subir_archivo} = this.state;
        
        console.log(clonar_semestre, subir_archivo);

        if(e === "clonar"){
            this.setState({
                clonar_semestre: !clonar_semestre,
                subir_archivo: false,
                required: clonar_semestre? "required" : ""
            })
        }
        else{
            this.setState({
                subir_archivo: !subir_archivo,
                clonar_semestre: false,
                required: subir_archivo? "required" : ""
            })
        }
    };

    onFile = e => {
        this.setState({
          archivo: e.target.files[0],
          subir_archivo: true, 
          archivo_cargado: true,
          clonar_semestre: false,
          required: "",
        })
    };

    handleSubmit = e => {
        e.preventDefault();
        this.create_semestre();
    }

    create_semestre() {  
        console.log("post semestre ...")
        let url = "";
        let data = {};
        let options = {};
       
        if(!this.state.subir_archivo){
            url = "http://127.0.0.1:8000/api/semestres/"

            data = {
                "año": parseInt(this.state.año_semestre),
                "estado": parseInt(this.state.estado_semestre),
                "periodo": parseInt(this.state.periodo_semestre),
                "inicio":this.state.inicio_semestre,
                "fin": this.state.fin_semestre
            }
            options = {
                method: 'POST',
                url: url,
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Token ${this.props.auth.token}`
              },
                data: data
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
        else{

            if(!this.state.archivo_cargado){
                alert("Debes cargar un archivo primero");
                return;

            }
            url = "http://127.0.0.1:8000/api/semestres/from_xlsx/"
            const formData = new FormData();
            formData.append("file", this.state.archivo);
            return axios.post(url, formData, {
                headers: {Authorization: `Token ${this.props.auth.token}`}
            })
            .then( e => this.setState({"semestre_created": true}))
            .catch( e=> console.log(e))
        }
      }



    render() {
        if (this.state.semestre_created) {
            return <Redirect to="/semestres" />;
        }
        return (
            <Container>
            <ViewTitle>
            <Link  to="/semestres/"><OptionButton icon={ArrowLeft} description="Volver a semestres" /></Link>Agregar nuevo semestre</ViewTitle>
               
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
                                            <input type="number" required={this.state.required} min="2019" max="2030" step="1" className="form-control" placeholder="2020" name="año_semestre" onChange={this.onChange}  />
                                        </div>
                                    </div>
                                </div>  

                                <div class="col-md-4">
                                <div class="row" style={{justifyContent: 'center'}} >
                                        <div class="col-md-2" >
                                            <label >Tipo</label>
                                        </div>

                                    <div  class="custom-control custom-radio custom-control-inline"  >
                                        <input required={this.state.required} type="radio" id="otoño" name="periodo_semestre" value="1" onChange={this.onChange} class="custom-control-input" />
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
                                        <input required={this.state.required} type="date" className="form-control" name="inicio_semestre" onChange={this.onChange} />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-5" >
                                    <div class="row" style={{justifyContent: 'center'}}>
                                        <div class="col-md-2" >
                                            <label >Fin</label>
                                        </div>
                                        <div class="col-md-10" style={{textAlignLast:'center', textAlign:'center'}}>
                                            <input required={this.state.required} type="date" className="form-control" name="fin_semestre" onChange={this.onChange} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                       </div> 
                        <div class="row" style={{textAlign:'center', justifyContent:'center'}}>
                            <div class="cuadrado-form">
                            <div style={{textAlignLast:'center', textAlign:'center'}} class="custom-control custom-radio custom-control-inline" >
                                <input type="radio" id="replicar_semestre" name="clonar_semestre" class="custom-control-input"  checked={this.state.clonar_semestre} onClick={e => this.onSelect("clonar")}/>
                                    <label class="custom-control-label" htmlFor="replicar_semestre" >Clonar Semestre</label>
                                <div class="col-sm-10" >
                                    <input type="text" className="form-control" name="semestre_replicado" placeholder="Primavera 2020" />
                                </div>
                                </div>                                         
                            </div>
                            <div class="cuadrado-form">
                                <div style={{textAlign:'center'}} class="custom-control custom-radio custom-control-inline" >
                                    <input type="radio" id="archivo_excel" name="subir_archivo" class="custom-control-input" checked={this.state.subir_archivo} onClick={e => this.onSelect("subir")} />
                                    <label class="custom-control-label" htmlFor="archivo_excel" >Subir desde archivo</label>
                                    <div class="col-sm-10" >
                                        <input type="file" className="form-control" name="archivo_excel" onChange={this.onFile } />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-group" style={{'marginTop':"4rem"}}>
                        <LinkContainer  activeClassName=""  to="/semestres/" className="float-left " style={{ 'marginLeft':"10vw"}}>
                            <Button className="btn btn-secondary" > 
                              Volver a Semestres       </Button>
                        </LinkContainer>

                     
                            <button className="btn btn-success" type="submit">Guardar Semestre</button>
                        </div>
                    </form>
            </Container>
        );
      } 
}
const mapStateToProps = (state) => ({
    auth: state.auth
});
   
export default connect(mapStateToProps)(nuevo_semestre);