import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../Redux/authSlice";
import { getChatDetails, getChatInfo, getMyMessages } from "../Redux/chatSlice";

function Chat({avatar,fullName,chatId}){
    console.log(avatar,fullName)
    const dispatch = useDispatch()
   // const navigate = useNavigate()

    function getMessagesofChat(){   
         dispatch(getMyMessages(chatId))
         dispatch(getChatDetails(chatId))
         dispatch(getChatInfo(chatId))
        console.log("came here")
        console.log(chatId)
    }
    


    return(
        <>
                <div className="message-list" onClick={getMessagesofChat}>
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

