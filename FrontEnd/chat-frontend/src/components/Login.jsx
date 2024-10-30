import React from 'react'
import { useState } from 'react';
import styles from './login.module.css'
const URL=import.meta.env.VITE_APP_URL
import { useNavigate } from 'react-router-dom';

function Login() {

  let loginForm = {
    emailId:"",
    password:"",
  };

  let loginError = {
    emailErr:"",
    passwordErr:"",
    loginErr:"",
  }

  const [login, setLogin] = useState(loginForm);
  const [error, setError] = useState(loginError);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();

  const handleChange=(e)=>{
    let name=e.target.name;
    let value =e.target.value;
    setLogin({...login,[name]:value});
  }

  const handleLogin=(e)=>{
    e.preventDefault();

    if(!login.emailId || !login.password){
      !login.password?setError((err)=>({...err,passwordErr:"Password cannot be empty"})):setError((err)=>({...err,passwordErr:""}));
      !login.emailId?setError((err)=>({...err,emailErr:"Email Id cannot be empty"})):setError((err)=>({...err,emailErr:""}));
    }
    else{
      console.log("Login success");
      console.log(login)
      loginUser();
    }
  }

  const loginUser = async()=>{
    setLoading(true);
    try{
      const response = await fetch(`${URL}api/user/login`,{
        method:"post",
        headers:{
          "content-type":"application/json",
        },
        body:JSON.stringify({
          email:login.emailId,
          password:login.password,
        }),
      });
      if(response.ok){
        const data = await response.json();
        setLoading(false);
        setError({...error,loginErr:""})
        console.log(data);
        localStorage.setItem("userInfo",JSON.stringify(data));
        navigate("/chat");
        
      }
      else if(response.status==401){
        throw new Error(`Incorrect Username or Password`);
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
      setError({...error,loginErr:String(err)})
    }

  }

  const showHidePassword=()=>{
    setShowPass((showPass)=>!showPass);
  }

  const handleEmail=()=>{
    !login.emailId?setError({...error,emailErr:"Email Id cannot be empty"}):setError({...error,emailErr:""})
  }

  const handlePassword=()=>{
    !login.password?setError({...error,passwordErr:"Password cannot be empty"}):setError({...error,passwordErr:""})
  }

  return (
    <div className={`${styles.loginContainer} rounded-1`}>
      <ul className={`nav nav-pills nav-justified ${styles.container}`}>
        <li className="nav-item">
          <a className={`nav-link active ${styles.bgColor}`} aria-current="page" href="#">Login</a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-black" href="register">Register</a>
        </li>
      </ul>
      {/* <div className={`${styles.loginContainer} rounded-0`}> */}
      {/* <div className={`${styles.loginTitle} p-1`}>Login Form</div> */}
        <form className={`${styles.formContainer}`}>
          <div className ="form-group p-2">
            <label className="form-label">Email Id*</label>
            <input className={error.emailErr?`${styles.fieldBorderColor} form-control`:`form-control`} type="email" value={login.emailId} name="emailId" onChange={handleChange} onBlur={handleEmail}/>
            {error.emailErr && <div className={`${styles.errorFormField}`}>{error.emailErr}</div>}
          </div>
          <div className ="form-group p-2">
            <label className="form-label">Password*</label>
            <input className={error.passwordErr?`${styles.fieldBorderColor} form-control`:`form-control`} type={showPass?"text":"password"} value={login.password} name="password" onChange={handleChange} onBlur={handlePassword}/>
            <i className={`bi bi-eye-fill ${styles.eyeFill}`} onClick = {showHidePassword}></i>
            {error.passwordErr && <div className={`${styles.errorFormField}`}>{error.passwordErr}</div>}
          </div>
          <br/>
          <div className ="form-group p-2">
            <button onClick={handleLogin} className={`btn text-white ${styles.loginBtn} rounded-0`} disabled={loading}>
              {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
              {!loading && <span>Login</span>}
            </button>
            {error.loginErr && <div className={`${styles.errorFormField}`}>{error.loginErr}</div>}
          </div>
          <div className={`${styles.registerLink} p-1`}>New User? <a href="register">Register Now</a></div>
        </form>
      {/* </?div> */}
    </div>
  )
}

export default Login