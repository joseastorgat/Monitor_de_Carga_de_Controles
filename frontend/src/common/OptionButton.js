import React from "react";
import { Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import Octicon from "@primer/octicons-react";

class OptionButton extends React.Component {
  renderTooltip() {
    return <Tooltip>{this.props.description}</Tooltip>;
  }

  render() {
    const marginRight = this.props.last ? "mr-0" : "mr-2";
    const { onClick, icon } = this.props;
    function color_assigment(a) {
      if (a==='Pencil'){
        return "warning" }
      else if (a==="Trashcan"){
        return "danger"
      }
      else if(a==="Calendar"){
        return "success"
      }
      else{
        return "primary"
      }
    };
    let color= color_assigment(icon.name);
    return (
      <OverlayTrigger size="medium" placement="top" overlay={this.renderTooltip()}>
        <Button
          variant={color}
          className={marginRight}
          onClick={onClick ? () => onClick() : () => {}}
        >
          <Octicon icon={icon} size="medium" />
        </Button>
      </OverlayTrigger>
    );
  }
}

export default OptionButton;
