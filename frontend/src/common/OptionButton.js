import React from "react";
import { Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import Octicon from "@primer/octicons-react";
import { Pencil, Trashcan, Calendar,Book ,ArrowLeft} from "@primer/octicons-react";

class OptionButton extends React.Component {
  renderTooltip() {
    return <Tooltip>{this.props.description}</Tooltip>;
  }

  assignColor = icon => {
    if (icon===Pencil){
      return "warning"
    }
    else if (icon===Trashcan){
      return "danger"
    }
    else if(icon===Calendar){
      return "success"
    }
    else{
      return "primary"
    }
  };

  render() {
    const marginRight = this.props.last ? "mr-0" : "mr-2";
    const { onClick, icon } = this.props;
    let color = this.assignColor(icon); 

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
