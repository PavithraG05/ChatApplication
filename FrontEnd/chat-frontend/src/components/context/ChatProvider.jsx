import { createContext, useEffect } from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

export const ChatProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [chatList, setChatList] = useState([]);
    const [selectedChat, setSelectedChat] = useState();
    const [toast, setToast] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [notification, setNotification] = useState([]);
    // const [profileModal, setProfileModal] = useState(false);

    const navigate = useNavigate();

    useEffect(()=>{
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
        console.log(`chatcontext: ${JSON.stringify(userInfo)}`);
        if(!userInfo){
            navigate("/")
        }
    },[navigate])

    return(
        <ChatContext.Provider value={{user, setUser, chatList, setChatList,selectedChat, setSelectedChat, toast, setToast, admin, setAdmin, notification, setNotification}}>
            {children}
        </ChatContext.Provider>
    )
}

export const ChatState = () => {
  return useContext(ChatContext);
};