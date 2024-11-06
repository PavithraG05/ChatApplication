import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import styles from './home.module.css';

function Home() {

  const [tab, setTab] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      console.log(`Home: ${userInfo}`);
      if(userInfo){
          navigate("/chat")
          console.log("user info retrieved from local storage");
      }
      if(!userInfo){
        console.log("userinfo not present in local storage")
        navigate("/")
      }
  },[navigate])

  return (
    <>
      <div className={`${styles.loginContainer} rounded-1`}>
        <ul className={`nav nav-pills nav-justified ${styles.container}`}>
          <li className="nav-item">
            <button className={`nav-link ${tab ? 'text-black':`active ${styles.bgColor}`}`} aria-current="page" onClick={()=>setTab(!tab)}>Login</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${tab ?`active ${styles.bgColor}`:'text-black'}`}  onClick={()=>setTab(!tab)}>Register</button>
          </li>
        </ul>

        {tab && <Register/>}
        {!tab && <Login/>}
      </div>

    </>
    
  )
}

export default Home