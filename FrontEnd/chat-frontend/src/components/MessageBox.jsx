import React,{useState, useEffect} from 'react'
import styles from './messagebox.module.css'
import { ChatState } from './context/ChatProvider';
import { getSender, getSenderDetails } from './getSender';
import ProfileModal from './ProfileModal';
import GroupModal from './GroupModal';
import Messages from './Messages';
import Lottie from 'react-lottie'
import animationData from "../animation/typing.json";
const URL = import.meta.env.VITE_APP_URL;

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;
import io from 'socket.io-client'

function MessageBox({fetchAgain, setFetchAgain}) {

    const {user, selectedChat, notification, setNotification} = ChatState();
    const [profileModal, setProfileModal] = useState(false);
    // const [profileModal, setProfileModal] = useState();
    const [groupModal, setGroupModal] = useState(false);
    const [messageList, setMessageList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [messageErr, setMessageErr] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typing, setTyping] = useState(false);
   
    useEffect(()=>{
        fetchMessages();
        selectedChatCompare = selectedChat;
    },[selectedChat])
    
    useEffect(() => {
      socket = io(ENDPOINT);
      socket.on("connected",()=>setSocketConnected(true));   
      socket.emit("setup",user);
      socket.on("typing",()=>setIsTyping(true))
      socket.on("stop typing",()=>setIsTyping(false));
    }, [])

    useEffect(()=>{
        socket.on("message recieved",(newMessageRecieved)=>{
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
                if(!notification.includes(newMessageRecieved)){
                    setNotification([newMessageRecieved,...notification]);
                    setFetchAgain(!fetchAgain);
                }
            }
            else{
                setMessageList([...messageList, newMessageRecieved]);
            }
        })
    })

    console.log(notification)

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
        },
    };

    const handleProfile=()=>{
        setProfileModal(true);
        console.log(getSenderDetails(user, selectedChat.users));
    }

    const handleGroupProfile=()=>{
        setGroupModal(true);
    }

    const sendMessage = async(event) => {
        if(event.key === "Enter" && newMessage){
            socket.emit("stop typing",selectedChat._id);
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
                socket.emit("new message",data);
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
        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
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
            socket.emit("join chat",selectedChat._id);
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
                    {!loading && <>
                    <div className={`${styles.messageArea} overflow-y-scroll`}>
                        <div className={` `} ><Messages messageList={messageList}/></div>
                    </div>
                    <div className={`${styles.chatBox} rounded-1`}>
                        {isTyping ? (
                            <div>
                                <Lottie
                                    options={defaultOptions}
                                    // height={50}
                                    width={60}
                                    style={{ marginBottom: 15, marginLeft: 0 }}
                                />
                            </div>
                            ) : (<></>)
                        }
                        {messageErr && <div className={`${styles.errorFormField}`}>{messageErr}</div>}
                        <form onKeyDown={sendMessage}><input type="text" placeholder='Enter a message...' className={`${styles.chatTextBox} rounded-2`} value={newMessage} onChange={typingHandler}/></form>
                        
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