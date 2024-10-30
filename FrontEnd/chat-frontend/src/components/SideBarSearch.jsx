import React from 'react'
import { useState } from 'react'
import styles from './sidebarsearch.module.css'
// import { ChatState } from './context/ChatProvider';

function SideBarSearch({offCanvas, toggleOffcanvas}) {

    const {searchtext, setSearchtext} = useState("");
    

    const handleSearch=(e) =>{
        setSearchtext(e.target.value)
    }

    const searchUser=()=>{

    }

  return (
    <div>
        <div className={`offcanvas offcanvas-start ${styles.offcanvasWidth} ${offCanvas ? 'show' : ''}`}  tabIndex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel" style={{ visibility: offCanvas ? 'visible' : 'hidden' }}>
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">Search Users</h5>
                <button type="button" className="btn-close" onClick={toggleOffcanvas} aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                <div className="row">
                    <div className="col-8">
                        <input type="search" placeholder="search by name or email" className={`${styles.formSearch}`} value={searchtext} onChange={handleSearch}/>
                    </div>
                    <div className="col-4">
                        <button onClick={searchUser} className={`${styles.searchBtn}`}><b>Search</b></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SideBarSearch