import React, { useState, useEffect } from 'react'
import styles from './chatlist.module.css'
import { ChatState } from './context/ChatProvider';
import StackLoader from './StackLoader';
import { getSender } from './getSender';
import CreateGroup from './CreateGroup';
const URL = import.meta.env.VITE_APP_URL

function ChatList({fetchAgain}) {

    const [loading, setLoading] = useState(false);
    const [loggedUser, setLoggedUser] = useState();
    const [chatListApiErr, setChatListApiErr] = useState("");
    const {user, chatList, setChatList, selectedChat, setSelectedChat, setAdmin} = ChatState();
    const [groupChatModal, setGroupChatModal] = useState(false);
    

    useEffect(()=>{
        console.log("Fetching all chats of an user")
        fetchAllChats()
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    },[fetchAgain])

    useEffect(()=>{
        console.log(selectedChat);
        console.log(typeof selectedChat);
        if(selectedChat && selectedChat.isGroupChat){
            // console.log('admin');
            if(selectedChat.groupAdmin._id === user._id){
                setAdmin(true);
                console.log("logged in user is admin");
            }
            else{
                setAdmin(false);
                console.log("logged in user is not the admin");
            }
        }
    },[selectedChat])

    const fetchAllChats=async()=>{
        setLoading(true);
        setChatListApiErr("");
        console.log(`LoggedUserDetails from ChatList: ${JSON.stringify(loggedUser)}`);
        console.log(`UserDetails from ChatList: ${JSON.stringify(user)}`);
        try{
            const response = await fetch(`${URL}api/chat/`,{
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

    const invokeCreateChat=()=>{
        setGroupChatModal(true);
        console.log(groupChatModal);
    }

    const handleSelectedChat=(chat)=>{
        setSelectedChat(chat);
    }

  return (
    <div className={`border bg-light`}>
        <div className={`container py-3 ${styles.chatContainer}`}>
            <div className={`row px-1`}>
                <div className={`col-4`}>
                    <h6 className={`${styles.chatTitle}`}>My Chats</h6>
                </div>
                <div className={`col-8 text-end`}>
                    <button className={`btn btn-sm rounded-1 ${styles.groupBtn}`} onClick={invokeCreateChat}><i className="bi bi-plus-square" ></i>&nbsp; Group Chat</button>
                </div>
            </div>
            <hr className={`mb-1`}/>
            {loading && <StackLoader/>}
            {chatListApiErr && <div>{chatListApiErr}</div>}
            <div className={`${styles.chatListDiv}  overflow-y-scroll`}>
                
                {chatList && chatList.map(chat =>(
                    
                    <div key={chat._id} className={`${styles.cardList}`}>
                        <div className={`card border border-danger rounded-1 ${styles.cardone} ${chat === selectedChat?`text-red ${styles.cardBg}`:""}`} onClick={()=>handleSelectedChat(chat)}>
                            <div className={`card-body ${styles.cardBody}`}>
                                <p className={`card-title ${styles.cardTitle}`}>{!chat.isGroupChat? getSender(loggedUser, chat.users):chat.chatName}</p>
                                {chat.latestMessage && <p className={`card-subtitle text-body-secondary ${styles.cardsubTitle}`}></p>}
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>
        {groupChatModal && <CreateGroup groupChatModal={groupChatModal} setGroupChatModal={setGroupChatModal}/>}
    </div>
  )
}

export default ChatList