import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { connect } from "react-redux";

export class editar_ramo extends React.Component {

  state = {
    id: "",
    nombre_ramo: "",
    codigo_ramo: "",
    semestre_malla: "0",
    ramo_modified: false,
  };

  async componentDidMount () {  
    const id  = this.props.match.params.id;

    axios.get(`http://127.0.0.1:8000/api/ramos/${id}/`)
      .then( (res) => { 
        this.setState({
            id: res.data.id,
            nombre_ramo: res.data.name,
            codigo_ramo: res.data.codigo,
            semestre_malla: res.data.semestre_malla
        })
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
      this.update_ramo();
  }

  update_ramo() {  
    console.log("post ramo ...")
    
    const url = `http://127.0.0.1:8000/api/ramos/${this.state.id}/`
    let options = {
      method: 'PATCH',
      url: url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.props.auth.token}`
      },
      data: {
        "name": this.state.nombre_ramo,
        "codigo": this.state.codigo_ramo,
        "semestre_malla": this.state.semestre_malla
    }
  }
    
    axios(options)
      .then( (res) => {
        console.log(res);
        console.log("ramo updated");
        this.setState({"ramo_modified": true});
      })
      .catch( (err) => {
        console.log(err);
        console.log("cant update ramo");
        alert("No se pudo actualizar el ramo!");
      });
  }


    render() {

        if (this.state.ramo_modified) {
            return <Redirect to="/ramos/" />;
        }

        const id= this.props.match.params.id;

        return (
            <div>
                <h4 className="titulo">Editar ramo {id}</h4>
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
                                            <input type="text" className="form-control" name="nombre_ramo" value={this.state.nombre_ramo}  onChange={this.onChange} style={{textAlignLast:'center'}} />
                                        </div>
                                    </div>
                                </div>  

                                <div class="col-md-4">
                                    <div class="row" style={{justifyContent: 'center'}} >
                                        <div class="col-md-3" >
                                            <label >Código</label>
                                        </div>
                                        <div class="col-sm-9" >
                                        <input type="text" className="form-control" name="codigo_ramo" value={this.state.codigo_ramo}  onChange={this.onChange} style={{textAlignLast:'center'}}  />
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
                                            <select className="form-control center" name="semestre_malla" value={this.state.semestre_malla} onChange={this.onChange} style={{textAlignLast:'center',textAlign:'center'}}  >
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
                        <LinkContainer  activeClassName=""  to="/ramos" className="float-left " style={{'marginLeft':"10vw"}}>
                            <button className="btn btn-primary">Volver</button>
                        </LinkContainer>

                        {/* <LinkContainer activeClassName=""  to="/ramos" style={{'marginRight':"14vw"}}> */}
                            <button className="btn btn-primary" type="submit">Guardar</button>
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

export default connect(mapStateToProps)(editar_ramo);

