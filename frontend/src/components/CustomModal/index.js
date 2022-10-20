import React, { useState } from 'react';
import { Modal } from '../../context/Modal';

// Custom Modal

// pass props, component, or text from parent container (SpotDetails)
// add spotId to pass in id info
function CustomModal({buttontext, Content, spotId}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>{buttontext}</button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          {<Content setShowModal={setShowModal} spotId={spotId}/>}
        </Modal>
      )}
    </>
  );
}

export default CustomModal;
