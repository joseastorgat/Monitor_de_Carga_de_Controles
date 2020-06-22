import React from "react";
import {LinkContainer} from "react-router-bootstrap";
import { Container} from "react-bootstrap";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';
import {ArrowLeft} from "@primer/octicons-react";
import ViewTitle from "../common/ViewTitle";
import { Link } from "react-router-dom";
import OptionButton from "../common/OptionButton";

export class nuevo_ramo extends React.Component {
  
  static propTypes = {
    auth: PropTypes.object.isRequired,
  };

  state = {
    nombre_ramo: "",
    codigo_ramo: "",
    semestre_malla: "5",
    ramo_created: false,
  };

  onChange = e => {
    this.setState({
      [e.target.name]: 
      e.target.value
    })
  };

  handleSubmit = e => {
    e.preventDefault();
    console.log("submit");
    this.create_ramo();
  }
  
  create_ramo() {  
    console.log("post ramo ...")
    
    const url = "http://127.0.0.1:8000/api/ramos/"
    let options = {
      method: 'POST',
      url: url,
      headers: {
    
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.props.auth.token}`
      },
      data: {
        "nombre": this.state.nombre_ramo,
        "codigo": this.state.codigo_ramo,
        "semestre_malla": this.state.semestre_malla
    }
  }
    
    axios(options)
      .then( (res) => {
        console.log(res);
        console.log("create ramo");
        this.setState({"ramo_created": true});
      })
      .catch( (err) => {
        console.log(err);
        console.log("cant create ramo");
        alert("No se pudo crear ramo!");
      });
  }

  render() {

    if (this.state.ramo_created) {
      return <Redirect to="/ramos/" />;
    }
    return (
     <Container>
      <div>
        <ViewTitle>
            <Link  to="./"><OptionButton icon={ArrowLeft} description="Volver a ramos" /></Link>Agregar nuevo ramo</ViewTitle>
      <div>
        <form className="" name="form" onSubmit={this.handleSubmit}>
              <div class="generic-form">
                  <div class="row">
                      <div class="col-sm-1"></div>
                      <div class="col-sm-6" >
                          <div class="row">
                              <div class="col-sm-2" >
                                  <label >Ramo</label>
                              </div>
                              <div class="col-sm-9" >
                                  <input required type="text" className="form-control" name="nombre_ramo" onChange={this.onChange} placeholder="Ingrese Nombre Ramo" style={{textAlignLast:'center'}} />
                              </div>
                          </div>
                      </div>  

                      <div class="col-md-4">
                          <div class="row" style={{justifyContent: 'center'}} >
                              <div class="col-md-3" >
                                  <label >Código</label>
                              </div>
                              <div class="col-sm-9" >
                              <input required type="text" className="form-control" name="codigo_ramo" onChange={this.onChange} placeholder="Ingrese Código CCXXXX" style={{textAlignLast:'center'}}  />
                              </div>                          
                          </div>
                      </div>
                  </div>

                  <div class="row form-group">
                      <div class="col-sm-1"></div>
                      <div class="col-sm-6" >
                          <div class="row">
                              <div class="col-sm-2" >
                                  <label >Semestre</label>
                              </div>
                              <div class="col-sm-9" >
                              {/* No pude centrarlo, hay un problema con prioridades de css de react */}
                                  <select class="form-control" name="semestre_malla" onChange={this.onChange} style={{textAlignLast:'center',textAlign:'center'}}  >
                                      <option value="5" selected>Quinto</option>
                                      <option value="6">Sexto</option>
                                      <option value="7">Séptimo</option>
                                      <option value="8">Octavo</option>
                                      <option value="9">Noveno</option>
                                      <option value="10">Décimo</option>
                                      <option value="15">Electivo</option>
                                  </select>
                              </div>
                          </div>
                      </div>  
                  </div>

              </div>

              <div class="form-group" style={{'marginTop':"4rem"}}>
              <LinkContainer  activeClassName=""  to="/ramos" className="float-left " style={{ 'marginLeft':"10vw"}}>
                  <button className="btn btn-secondary" type="button">Volver a Ramos</button>
              </LinkContainer>

              {/* <LinkContainer activeClassName=""  to="/ramos" style={{'marginRight':"14vw"}}> */}
                  <button className="btn btn-success" type="submit">Guardar Ramo</button>
              {/* </LinkContainer> */}
              </div>
              
          </form></div>
          </div>
          </Container>
);
    } 
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(nuevo_ramo);

