import React from "react";
import { Container} from "react-bootstrap";
import ViewTitle from "../common/ViewTitle";

export default class About extends React.Component {
    render() {
      return(
          <div>
          <Container >
           <ViewTitle>About </ViewTitle>
           <div style={{textAlign:"center"}}>
            <h3 style={{backgroundColor:"gray",color:"white"}}>Versión 1.0</h3>
            <Container  className="block" >
            <ul className="list" style={{fontWeight:"600"}}>  
                <li>José Astorga - Desarrollador Frontend</li>
                <li>Victor Caro - Ingeniero de Calidad</li>
                <li>Valentina González - Desarrollador Frontend</li>
                <li>Patricio López - Desarrollador Backend</li>
                <li>Nicolas Machuca - Desarrollador Frontend</li>
                <li>Vicente Rojas - Ingeniero de Calidad</li>
                <li>Pablo Torres - Jefe de Proyecto</li>

            </ul> 
            </Container>
           </div>
          </Container>
          </div>
    )}
  }
  