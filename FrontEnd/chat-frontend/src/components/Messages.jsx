import React from 'react'
import ScrollableFeed from "react-scrollable-feed";
import styles from './messages.module.css';
import { isSameSender, isLastMessage, isSameSenderMargin, isSameUser } from './msgLogic'; './msgLogic.js'
import { ChatState } from './context/ChatProvider';

function Messages({messageList}) {
    const {user} = ChatState();
  return (
    <div>
        <ScrollableFeed>
            {messageList && messageList.map((msg, i) => {
                <div className={`${styles.msgList}`} key={i}>
                    {(isSameSender(messageList, msg, i, user._id)||isLastMessage(messageList, i, user._id)) && 
                        <img src={msg.sender.profile} className={`${styles.msgImage}`}/>
                        }
                        <span 
                        style={{
                            backgroundColor: `${
                            msg.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                            }`,
                            marginLeft: isSameSenderMargin(messageList, msg, i, user._id),
                            marginTop: isSameUser(messageList, msg, i, user._id) ? 3 : 10,
                            borderRadius: "20px",
                            padding: "5px 15px",
                            maxWidth: "75%",
                        }}>
                            {msg.content}
                        </span>
                </div>

            })}
        </ScrollableFeed>
    </div>
  )
}

export default Messages