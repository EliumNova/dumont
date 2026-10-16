'use client';

import React from 'react';
import MacModal from '../../components/MacModal';

const ModalDelete = ({ isOpen, onClose, children }) => (
  <MacModal
    isOpen={isOpen}
    onClose={onClose}
    footer={false}
    maxWidth="max-w-lg"
    zIndex="z-[60]">
    {children}
  </MacModal>
);

export default ModalDelete;
