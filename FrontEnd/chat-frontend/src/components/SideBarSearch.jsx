import React from 'react'
import { useState, useEffect } from 'react'
import styles from './sidebarsearch.module.css'
import { ChatState } from './context/ChatProvider';
import StackLoader from './StackLoader';
import SearchUserList from './SearchUserList';
import { Toast } from 'bootstrap/dist/js/bootstrap.bundle.min';
import ToastMsg from './ToastMsg';
const URL=import.meta.env.VITE_APP_URL

function SideBarSearch({offCanvas, toggleOffcanvas}) {

    const [searchtext, setSearchtext] = useState("");
    const [searchErr, setSearchErr] = useState("");
    const {user, chatList, setChatList, selectedChat, setSelectedChat, toast, setToast} = ChatState();
    const [searchList, setSearchList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [accessChatLoading, setAccessChatLoading] = useState(false);
    let msg=""; 

    useEffect(()=>{
        setSearchErr("");
       
    },[offCanvas])

    const handleSearch=(e) =>{
        setSearchErr("");
        setSearchtext(e.target.value);
        setSearchList([]);
        if(searchtext.length>=2){
            searchUser();
        }
    }

    const searchUser=()=>{
        if(!searchtext){
            setSearchErr("Please enter something in search")
        }
        else{
            fetchUsersList();
        }
    }

    const fetchUsersList = async() => {

        console.log(typeof searchtext);
        console.log(typeof user.token)
        setLoading(true);
        try{
            const response = await fetch(`${URL}api/user?search=${searchtext}`,{
                method:"get",
                headers:{
                "Content-Type":"application/json; charset=utf-8",
                "Authorization":`Bearer ${user.token}`,
                },
            });

            if(response.ok){
                // console.log(response.ok)
                // console.log(await response.json());
                const data = await response.json();

                setLoading(false);
                setSearchErr("")
                console.log(data);
                setSearchList(data.users);
               
            }
            else{
                const error = await response.text();
                throw new Error(`Error:${error}`);
            }
            
        }
        catch(err){
        console.log(String(err));
        // console.log(err);
        setLoading(false);
        setSearchErr(String(err))
        setSearchList([]);
        }
    }

    const accessOrCreateChat=async(userId)=>{
        setAccessChatLoading(true);
        try{
            const response = await fetch(`${URL}api/chat`,{
                method: "post",
                headers: {
                    "content-type":"application/json",
                    "Authorization":`Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    userId: userId,
                })
            });

            if(response.ok){
                const data = await response.json();
                console.log(data);
                if(!chatList.find((chat) => chat._id === data._id)){
                    setChatList((data)=>[data,...chatList])
                }
                setSelectedChat(data);
                setAccessChatLoading(false);
                console.log(chatList);
                console.log(selectedChat);
            }
            else{
                const error = await response.text();
                throw new Error(`Error: ${error}`);
            }
        }
        catch(error){
            console.log(String(error));
            setAccessChatLoading(false);
            setToast(true);
            msg= "Error fetching chats via API";
        }
    }

  return (
    <div>
        <div className={`offcanvas offcanvas-start ${styles.offcanvasWidth} ${offCanvas ? 'show' : ''}`}  tabIndex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel" style={{ visibility: offCanvas ? 'visible' : 'hidden' }}>
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">Search Users</h5>
                <button type="button" className="btn-close" onClick={toggleOffcanvas} aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                <div className="row gx-0">
                    <div className={`col-9`}>
                        <input type="text" placeholder="search by name or email" className={`${styles.formSearch}`} value={searchtext} onChange={handleSearch}/>
                    </div>
                    <div className={`col-3`}>
                        <button onClick={searchUser} className={`${styles.searchBtn}`}><b>Search</b></button>
                    </div>
                    {searchErr && <div  className={`${styles.errorFormField}`}>{searchErr}</div>}
                    {loading &&<StackLoader/>}
                    <div className={`${styles.cards}`}>
                        {searchList && searchList.map(searchUser=>(
                           <SearchUserList key={searchUser._id} searchUser={searchUser} accessOrCreateChat={accessOrCreateChat}/> 
                        ))}
                    </div>
                </div>
            </div>
        </div>
        {toast && <ToastMsg msg={msg}/>}
    </div>
  )
}

export default SideBarSearch