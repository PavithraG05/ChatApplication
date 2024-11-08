import React, { useEffect } from 'react'
import styles from "./chatheader.module.css"
import { useState } from 'react'
import SideBarSearch from './SideBarSearch'
import { ChatState } from './context/ChatProvider'
// import UserProfileModal from './UserProfileModal'
import { useNavigate } from 'react-router-dom'
import ProfileModal from './ProfileModal'

function ChatHeader() {

    const [offCanvas, setOffcanvas] = useState(false)
    const {user, setChatList } = ChatState();
     const [profileModal, setProfileModal] = useState(false);
    const navigate = useNavigate();

    const toggleOffcanvas = () => {
        setOffcanvas(offCanvas=>!offCanvas)
    }

    // useEffect(()=>{
    //     console.log(`Printing user details obtained from localstorage: ${JSON.stringify(user)}`);
    // })

    const handleProfile = () => {
        setProfileModal(true);
        console.log(profileModal)
    };
    
    const logout = () => {
        localStorage.removeItem("userInfo");
        navigate('/');
        setChatList([]);
    };

  return (
    <div>
        <nav className="navbar bg-body-tertiary">
            <div className={`container-fluid ${styles.containerNav}`}>
            <form className={`d-flex ${styles.form}`}>
                <button className={`btn ${styles.searchBtn}`} type="button" onClick={toggleOffcanvas} aria-controls="offcanvasExample"><b><i className="bi bi-search"></i></b> &nbsp; <b>Search User</b></button>
            </form>
            <div>
                <a className="navbar-brand align-center" href="/"><img className={`${styles.chatIconSize}`} src="chaticon.png"></img>&nbsp;<img className={`${styles.chatterBoxlogo}`} src="texticon.png"></img></a>
            </div>
            <div className={`d-flex ${styles.notificationProfile}`}>
                <div>
                    <button className={`btn ${styles.notifcationBtn}`} type="button" ><i className={`${styles.notification} bi bi-bell-fill`}></i></button>
                </div>
                <div className="dropdown-center">
                    <button className={`btn ${styles.avatarBtn} dropdown-toggle`} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src={user.profile} className={`${styles.avatar}`}></img>
                        {/* <i className={`bi bi-caret-down-fill ${styles.dropdown}`}></i> */}
                    </button>
                    <ul className={`dropdown-menu dropdown-menu-end ${styles.dropdownList} rounded-0`}>
                        <li><button className={`dropdown-item ${styles.listItem}`} onClick={handleProfile}>My Profile</button></li>
                        {/* <hr/> */}
                        {/* <li><hr className={`dropdown-divider`}/></li> */}
                        <li><button className={`dropdown-item ${styles.listItem}`} onClick={logout}>Logout</button></li>
                    </ul>
                </div>
            </div>
            </div>
        </nav>
        {profileModal && <ProfileModal profileModal={profileModal} setProfileModal={setProfileModal} user={user}/>}
        <SideBarSearch offCanvas={offCanvas} toggleOffcanvas={toggleOffcanvas}/>
    </div>
  )
}

export default ChatHeader