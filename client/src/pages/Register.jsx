import { useState } from "react";
import {useDispatch} from "react-redux"
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createAccount } from "../Redux/authSlice";

function Register(){


    const dispatch = useDispatch()
    const navigate = useNavigate()


const [registerData , setRegisterData] = useState({
    fullName:"",
    userName:"",
    phoneNo:"",
    email:"",
    password:"",
    avatar :"", 
})


function handleUserInput(e){
    const {name,value} = e.target;

    setRegisterData({
        ...registerData,
        [name]:value 
    })
}

// function to handle the image upload
function getImage(e){
    e.preventDefault()

    const uploadedImage = e.target.files[0]

    if(uploadedImage){
        setRegisterData({
            ...registerData,
            avatar:uploadedImage 
        })
    }
}


function handleRegister(e){
    e.preventDefault()

    if(!registerData.avatar || !registerData.email || !registerData.password || !registerData.password){
        toast.error("Please fill all the fields")
        return;
    }

     // checking the name field length
if (registerData.fullName.length < 5) {
    toast.error("Name should be atleast of 5 characters");
    return;
  }


  if(!registerData.email.match( /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
    toast.error("Invalid email id ")
  }

  if (!registerData.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)) {
    toast.error(
      "Minimum password length should be 8 with Uppercase, Lowercase, Number and Symbol"
    );
    return;
  }

  // creating the form data from the existing data
  const formData = new FormData();
  formData.append("fullName",registerData.fullName)
  formData.append("email",registerData.email)
  formData.append("password",registerData.password)
  formData.append("avatar",registerData.avatar)
  formData.append("userName",registerData.userName)
  formData.append("phoneNo",registerData.phoneNo)

  dispatch(createAccount(formData)).then(()=>navigate("/"));

}

    return(
        <div className="right">
        <div className="card">
          <img src="insta.png" alt="Instagram Logo" className="logo" />
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Email address"
              className="input-field"
              name="email"
              value={registerData.email}
              onChange={handleUserInput}
            />

<input
              type="text"
              placeholder="Fullname"
              className="input-field"
              name="fullName"
              value={registerData.fullName}
              onChange={handleUserInput}
            />

<input
              type="text"
              placeholder="Username"
              className="input-field"
              name="userName"
              value={registerData.userName}
              onChange={handleUserInput}
            />

<input
              type="text"
              placeholder="PhoneNo"
              className="input-field"
              name="phoneNo"
              value={registerData.phoneNo}
              onChange={handleUserInput}
            />





            <input type="password" placeholder="Password" className="input-field" name="password" value={registerData.password} onChange={handleUserInput} />
            
            <input
            onChange={getImage}
            type="file"
            id="image_uploads"
            name="image_uploads"
            accept=".jpg, .jpeg, .png"
          />


            <button type="submit" className="login-btn">
              Log in
            </button>
          </form>
          <div className="separator">OR</div>
          <button className="facebook-login-btn">Log in with Facebook</button>
          <a href="#" className="forgot-password">
            Forgotten your password?
          </a>
        </div>
        <div className="signup">
          <span>
            Don't have an account? <a href="#">Sign up</a>
          </span>
        </div>
        
        </div>
    )
}

export default Register;

