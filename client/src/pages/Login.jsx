import { useState , useEffect } from "react";
import "./Login.css";
import { useNavigate} from "react-router-dom";
import { useDispatch } from "react-redux";
import { validateAccount } from "../Redux/authSlice";
import toast from "react-hot-toast";

function Login() {

    const [loginData,setLoginData] = useState({
        email:"",
        password:""
    })

    const navigate = useNavigate()

    const dispatch = useDispatch()




    function handleUserInput(e){
        const {name,value} = e.target;

        setLoginData({
            ...loginData,
            [name]:value 
        })
    }

    function handleLogin(e){
        e.preventDefault()

        if(!loginData.email || !loginData.password){
            toast.error("Please all the fields");
            return;
        }

        dispatch(validateAccount(loginData)).then(()=>navigate("/")).catch(()=>navigate("/login"))

        setLoginData({
            email:"",
            password:""
        })
    }

    const arr = ['screenshot1.png','screenshot2.png','screenshot3.png','screenshot4.png']

    let i = 0;
    const [image, setImage] = useState(arr[0])
    useEffect(() => {
        const interval = setInterval(() => {
          setImage(arr[i % arr.length]);
          if(i==Number.MAX_SAFE_INTEGER){
            i=0;
          }
          i++;
        }, 1000);
    
        return () => clearInterval(interval); // Cleanup on unmount
      }, []); // Empty dependency array to run only once on mount




  return (
    <div className="container">
      <div className="left">
        <div className="mobile">
          <img src="/bg.png" alt="Background" />
          <div className="mobileTop">
            <img src={image}/>
        </div>
        </div>
       
      </div>
      <div className="right">
        <div className="card">
          <img src="insta.png" alt="Instagram Logo" className="logo" />
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Phone number, username, or email address"
              className="input-field"
              name="email"
              value={loginData.email}
              onChange={handleUserInput}


            />
            <input type="password" placeholder="Password" className="input-field" name="password" value={loginData.password} onChange={handleUserInput} />
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
    </div>
  );
}

export default Login;
