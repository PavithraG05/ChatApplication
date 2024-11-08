import React,{useEffect, useState} from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import styles from './groupmodal.module.css';
import { ChatState } from './context/ChatProvider';
import SearchStackLoader from './SearchStackLoader';
const URL = import.meta.env.VITE_APP_URL;

function GroupModal({groupModal, setGroupModal, selectedChat, fetchAgain, setFetchAgain}) {

    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchErr, setSearchErr] = useState("");
    const {user, setSelectedChat, admin} = ChatState();
    const [searchList, setSearchList] = useState([]);
    // const [selectedSearchUsers, setSelectedSearchUsers] = useState([]);
    const [modalErr, setModalErr] = useState("");
    const [chatupdateLoading, setChatupdateLoading] = useState(false);
    const [updateChat, setUpdateChat] = useState("");
    const [updateChatErr, setUpdateChatErr] = useState("");
    const [updateChatSuccess, setUpdateChatSuccess] = useState("");
    const [removeUserMsg, setRemoveUserMsg] = useState("");
    const [leaveUserLoading, setLeaveUserLoading] = useState(false);

    let timeout;

    useEffect(()=>{
        setModalErr("");
        setSearchErr("");
        setSearchList([]);
        setUpdateChatErr("");
        setUpdateChatSuccess("");
        setUpdateChat("");
        setSearchText("");
        setRemoveUserMsg("");
    },[groupModal])

    useEffect(()=>{
        if(searchText){
            if(searchText.length >= 2){
                searchUsers();
            }
            else{
                setSearchErr("Enter minimum 2 characters to search.")
            }
        }
    },[searchText]) 

    const closeGroupModal=()=>{
        setGroupModal(false);
    }

    const handleSearch=(e)=>{
        
        
        setModalErr("");
        setSearchErr("");
        setSearchList([]);
        setSearchText(e.target.value);
    }

    const handleSelectedUsers = async(selectUser) => {
        // console.log(selectedChat.users)
        // console.log(user);
        if(selectedChat.users.some(singleuser => singleuser._id === selectUser._id)){
            setModalErr("User already exist in the group")
            return
        }
        else{
            try{
                const response = await fetch(`${URL}api/chat/group/addmembers`,{
                    method:"put",
                    headers:{
                        "content-type":"application/json",
                        "Authorization":`Bearer ${user.token}`,
                    },
                    body:JSON.stringify({
                        chatId:selectedChat._id,
                        userId:selectUser._id,
                    })
                });

                if(!response.ok){
                    const error = "Error adding users to group chat";
                    throw new Error(`error:${error}`);
                }
                setSelectedChat({...selectedChat,users:[...selectedChat.users,selectUser]})
                setFetchAgain(!fetchAgain);
                setModalErr("");
            }
            catch(err){
                console.log(String(err));
                setModalErr(String(err));

            }
        }
        
    }

    const searchUsers=async()=>{
        console.log(searchText);
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
                setSearchErr("")
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
            setSearchErr(String(err))
            setSearchList([]);
        }
    }

    const updateChatName = async() => {
        if(!updateChat){
            setUpdateChatErr("Enter chat name to update");
            return
        }
        
        setChatupdateLoading(true)
        try{
            const response = await fetch(`${URL}api/chat/group`,{
                method: "put",
                headers:{
                    "content-type":"application/json",
                    "Authorization":`Bearer ${user.token}`,
                },
                body:JSON.stringify({
                    chatId: selectedChat._id,
                    chatName: updateChat,
                }),
            });

            if(!response.ok){
                const error=await response.text();
                throw new Error(`error: ${error}`);
            }

            const data = await response.json();
            setSelectedChat({...selectedChat, chatName:updateChat});
            setChatupdateLoading(false);
            setUpdateChatSuccess("Group chatname updated successfully")
            setUpdateChatErr("");
            setFetchAgain(!fetchAgain);
        }
        catch(err){
            console.log(String(err));
            setChatupdateLoading(false);
            setUpdateChatErr(String(err));
        }
    }

    const removeUser = async(removeuser) => {
        try{
            const response = await fetch(`${URL}api/chat/group/remmembers`,{
                method:"put",
                headers:{
                    "content-type":"application/json",
                    "Authorization":`Bearer ${user.token}`,
                },
                body:JSON.stringify({
                    chatId: selectedChat._id,
                    userId: removeuser._id,
                }),
            });

            if(!response.ok){
                const error = await response.text();
                throw new Error(`error: ${error}`);
            }

            const data = await response.json();
            //remove user logic yet to be written
            let updatedSelectedUserList = selectedChat.users.filter(singleuser => singleuser._id !== removeuser._id);
            setSelectedChat({...selectedChat,users:updatedSelectedUserList})
            setRemoveUserMsg(`User: ${removeuser.name} removed from the group.`)
            setFetchAgain(!fetchAgain);
            setModalErr("");

        }
        catch(err){
            console.log(String(err));
            setModalErr("")
        }
    }
    
    const handleUpdateChatName = (e) => {
        setUpdateChat(e.target.value);
        setUpdateChatSuccess("");
        setUpdateChatErr("");
    }

    const handleLeaveGroup = async() => {
        setLeaveUserLoading(true);
        try{
            const response = await fetch(`${URL}api/chat/group/remmembers`,{
                method:"put",
                headers:{
                    "content-type":"application/json",
                    "Authorization":`Bearer ${user.token}`,
                },
                body:JSON.stringify({
                    chatId: selectedChat._id,
                    userId: user._id,
                }),
            });

            if(!response.ok){
                const error = "error occured while leaving the group";
                throw new Error(`error: ${error}`);
            }

            const data = await response.json();
            setLeaveUserLoading(false);
            setModalErr("");
            setFetchAgain(!fetchAgain);
            setSelectedChat();
            setGroupModal(false);
        }
        catch(err){
            console.log(String(err));
            setModalErr(String(err));
            setLeaveUserLoading(false);
            setGroupModal(false);
        }
    }

  return (
    <Modal show={groupModal} onHide={closeGroupModal} className={`${styles.profilemodal}`} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedChat.chatName}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={` ${styles.modalWidth}`}>
            <div className={`mb-3`}>
                <div  className={` d-flex flex-wrap`}>
                
                    {selectedChat.users.map((user, index) => (
                    <div key={index} className={`d-flex ${styles.users} justify-content-between rounded-1`}>
                        {admin && selectedChat.groupAdmin._id !== user._id && 
                        <React.Fragment>
                        <span className={`${styles.userText}`}>{user.name}</span>
                        <div>
                            <i className={`bi bi-x ${styles.cancel}`} onClick={()=>removeUser(user)}></i>
                        </div>
                        </React.Fragment>
                        }

                        {selectedChat.groupAdmin._id === user._id && 
                        <>
                        <span className={`${styles.userAdminText}`}>{user.name} (Admin)</span>
                        </>
                        }
                        {!admin && selectedChat.groupAdmin._id !== user._id &&
                        <>
                        <span className={`${styles.userAdminText}`}>{user.name}</span>
                        </>
                        }
                    </div>
                    ))}
                
                </div>
                {removeUserMsg && <div className={`${styles.removeUserText}`}>{removeUserMsg}</div>}

            </div>

            <div className={`row mb-3`}>
                <div className={`col-9`}>

                    <input type="text" className={`${styles.chatnameBox}`} placeholder="Enter Chat name..." value={updateChat} onChange={handleUpdateChatName}/>
                    {updateChatErr && <div className={`${styles.errorFormField}`}>{updateChatErr}</div>}
                    {updateChatSuccess && <div className={`${styles.formField}`}><i className={`bi bi-check-circle-fill ${styles.check}`}></i>{updateChatSuccess}</div>}

                </div>
                <div className={`col-3 text-end`}>
                    <button className={`${styles.updatebtn} rounded-0`} onClick={updateChatName} disabled={loading}>
                        {chatupdateLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                        {!chatupdateLoading && <span>Update</span>}
                    </button>
                </div>
            </div>
            {admin &&<div>
                
                <input type="text" className={`${styles.searchBox}`} placeholder='Add user to group' value={searchText} onChange={handleSearch}/>
                
                    {searchText.length > 1 && loading && 
                        <div className={`border ${styles.userSearchList} overflow-y-scroll`}>
                            <div><SearchStackLoader/></div>
                        </div>}
                    {searchText.length > 1 && !loading && 
                        <div className={`border ${styles.userSearchList} overflow-y-scroll`}>
                            {searchList.map(user => (
                                <div key={user._id} className={`${styles.searchUser}`} onClick={()=>handleSelectedUsers(user)}>
                                    <img src={user.profile} className={`${styles.userProfileImg}`}/> {user.name} ({user.email})
                                </div>
                            ))}
                            {/* {searchList.length===0 && <div>No results found</div>} */}
                        </div>
                    }
            </div> }           
        
        </Modal.Body>
        <div>{modalErr && <div className={`${styles.errorFormField} px-3`}>{modalErr}</div>}</div>
        <div>{searchErr && <div className={`${styles.errorFormField} px-3`}>{searchErr}</div>}</div>
        {!admin && <div className={`${styles.note}`}><span className={`${styles.noteText}`}>Note: if you leave the group, you will no longer be participant of the group</span></div>}
        {/* {admin && <div className={`${styles.note}`}><span className={`${styles.noteText}`}>Note: Since you are admin, leaving the group will delete the group as well.</span></div>} */}
        <Modal.Footer>
        {admin && <Button variant="danger" onClick={closeGroupModal}>
            <span>Leave and Delete Group</span>
        </Button>
        }
        {!admin && <Button variant="danger" onClick={handleLeaveGroup}>
          {leaveUserLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
          {!leaveUserLoading && <span>Leave Group</span>}
        </Button>
        }
        
        </Modal.Footer>
    </Modal>
  )
}

export default GroupModal