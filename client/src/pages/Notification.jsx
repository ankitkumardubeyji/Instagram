import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { acceptFriendRequest, getUserProfile , rejectFriendRequest } from "../Redux/authSlice";
import { useNavigate } from "react-router-dom";


function Notification(){

    const requests = useSelector(((state)=>state.auth.requests))
    const navigate = useNavigate()

    console.log(requests)


    const dispatch = useDispatch()
    function handleProfile(userId){
        console.log("came here")
        dispatch(getUserProfile(userId)).then(()=>navigate("/userProfile"))
    }


    const[accept, setAccept] = useState(false)
    const[reject, setReject] = useState(false)


    function acceptRequest(requestId){
        dispatch(acceptFriendRequest({requestId:requestId, accept:true}))
        setAccept(true)
    }

    function rejectRequest(requestId){
        dispatch(rejectFriendRequest({requestId:requestId, accept:false}))
        setReject(true);
    }

  

    return(
        <>
            {
                requests.map((item, index )=>
                    (<div style={{display:"flex", gap:"20px", alignItems:"center"}} key = {index} onClick={()=>handleProfile(item.sender._id)}>
                        <img src={item.sender.avatar} style={{width:"70px", borderRadius:"100%"}}/>
                        <h1>{item.sender.userName} has requested to follow you</h1>
                      {!accept ?(<button style={{backgroundColor:"blue", color:"white", padding:"5px"}} onClick={()=>acceptRequest(item._id)}>Confirm</button>):(<button style={{backgroundColor:"blue", color:"white", padding:"5px"}} onClick={()=>acceptRequest(item._id)}>Accepted</button>)}
                     {!reject? (<button onClick={()=> rejectRequest(item._id)}>Reject</button>):(<button onClick={()=> rejectRequest(item._id)}>Rejected</button>)}
                    </div>
                    )
                )
            }
        </>
    )
}


export default Notification;

