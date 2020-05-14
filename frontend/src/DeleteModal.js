import React from "react";
import { Modal, Button } from "react-bootstrap";

export default class DeleteModal extends React.Component {
  render() {
    const { show, handleCancel, handleDelete, msg } = this.props;
    return (
      <Modal show={show} onHide={() => handleCancel()}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Confirmación de eliminación
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{msg}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleCancel()}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={() => handleDelete()}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
