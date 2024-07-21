import React, { useEffect, useState } from 'react';
import InstagramIcon from '@mui/icons-material/Instagram';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import MessageIcon from '@mui/icons-material/Message';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddBoxIcon from '@mui/icons-material/AddBox';
import './Pages.css';
import { useDispatch, useSelector } from 'react-redux';
import { getMyChats, getNotifications, searchUser } from '../Redux/authSlice';
import Chat from './Chat';
import { useNavigate } from 'react-router-dom';
import SearchedUser from './SearchedUser';
import { sendMessages } from '../Redux/chatSlice';
import { GiConsoleController } from 'react-icons/gi';
import { getMyMessages } from '../Redux/chatSlice';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import { getSocket } from '../socket';




function Chatting() {

   useEffect(()=>{
    dispatch(getMyChats())
  
   },[])

   const socket = getSocket()
   console.log(socket.id)

   const [text, setText] = useState({
    content:"ankit",
    files:[],
    chatId:""
   })

   const chats = useSelector((state)=> state.auth.chats)
   const messageWindow = useSelector((state)=> state.chat.messageWindow)
   const currentChatDetail = useSelector((state)=> state.chat.currentChatDetail)
   const messages = useSelector((state)=> state.chat.messages)
   console.log(messages)

   

   

    const navigate = useNavigate()

    const [sUsers,setSusers] = useState([])

    const dispatch = useDispatch()

    
    function handleSearch(e){
        setFullName(e.target.value)
        console.log(e.target.value)

        dispatch(searchUser(fullName)).then(()=>setSusers(JSON.parse(localStorage.getItem("sUsers")))).then(()=>console.log(sUsers))
    }


    function handleNotification(e){
        dispatch(getNotifications()).then(()=> navigate("/notifications"))
    }

    function handleUserInput(e){
      const {name,value} = e.target;

      console.log(name)
      console.log(value)
  
      setText({
          ...text,
          [name]:value 
      })
  }
  
    const getImage = (e) => {
      e.preventDefault();
  
      const uploadedFiles = Array.from(e.target.files);
      console.log(uploadedFiles);
  
      if (uploadedFiles.length > 0) {
        setText((prevState) => ({
          ...prevState,
          files: uploadedFiles
        }));
      }
  
      console.log(text);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      const formData = new FormData();
      formData.append("content", text.content);
  
      text.files.forEach(file => {
        formData.append("files", file);
      });
  
      formData.append("chatId", currentChatDetail._id);

      dispatch(sendMessages(formData)).then(()=>  dispatch(getMyMessages(currentChatDetail._id)))
  
      // Send formData to the server using fetch or axios
      // Example with fetch:
      
    };




    const [search,setSearch] = useState(false)
    const [chatt, setChatt] = useState(true)

    const [fullName, setFullName] = useState("")

    

    return (
        <div className="chatting">
            <div className="left">
                <InstagramIcon className="icon" />
                <HomeIcon className="icon" />
                <SearchIcon className="icon" onClick= {()=>{setSearch(!search); setChatt(!chatt)}} />
                <ExploreIcon className="icon" />
                <GroupWorkIcon className="icon" />
                <MessageIcon className="icon" />
                <FavoriteBorderIcon className="icon" onClick={handleNotification}/>
                <AddBoxIcon className="icon" />
            </div>

            <div className="middle">

            {chatt ? (chats.map((item,index)=> (<Chat key = {index} avatar={item.avatar} fullName={item.name}  chatId={item._id} />))):<br/>  }

            {search ?(
                <div className='searchBox'>
                         <input type="text"  id="" width={"100px"} style={{color:"black"}}  placeholder='searchUser' name="fullName" value={fullName} onChange= {(e)=>{handleSearch(e)}}/>
                         <SearchIcon className="icon" />   

                </div>
               ):<br/>}       
               
               {
                 (search && fullName.length>1)? (sUsers.map((item,index)=><SearchedUser key = {index} avatar={item.avatar} fullName={item.fullName}  userId={item._id} />)):<br/>
               }
               
            </div>

            <div className="right" style={{ position: "relative" }}>
      {messageWindow ? ( // Replace `true` with `messageWindow` to use the actual condition
        <div className="chat-interface">
          <header className="chat-header">
            <div className="user-info">
              <img src={currentChatDetail.dp} alt="User Avatar" className="user-avatar" />
              <div>
                <h2 className="user-name">{currentChatDetail.name}</h2>
                <p className="user-status">Last Seen {currentChatDetail.status.split("GMT")[0].trim()}</p>
              </div>
            </div>
            <div className="chat-actions">
              <button className="call-button">📞</button>
              <button className="video-call-button">🎥</button>
              <button className="info-button">ℹ️</button>
            </div>
          </header>

        

       

          <div className="messages-container">

          <div className="chat-profile">
            <img src={currentChatDetail.dp} alt="Profile Avatar" className="profile-avatar" />
            <h3 className="profile-name">{currentChatDetail.name}</h3>
            <p className="profile-username">{currentChatDetail.userName} • Instagram</p>
            <button className="view-profile-button">View Profile</button>
          </div>

            {messages.map((item, index) => {
              const isCurrentUser = item.sender._id.toString() === JSON.parse(localStorage.getItem("data"))._id;
              const date = new Date(item.createdAt);
              const localTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

              return (
                <div className={`chat-message ${isCurrentUser ? 'current-user' : ''}`} key={index}>
                  {!isCurrentUser && (
                    <img src={item.sender.avatar.secure_url} alt="Sender Avatar" className="user-avatar" />
                  )}
                  <div className="message-content">
                    <h1>{item.content} <span style={{fontSize:"8px"}}>{localTime}</span></h1>
                    <div className="attachments">
                      {item.attachments.map((image, index) => (
                        <img src={image.secure_url} alt="Message Attachment" width="100px" height="100px" key={index} />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <footer className="chat-footer">
            <form style={{ width: "700px" }} onSubmit={handleSubmit}>
            
            <label htmlFor="file"><AttachFileIcon/></label>
              <input
                type="file"
                id="file"
                onChange={getImage}
                style={{ display: "none" }}
                multiple
              />

              <input
                type="text"
                placeholder="Message..."
                className="message-input"
                value={text.content}
                onChange={handleUserInput}
                style={{ color: "black" , width:"70%"}}
                name="content"
              />
             
              <button className="microphone-button" type="submit"><SendIcon/></button>
              <button className="heart-button">❤️</button>
            </form>
          </footer>
        </div>
      ) : (
        <div className="message-placeholder">
          <h2>Your messages</h2>
          <p>Send private photos and messages to a friend or group.</p>
          <button>Send message</button>
        </div>
      )}
    </div>
        
        </div>
    );
}

export default Chatting;
