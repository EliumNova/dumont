'use client';

import React from 'react';

const ModalDelete = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-4xl">
        {children}
      </div>
    </div>
  );
};

export default ModalDelete;
