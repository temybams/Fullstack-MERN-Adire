import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  children: ReactNode;
  position: { top: number; left: number };
}

const Modal: React.FC<ModalProps> = ({ children, position }) => {
  const modalRoot = document.getElementById('modal-root');

  if (!modalRoot) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="modal" style={{ top: position.top, left: position.left }}>
      {children}
    </div>,
    modalRoot
  );
};

export default Modal;
