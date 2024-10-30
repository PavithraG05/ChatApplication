import React from 'react'
import styles from './chatlist.module.css'

function ChatList() {
  return (
    <div className={`border bg-light`}>
        <div className="container py-3">
            <div className={`row border`}>
                <div className={`col-5`}>
                    <h6 className={`${styles.chatTitle}`}>My Chats</h6>
                </div>
                <div className={`col-7`}>
                    <button className={`btn btn-sm rounded-1 ${styles.groupBtn}`}><i class="bi bi-plus-square"></i>&nbsp; Create Group Chat</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ChatList