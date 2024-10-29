import React from 'react'
import { useState } from 'react';
import styles from './register.module.css'

function Register() {

  let registerForm = {
    name:"",
    emailId:"",
    password:"",
    confirmPassword:"",
    profile:"",
  };

  let registerError = {
    nameErr:"",
    emailErr:"",
    passwordErr:"",
    confirmPasswordErr:"",
    profileErr:"",
  }

  const [register, setRegister] = useState(registerForm);
  const [error, setError] = useState(registerError);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleChange=(e)=>{
    let name=e.target.name;
    let value =e.target.value;
    setRegister({...register,[name]:value});
  }

  const handleRegister=(e)=>{
    e.preventDefault();

    if(!register.emailId || !register.password || !register.name || !register.confirmPassword){
        !register.name?setError((err)=>({...err,nameErr:"Name cannot be empty"})):setError((err)=>({...err,nameErr:""}));
        !register.emailId?setError((err)=>({...err,emailErr:"Email Id cannot be empty"})):setError((err)=>({...err,emailErr:""}));
        !register.password?setError((err)=>({...err,passwordErr:"Password cannot be empty"})):setError((err)=>({...err,passwordErr:""}));
        !register.confirmPassword?setError((err)=>({...err,confirmPasswordErr:"Password cannot be empty"})):setError((err)=>({...err,confirmPasswordErr:""}));
    }
    else{
      console.log("Login success");
      console.log(login)
    }
  }

  const showHidePassword=()=>{
    setShowPass((showPass)=>!showPass);
  }

  const showHideConfirmPassword=()=>{
    setShowConfirmPass(showConfirmPass=>!showConfirmPass);
  }

  const handleName=()=>{
    !register.name?setError((err)=>({...err,nameErr:"Name cannot be empty"})):setError((err)=>({...err,nameErr:""}));
  }

  const handleEmail=()=>{
    !register.emailId?setError((err)=>({...err,emailErr:"Email Id cannot be empty"})):setError((err)=>({...err,emailErr:""}));
  }

  const handlePassword=()=>{
    !register.password?setError((err)=>({...err,passwordErr:"Password cannot be empty"})):setError((err)=>({...err,passwordErr:""}));
  }

  const handleConfirmPassword=()=>{
    !register.confirmPassword?setError((err)=>({...err,confirmPasswordErr:"Password cannot be empty"})):setError((err)=>({...err,confirmPasswordErr:""}));
  }

  return (
    <>
    <div className={`${styles.registerContainer} rounded-1`}>
      <ul className={`nav nav-pills nav-justified border ${styles.container}`}>
        <li className="nav-item">
          <a className="nav-link text-black" href="login">Login</a>
        </li>
        <li className="nav-item">
          <a className={`nav-link active ${styles.bgColor}`}  aria-current="page" href="#">Register</a>
        </li>
      </ul>
        <form className={`${styles.formContainer}`}>
            <div className ="form-group p-2">
                <label className="form-label">Name*</label>
                <input className={error.nameErr?`${styles.fieldBorderColor} form-control`:`form-control`} type="text" value={register.name} name="name" onChange={handleChange} onBlur={handleName}/>
                {error.nameErr && <div className={`${styles.errorFormField}`}>{error.nameErr}</div>}
            </div>
            <div className ="form-group p-2">
                <label className="form-label">Email Id*</label>
                <input className={error.emailErr?`${styles.fieldBorderColor} form-control`:`form-control`} type="email" value={register.emailId} name="emailId" onChange={handleChange} onBlur={handleEmail}/>
                {error.emailErr && <div className={`${styles.errorFormField}`}>{error.emailErr}</div>}
            </div>
            <div className ="form-group p-2">
                <label className="form-label">Password*</label>
                <input className={error.passwordErr?`${styles.fieldBorderColor} form-control`:`form-control`} type={showPass?"text":"password"} value={register.password} name="password" onChange={handleChange} onBlur={handlePassword}/>
                <i className={`bi bi-eye-fill ${styles.eyeFill}`} onClick = {showHidePassword}></i>
                {error.passwordErr && <div className={`${styles.errorFormField}`}>{error.passwordErr}</div>}
            </div>
            <div className ="form-group p-2">
                <label className="form-label">Confirm Password*</label>
                <input className={error.confirmPasswordErr?`${styles.fieldBorderColor} form-control`:`form-control`} type={showConfirmPass?"text":"password"} value={register.confirmPassword} name="confirmPassword" onChange={handleChange} onBlur={handleConfirmPassword}/>
                <i className={`bi bi-eye-fill ${styles.eyeFill}`} onClick = {showHideConfirmPassword}></i>
                {error.confirmPasswordErr && <div className={`${styles.errorFormField}`}>{error.confirmPasswordErr}</div>}
            </div>
            <div className ="form-group p-2">
                <label className="form-label">Upload Profile Photo*</label>
                <input className={error.profileErr?`${styles.fieldBorderColor} form-control form-control-md`:`form-control form-control-md`} type="file" value={register.profile} name="profile" onChange={handleChange}/>
                {error.profileErrr && <div className={`${styles.errorFormField}`}>{error.profileErr}</div>}
            </div>
            <br/>
            <div className ="form-group p-2">
                <button onClick={handleRegister} className={`btn text-white ${styles.registerBtn} rounded-0`}>Register</button>
            </div>
            <div className={`${styles.loginLink} p-1`}>Existing User? <a href="login">Login</a></div>
        </form>
    </div>
    </>
  )
}

export default Register