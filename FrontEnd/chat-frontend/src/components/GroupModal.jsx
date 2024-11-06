import React,{useState} from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import styles from './groupmodal.module.css';
import { ChatState } from './context/ChatProvider';
const URL = import.meta.env.VITE_APP_URL;

function GroupModal({groupModal, setGroupModal, selectedChat}) {

    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchErr, setSearchErr] = useState("");
    const {user} = ChatState();
    const [searchList, setSearchList] = useState([]);
     
    const closeGroupModal=()=>{
        setGroupModal(false);
    }

    const handleSearch=(e)=>{
        setSearchErr("");
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

  return (
    <Modal show={groupModal} onHide={closeGroupModal} className={`${styles.profilemodal}`} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedChat.chatName}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={` ${styles.modalWidth}`}>
            <div  className={`mb-3 d-flex`}>
                {selectedChat.users.map(user => (
                <div className={`d-flex justify-content-between ${styles.users} rounded-1`}><span className={`${styles.userText}`}>{user.name}</span><div><i className={`bi bi-x ${styles.cancel}`}></i></div></div>
                ))}
            </div>
            <div className={`row mb-3`}>
                <div className={`col-9`}>
                    <input type="text" className={`${styles.chatnameBox}`} placeholder="Enter Chat name..."/>
                </div>
                <div className={`col-3 text-end`}>
                    <button className={`${styles.updatebtn} rounded-0`}>Update</button>
                </div>
            </div>
            <div >
                <input type="text" className={`${styles.searchBox}`} placeholder='Add user to group' value={searchText} onChange={handleSearch}/>
                
                    {searchText.length >= 1 && loading && 
                        <div className={`border ${styles.userSearchList} overflow-y-scroll`}>
                            <div>Loading</div>
                        </div>}
                    {searchText.length >= 1 && !loading && 
                        <div className={`border ${styles.userSearchList} overflow-y-scroll`}>
                            {searchList.map(user => (
                                <div key={user._id} className={`${styles.searchUser}`}>
                                    <img src={user.profile} className={`${styles.userProfileImg}`}/> {user.name} ({user.email})
                                </div>
                            ))}
                        </div>}
                
            </div>            
           
        </Modal.Body>
        <Modal.Footer>
        
        <Button variant="danger" onClick={closeGroupModal}>
            Leave Group
        </Button>
        
        </Modal.Footer>
    </Modal>
  )
}

export default GroupModal