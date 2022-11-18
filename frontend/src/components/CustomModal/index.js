import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import './CustomModal.css'
// Custom Modal

// pass props, component, or text from parent container (SpotDetails)
// add spotId to pass in id info
function CustomModal({className, spot, buttontext, Content, spotId}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button className={className}onClick={() => setShowModal(true)}>{buttontext}</button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          {<Content setShowModal={setShowModal} spotId={spotId} spot={spot}/>}
        </Modal>
      )}
    </>
  );
}

export default CustomModal;
