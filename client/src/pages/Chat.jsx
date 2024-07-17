import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../Redux/authSlice";

function Chat({avatar,fullName,userId}){
    console.log(avatar,fullName)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    function getUser(){

        dispatch(getUserProfile(userId)).then(()=>navigate("/userProfile"))
        

        
    }


    return(
        <>
                <div className="message-list" onClick={getUser}>
                    <div className="message">
                        <img src={avatar} alt="user" className="user-pic" />
                        <div className="message-info">
                            <h3>{fullName}</h3>
                        </div>
                    </div>
                    {/* Repeat the above div for each message */}
                </div>
                   
        </>
    )
}


export default Chat;

