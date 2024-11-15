import React from 'react'
import ScrollableFeed from "react-scrollable-feed";
import styles from './messages.module.css';
import { isSameSender, isLastMessage, isSameSenderMargin, isSameUser } from './msgLogic'; './msgLogic.js'
import { ChatState } from './context/ChatProvider';

function Messages({messageList}) {
    const {user} = ChatState();
  return (
    <>
        <ScrollableFeed>
            <div className={``}>
                {messageList && messageList.map((msg,i) => (
                    // {console.log(msg.content)}
                    // {msg.content}
                    <div className={`${styles.msgList}`} key={i}>
                        {(isSameSender(messageList, msg, i, user._id)||isLastMessage(messageList, i, user._id)) && 
                            <img src={msg.sender.profile} className={`${styles.msgImage}`} style={{marginTop: isSameUser(messageList, msg, i) ? 3 : 10}}/>
                            }
                            <span 
                            style={{
                                backgroundColor: `${
                                msg.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                                }`,
                                marginLeft: isSameSenderMargin(messageList, msg, i, user._id),
                                marginTop: isSameUser(messageList, msg, i) ? 3 : 10,
                                borderRadius: "20px",
                                padding: "5px 15px",
                                maxWidth: "75%",
                                overflowWrap:"break-word"
                                
                            }}>
                                {msg.content}
                            </span>
                    </div>

                ))}
            </div>
        </ScrollableFeed>
    </>
  )
}

export default Messages