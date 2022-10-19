import React, { useState } from 'react';
import { Modal } from '../../context/Modal';

// Custom Modal

// pass props, component, or text from parent container (SpotDetails)
function CustomModal({buttontext, Content}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>{buttontext}</button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          {<Content/>}
        </Modal>
      )}
    </>
  );
}

export default CustomModal;
