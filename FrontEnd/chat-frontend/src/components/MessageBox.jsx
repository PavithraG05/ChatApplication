import React,{useState, useEffect} from 'react'
import styles from './messagebox.module.css'
import { ChatState } from './context/ChatProvider';
import { getSender, getSenderDetails } from './getSender';
import ProfileModal from './ProfileModal';
import GroupModal from './GroupModal';
import Messages from './Messages';
const URL = import.meta.env.VITE_APP_URL;

function MessageBox({fetchAgain, setFetchAgain}) {

    const {user, selectedChat} = ChatState();
    const [profileModal, setProfileModal] = useState(false);
    // const [profileModal, setProfileModal] = useState();
    const [groupModal, setGroupModal] = useState(false);
    const [messageList, setMessageList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [messageErr, setMessageErr] = useState("");
   
    useEffect(()=>{
        fetchMessages();
    },[selectedChat])

    const handleProfile=()=>{
        setProfileModal(true);
        console.log(getSenderDetails(user, selectedChat.users));
    }

    const handleGroupProfile=()=>{
        setGroupModal(true);
    }

    const sendMessage = async(event) => {
        if(event.key === "Enter" && newMessage){
            setLoading(true);
            try{
                setNewMessage("");
                const response = await fetch(`${URL}api/message`,{
                    method: "post",
                    headers:{
                        "content-type":"application/json",
                        "Authorization":`Bearer ${user.token}`,
                    },
                    body:JSON.stringify({
                        content: newMessage,
                        chatId: selectedChat._id,
                    })
                });

                if(!response.ok){
                    const error = await response.text();
                    throw new Error(`error: ${error}`);
                }

                const data = await response.json();
                setLoading(false);
                setMessageList([...messageList, data]);
                console.log(data);
                setMessageErr("")
            }
            catch(err){
                console.log(String(err));
                setLoading(false);
                setMessageErr("Error occured while sending message");
            }
        }
    }

    const typingHandler = (e) => {
       setNewMessage(e.target.value);

    }

    const fetchMessages = async() => {
        if(!selectedChat){
            return
        }
        setLoading(true);
        try{
            const response = await fetch(`${URL}api/message/${selectedChat._id}`,{
                method:"get",
                headers:{
                    "content-type":"application/json",
                    "Authorization":`Bearer ${user.token}`,
                },
                
            });

            if(!response.ok){
                const error = await response.text();
                throw new Error(`error: ${error}`);
            }

            const data = await response.json();
            console.log(data);
            setLoading(false);
            setMessageList(data);

        }
        catch(err){
            console.log(String(err));
            setLoading(false);
        }
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
                    {loading && <div className={`${styles.spinnerContainer}`}><div className={`spinner-border spinner-border-xl ${styles.spinner}`} role="status" aria-hidden="true"></div></div>}
                    {!loading && <><div className={`${styles.messageArea}`}>
                        <div className={`border `} ><Messages messageList={messageList}/></div>
                    </div>
                    <div className={`${styles.chatBox} rounded-1`}>
                        <form onKeyDown={sendMessage}><input type="text" placeholder='Enter a message...' className={`${styles.chatTextBox} rounded-2`} value={newMessage} onChange={typingHandler}/></form>
                        {messageErr && <div className={`${styles.errorFormField}`}>{messageErr}</div>}
                    </div></>}
                    
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
        {groupModal && <GroupModal groupModal={groupModal} setGroupModal={setGroupModal} selectedChat={selectedChat} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
    </div>
  )
}

export default MessageBox