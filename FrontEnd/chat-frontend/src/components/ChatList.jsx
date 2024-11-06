import React, { useState, useEffect } from 'react'
import styles from './chatlist.module.css'
import { ChatState } from './context/ChatProvider';
import StackLoader from './StackLoader';
import { getSender } from './getSender';
const URL = import.meta.env.VITE_APP_URL

function ChatList({fetchAgain}) {

    const [loading, setLoading] = useState(false);
    const [loggedUser, setLoggedUser] = useState();
    const [chatListApiErr, setChatListApiErr] = useState("");
    const {user, chatList, setChatList, selectedChat, setSelectedChat} = ChatState();

    useEffect(()=>{
        console.log("Fetching all chats of an user")
        fetchAllChats()
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    },[fetchAgain])

    const fetchAllChats=async()=>{
        setLoading(true);
        setChatListApiErr("");
        console.log(`LoggedUserDetails from ChatList: ${JSON.stringify(loggedUser)}`);
        console.log(`UserDetails from ChatList: ${JSON.stringify(user)}`);
        try{
            const response = await fetch(`${URL}api/chat/${user._id}`,{
                method:"get",
                headers:{
                    "Authorization": `Bearer ${user.token}`
                }
            });

            if(response.ok){
                const data = await response.json();
                setLoading(false);
                setChatListApiErr("");
                setChatList(data);
                console.log(data);
            }
            else{
                const error = await response.text();
                throw new Error(`Error: ${error}`);
            }
        }
        catch(err){
            console.log(String(err));
            setChatListApiErr(String(err));
            setLoading(false);
            setChatList([]);
        }
    }

  return (
    <div className={`border bg-light`}>
        <div className={`container py-3 ${styles.chatContainer}`}>
            <div className={`row px-1`}>
                <div className={`col-5`}>
                    <h6 className={`${styles.chatTitle}`}>My Chats</h6>
                </div>
                <div className={`col-7 text-end`}>
                    <button className={`btn btn-sm rounded-1 ${styles.groupBtn}`}><i className="bi bi-plus-square"></i>&nbsp; Group Chat</button>
                </div>
            </div>
            <hr/>
            {loading && <StackLoader/>}
            {chatListApiErr && <div>{chatListApiErr}</div>}
            <div className={`overflow-y-auto`}>
                
                {chatList && chatList.map(chat =>(
                    
                    <div key={chat._id} className={`${styles.cardList}`}>
                        <div className={`card border border-danger rounded-1 ${styles.cardone} ${chat === selectedChat?`text-red ${styles.cardBg}`:""}`} onClick={()=>setSelectedChat(chat)}>
                            <div className={`card-body ${styles.cardBody}`}>
                                <p className={`card-title ${styles.cardTitle}`}>{!chat.isGroupChat? getSender(loggedUser, chat.users):chat.chatName}</p>
                                {chat.latestMessage && <p className={`card-subtitle text-body-secondary ${styles.cardsubTitle}`}></p>}
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    </div>
  )
}

export default ChatList