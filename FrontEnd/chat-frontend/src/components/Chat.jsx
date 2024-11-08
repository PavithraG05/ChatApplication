import React, { useEffect, useState } from 'react'
import ChatHeader from './chatHeader'
import ChatList from './ChatList'
import MessageBox from './MessageBox'
import styles from './chat.module.css'
import { ChatState } from './context/ChatProvider'

function Chat() {

  const [fetchAgain, setFetchAgain] = useState(false);
  const {user} = ChatState();
  

  return (
    <div>
      {user && <ChatHeader/>}
      <div className="row">
        {user && <div className={`col-sm-12 col-md-4 ${styles.chat}`}><ChatList fetchAgain={fetchAgain}/></div>}
        {user && <div className={`col-sm-12 col-md-8 ${styles.message}`}><MessageBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/></div>}
      </div>
      
    </div>
  )
}

export default Chat