import React from 'react'
import ChatHeader from './chatHeader'
import ChatList from './ChatList'
import ChatBox from './ChatBox'
import styles from './chat.module.css'

function Chat() {
  return (
    <div>
      <ChatHeader/>
      <div className="row">
        <div className={`col-sm-12 col-md-4 ${styles.chat}`}><ChatList/></div>
        <div className={`col-sm-12 col-md-8`}><ChatBox/></div>
      </div>
      
    </div>
  )
}

export default Chat