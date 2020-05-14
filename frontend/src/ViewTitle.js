import React from "react";
import { Row, Col } from "react-bootstrap";

class ViewTitle extends React.Component {
  render() {
    return (
      <Row>
        <Col>
          <h3>{this.props.children}</h3>
        </Col>
      </Row>
    );
  }
}

export default ViewTitle;
