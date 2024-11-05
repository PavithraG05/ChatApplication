import React from 'react'
import styles from './searchuserlist.module.css'

function SearchUserList({searchUser, accessOrCreateChat}) {
  return (
    <div onClick={()=>{accessOrCreateChat(searchUser._id)}}>
        <div className={`card mb-3 ${styles.cardwidth}`}>
            <div className="row g-0">
                <div className={`col-md-3 border py-1 px-1`}>
                    <img src={searchUser.profile} className={`img-fluid ${styles.cardimage}`} alt="..."/>
                </div>
                <div className={`${styles.cardcontent} col-md-9 card-body px-3`}>
                    <p className={`card-title ${styles.cardTitle} fw-bold`}>{searchUser.name}</p>
                    <p className={`card-text ${styles.cardTitle}`}>{searchUser.email}</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SearchUserList