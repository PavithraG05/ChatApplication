import React from 'react'
import Login from './Login'
import { useNavigate } from 'react-router-dom';

function Home() {

  const navigate = useNavigate();

  useEffect(()=>{
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      console.log(userInfo);
      if(userInfo){
          navigate("/chats")
      }
  },[navigate])

  return (
    <>
      <div>ChatterBox</div>
      <Login/>
      <Register/>
    </>
    
  )
}

export default Home