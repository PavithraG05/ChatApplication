import React from 'react'
import styles from './chatbox.module.css'

function ChatBox() {
  return (
    <div className="border border-2">
        <div className={`${styles.chatArea} bg-light`}>
            <div className={`d-flex ${styles.chatTitle} justify-content-between`}>
                <p className={`text-start ${styles.username}`}>Username</p>
                <div className={`py-1 px-1`}><button className={`${styles.profileView}`}><i className={`bi bi-eye-fill`}></i></button></div>
            </div>
            <div className={`${styles.messageDiv}`}>
                <div className={`${styles.messageArea}`}>
                    Message area
                </div>
                <div className={`${styles.chatBox} rounded-1`}>
                    <input type="text" placeholder='Enter a message...' className={`${styles.chatTextBox} rounded-2`}/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ChatBox