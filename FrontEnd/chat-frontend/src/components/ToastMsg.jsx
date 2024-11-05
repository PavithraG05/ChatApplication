import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import { ChatState } from './context/ChatProvider';

function ToastMsg({msg}) {
   const {toast, setToast} = ChatState();

  return (
    <Row>
      <Col xs={6}>
        <Toast onClose={() => setToast(false)} show={toast} delay={3000} autohide>
          <Toast.Header>
            <i className="bi bi-exclamation-triangle-fill"></i>
            <strong className="me-auto">Error</strong>
          </Toast.Header>
          <Toast.Body>{msg}</Toast.Body>
        </Toast>
      </Col>
    </Row>
  );
}

export default ToastMsg