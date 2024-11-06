import React, { useEffect } from 'react'
import styles from './profilemodal.module.css'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ChatState } from './context/ChatProvider'

function ProfileModal({profileModal, setProfileModal, user}) {

    // const {user} = ChatState();

    useEffect(()=>{
     console.log(profileModal)   
     console.log(user);
    })

    const closeProfile = () => {
        setProfileModal(false);
        console.log(profileModal);
    }

  return (

    <Modal show={profileModal} onHide={closeProfile} className={`${styles.profilemodal}`} aria-labelledby="contained-modal-title-vcenter" centered>
        {/* <Modal.Header closeButton>
          <Modal.Title>Profile</Modal.Title>
        </Modal.Header> */}
        <Modal.Body className={` ${styles.modalWidth}`}>
            <div className={`row`}>
                <div className={`col-4`}>
                    <img src={user.profile} alt="profileimage" className={`border border-2 ${styles.profileImage}`}/>
                </div>
                <div className={`col-7  ${styles.profileTitle}`}>
                    <p><span className={styles.modalTitle}>Username:</span> <span >{user.name}</span></p>
                    <p><span  className={styles.modalTitle}>Email: </span> {user.email}</p>
                </div>
            </div>            
           
        </Modal.Body>
        <Modal.Footer>
        
        <Button variant="secondary" onClick={closeProfile}>
            Cancel
        </Button>
        
        </Modal.Footer>
    </Modal>
  )
}

export default ProfileModal