import React from 'react'
import { useState } from 'react';
import styles from './register.module.css'
import {useNavigate} from 'react-router-dom'
const URL = import.meta.env.VITE_APP_URL;
;

function Register() {

  let registerForm = {
    name:"",
    emailId:"",
    password:"",
    confirmPassword:"",
    profile:undefined,
  };

  let registerError = {
    nameErr:"",
    emailErr:"",
    passwordErr:"",
    confirmPasswordErr:"",
    profileErr:"",
    registrationErr:"",
  }

  const [register, setRegister] = useState(registerForm);
  const [error, setError] = useState(registerError);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const navigate=useNavigate();


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
        !register.confirmPassword?setError((err)=>({...err,confirmPasswordErr:"Confirm Password cannot be empty"})):setError((err)=>({...err,confirmPasswordErr:""}));
    }
    else if(register.password !== register.confirmPassword){
      setError((err)=>({...err,confirmPasswordErr:"Password does not match"}))
    }
    else{
      console.log("Register success");
      console.log(register)
      registerUser();
    }
  }

  const registerUser=async()=>{

    console.log(URL);
    try{
      setProfileLoading(true)
      const response = await fetch(`${URL}api/user/register`, {
        method:"post",
        headers:{
          "content-type":"application/json",
        },
        body:JSON.stringify({
          name:register.name, 
          email:register.emailId, 
          password:register.password, 
          profile:register.profile,
        }),
      })
      
      if(!response.ok){
        const error = await response.text();
        throw new Error(`Error ${error}`);
      }
      const data = await response.json();
      setProfileLoading(false);
      setError(error=>({...error,registrationErr:""}));
      console.log(data);
      localStorage.setItem("userInfo",JSON.stringify(data));
      navigate("/chat");
    }
    catch(err){
      console.log(err);
      setProfileLoading(false);
      setError(error=>({...error,registrationErr:"Error registering user. Please try again."}));
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
    !register.confirmPassword?setError((err)=>({...err,confirmPasswordErr:"Confirm Password cannot be empty"})):setError((err)=>({...err,confirmPasswordErr:""}));
  }

  const handleProfile=(profilePic)=>{
    setProfileLoading(true);
    console.log(profilePic);
    console.log(profilePic.type);
    if(profilePic === undefined){
      setError((err)=>({...err,profileErr:"Please select an Image"}))
    }
    else{
      if(profilePic.type === "image/jpeg"||profilePic.type=== "image/png"||profilePic.type === "image/jpg"){
        const data = new FormData();
        data.append("file",profilePic);
        data.append("upload_preset","chat-app");
        data.append("cloud_name","doajvhxx2");

        const CLOUDINARY_URL=`https://api.cloudinary.com/v1_1/doajvhxx2/image/upload`;
        fetch(CLOUDINARY_URL,{
          method:"post",
          body:data,
        })
        .then(res=>res.json())
        .then((data)=>{
          console.log(data.url.toString());
          setRegister({...register, profile:data.url.toString()});
          setProfileLoading(false);
          setError((err)=>({...err,profileErr:""}))
        })
        .catch(err=>{
          console.log(err);
          setProfileLoading(false);
          setRegister({...register, profile:""});
          setError((err)=>({...err,profileErr:"Error occured while uploading image"}))
        }) 
      }
      else{
          setProfileLoading(false);
          setRegister({...register, profile:""});
          setError((err)=>({...err,profileErr:"Please upload image in .jpg/.png format"}))
      }
    }
  }

  return (
    <>
    <div className={`${styles.registerContainer} rounded-1`}>
      <ul className={`nav nav-pills nav-justified border ${styles.container}`}>
        <li className="nav-item">
          <a className="nav-link text-black" href="/">Login</a>
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
                <input className={error.profileErr?`${styles.fieldBorderColor} form-control form-control-md`:`form-control form-control-md`} type="file"  name="profile" onChange={(e)=>handleProfile(e.target.files[0])}/>
                {error.profileErr && <div className={`${styles.errorFormField}`}>{error.profileErr}</div>}
            </div>
            <br/>
            <div className ="form-group p-2">
                <button onClick={handleRegister} className={`btn text-white ${styles.registerBtn} rounded-0`} disabled={profileLoading}>
                  {profileLoading && (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  )}
                  {!profileLoading && (
                    <span>Register</span>
                  )}
                </button>
                {error.registrationErr && <div className={`${styles.errorFormField}`}>{error.registrationErr}</div>}
            </div>
            <div className={`${styles.loginLink} p-1`}>Existing User? <a href="/">Login</a></div>
        </form>
    </div>
    </>
  )
}

export default Register