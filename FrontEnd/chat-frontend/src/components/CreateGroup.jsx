import React, { useEffect, useState } from 'react'
import styles from './creategroup.module.css'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import SearchStackLoader from './SearchStackLoader';
import { ChatState } from './context/ChatProvider';
const URL = import.meta.env.VITE_APP_URL

function CreateGroup({groupChatModal, setGroupChatModal}) {

    const [chatName, setChatName] = useState("");
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [modalErr, setModalErr] = useState("");
    const {user} = ChatState();
    const [searchList, setSearchList] = useState([]);
    const [createChatLoading, setCreateChatLoading] = useState(false);
    const [selectedSearchUsers, setSelectedSearchUsers] = useState([]);

    const closeGroup = () => {
        setGroupChatModal(false);
    }

    const handleChatName = (e) => {
        setChatName(e.target.value);
        setModalErr("");
    }

    const handleSearch=(e)=>{
        setModalErr("");
        setSearchList([]);
        setSearchText(e.target.value);
        if(searchText.length >= 1){
            searchUsers();
        }
    }

    const searchUsers=async()=>{
        setLoading(true);
        try{
            const response = await fetch(`${URL}api/user?search=${searchText}`,{
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
                setModalErr("")
                console.log(data);
                setSearchList(data.users);
                
            }
            else{
                const error = await response.text();
                throw new Error(`Error:${error}`);
            }
            console.log(searchList);
        }
        catch(err){
            console.log(String(err));
            // console.log(err);
            setLoading(false);
            setModalErr(String(err))
            setSearchList([]);
        }
    }

    const handleSelectedUsers = (user) => {
        setSelectedSearchUsers(users => [...users,user])
    }

    const createChat=()=>{
        if(!chatName){
            setModalErr("Chatname cannot be empty");
        }
        else if(selectedSearchUsers.length<3){
            setModalErr("Chat group should have minimum 3 users");
        }
        else{
            groupChat();
        }
    }

    const groupChat=()=>{
        setCreateChatLoading(true);
        try{

        }
        catch(err){
            console.log(String(err));
            setModalErr("Error occured while creating the chat");
            setCreateChatLoading(false);

        }
    }

  return (
    <div>
        <Modal show={groupChatModal} onHide={closeGroup} className={`${styles.groupmodal}`} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
            <Modal.Title>Create Group Chat</Modal.Title>
            </Modal.Header>
            <Modal.Body className={` ${styles.modalWidth}`}>
                <div className={``}>
                    <div className={` mb-3`}>
                        <input type="text" placeholder='Chat Name' className={`${styles.chatText}`} value={chatName} onChange={handleChatName}/>
                    </div>
                    <div className={`mb-3`}>
                         <input type="text" className={`${styles.searchBox}`} placeholder='Add user to group' value={searchText} onChange={handleSearch}/>
                
                        {searchText.length >= 1 && loading && 
                            <div className={`border ${styles.userSearchList} overflow-y-scroll`}>
                                <div><SearchStackLoader/></div>
                            </div>}
                        {searchText.length >= 1 && !loading && 
                            <div className={`border ${styles.userSearchList} overflow-y-scroll`}>
                                {searchList.map(user => (
                                    <div key={user._id} className={`${styles.searchUser}`} onClick={()=>handleSelectedUsers(user)}>
                                        <img src={user.profile} className={`${styles.userProfileImg}`}/> {user.name} ({user.email})
                                    </div>
                                ))}
                            </div>}
                    </div>
                    <div className={`mb-3 d-flex`}>
                        {selectedSearchUsers && selectedSearchUsers.map((user, index)=>(
                            <div key={index} className={`d-flex justify-content-between ${styles.users} rounded-1`}><span className={`${styles.userText}`}>{user.name}</span><div><i className={`bi bi-x ${styles.cancel}`}></i></div></div>
                        ))}
                    </div>
                </div>            
            
            </Modal.Body>
            <div>{modalErr && <div className={`${styles.errorFormField} px-3`}>{modalErr}</div>}</div>

            <Modal.Footer>
            <Button variant="primary" onClick={createChat}>
                {createChatLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                {!createChatLoading && <span>Create Chat</span>}
            </Button>
            
            </Modal.Footer>
        </Modal>
    </div>
  )
}

export default CreateGroup