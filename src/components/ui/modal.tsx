import { useState } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode; // Tambahkan children sebagai properti opsional
  }
  
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const [modalStyle] = useState({
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      border: 'none',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: '#fff',
    },
  });

  return (
    <>
      {isOpen && (
        <div style={modalStyle.overlay} onClick={onClose}>
          <div style={modalStyle.content} onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
