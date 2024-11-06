import React,{useState} from 'react'
import styles from './messagebox.module.css'
import { ChatState } from './context/ChatProvider';
import { getSender, getSenderDetails } from './getSender';
import ProfileModal from './ProfileModal';
import GroupModal from './GroupModal';

function MessageBox() {

    const {user, selectedChat, profileModal, setProfileModal} = ChatState();
    // const [profileModal, setProfileModal] = useState();
    const [groupModal, setGroupModal] = useState(false);
   
    const handleProfile=()=>{
        setProfileModal(true);
        console.log(getSenderDetails(user, selectedChat.users));
    }

    const handleGroupProfile=()=>{
        setGroupModal(true);
    }

  return (
    <div className="border border-2">
        <div className={`${styles.chatArea} bg-light`}>
            {selectedChat && <div>
                <div className={`d-flex ${styles.chatTitle} justify-content-between`}>
                    <div className={`d-flex`}>
                        <img src={!selectedChat.isGroupChat? getSenderDetails(user, selectedChat.users).profile : `grp.jpg`} className={`${styles.avatar}`}/>
                        <p className={`text-start ${styles.username}`}>{!selectedChat.isGroupChat? getSender(user, selectedChat.users):selectedChat.chatName}</p>
                    </div>
                    <div className={`py-1 px-1`}><button className={`${styles.profileView}`} onClick={!selectedChat.isGroupChat? handleProfile: handleGroupProfile}><i className={`bi bi-eye-fill`} ></i></button></div>
                </div>
                <div className={`${styles.messageDiv}`}>
                    <div className={`${styles.messageArea}`}>
                        Message area
                    </div>
                    <div className={`${styles.chatBox} rounded-1`}>
                        <input type="text" placeholder='Enter a message...' className={`${styles.chatTextBox} rounded-2`}/>
                    </div>
                </div>
            </div>}

            {!selectedChat && 
                <div className={`container-fluid ${styles.chatText}`}>
                    <img src="Message_gray-512.webp" className={`${styles.messageImage}`}/>
                    <div className={`py-4`}>Click on an user to start chatting...</div>
                </div>
            }
        </div>
        {profileModal && <ProfileModal profileModal={profileModal} setProfileModal={setProfileModal} user={getSenderDetails(user, selectedChat.users)}/>}
        {groupModal && <GroupModal groupModal={groupModal} setGroupModal={setGroupModal} selectedChat={selectedChat}/>}
    </div>
  )
}

export default MessageBox