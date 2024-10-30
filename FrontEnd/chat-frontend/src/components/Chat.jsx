import React from 'react'
import ChatHeader from './chatHeader'
import ChatList from './ChatList'


function Chat() {
  return (
    <div>
      <ChatHeader/>
      <div className="row">
        <div className={`col-4`}><ChatList/></div>
        <div className={`col-8`}></div>
      </div>
      
    </div>
  )
}

export default Chat