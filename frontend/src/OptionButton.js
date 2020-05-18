import React from "react";
import { Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import Octicon from "@primer/octicons-react";

class OptionButton extends React.Component {
  renderTooltip() {
    return <Tooltip>{this.props.description}</Tooltip>;
  }

  render() {
    const marginRight = this.props.last ? "mr-0" : "mr-2";
    // console.log(this.props.on);
    const { onClick, icon } = this.props;
    return (
      <OverlayTrigger placement="top" overlay={this.renderTooltip()}>
        <Button
          variant="outline-secondary"
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
