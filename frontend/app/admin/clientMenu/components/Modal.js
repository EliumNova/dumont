'use client';

import React from 'react';
import MacModal from '../../components/MacModal';

const Modal = ({ isOpen, onClose, title, children }) => (
  <MacModal isOpen={isOpen} onClose={onClose} title={title}>
    {children}
  </MacModal>
);

export default Modal;
