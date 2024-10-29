import React from 'react'
import { useState } from 'react';
import styles from './login.module.css'

function Login() {

  let loginForm = {
    emailId:"",
    password:"",
  };

  let loginError = {
    emailErr:"",
    passwordErr:"",
  }

  const [login, setLogin] = useState(loginForm);
  const [error, setError] = useState(loginError);
  const [showPass, setShowPass] = useState(false);

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
            <button onClick={handleLogin} className={`btn text-white ${styles.loginBtn} rounded-0`}>Login</button>
          </div>
          <div className={`${styles.registerLink} p-1`}>New User? <a href="register">Register Now</a></div>
        </form>
      {/* </?div> */}
    </div>
  )
}

export default Login