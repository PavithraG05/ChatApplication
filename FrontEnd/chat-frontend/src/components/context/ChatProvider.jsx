import { createContext, useEffect } from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

export const ChatProvider = ({children}) => {

    const [user, setUser] = useState(null);
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
        <ChatContext.Provider value={{user, setUser}}>
            {children}
        </ChatContext.Provider>
    )
}

export const ChatState = () => {
  return useContext(ChatContext);
};