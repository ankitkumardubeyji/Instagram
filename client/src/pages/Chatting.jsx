import React, { useState } from 'react';
import InstagramIcon from '@mui/icons-material/Instagram';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import MessageIcon from '@mui/icons-material/Message';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddBoxIcon from '@mui/icons-material/AddBox';
import './Pages.css';
import { useDispatch } from 'react-redux';
import { getNotifications, searchUser } from '../Redux/authSlice';
import Chat from './Chat';
import { useNavigate } from 'react-router-dom';


function Chatting() {

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




    

    const [search,setSearch] = useState(false)

    const [fullName, setFullName] = useState("")

    

    return (
        <div className="chatting">
            <div className="left">
                <InstagramIcon className="icon" />
                <HomeIcon className="icon" />
                <SearchIcon className="icon" onClick= {()=>setSearch(!search)} />
                <ExploreIcon className="icon" />
                <GroupWorkIcon className="icon" />
                <MessageIcon className="icon" />
                <FavoriteBorderIcon className="icon" onClick={handleNotification}/>
                <AddBoxIcon className="icon" />
            </div>

            <div className="middle">

            {search ?(
                <div className='searchBox'>
                         <input type="text"  id="" width={"100px"} style={{color:"black"}}  placeholder='searchUser' name="fullName" value={fullName} onChange= {(e)=>{handleSearch(e)}}/>
                         <SearchIcon className="icon" />   

                </div>
               ):<br/>}       
               
               {
                 (search && fullName.length>1)? (sUsers.map((item,index)=><Chat key = {index} avatar={item.avatar} fullName={item.fullName}  userId={item._id} />)):<br/>
               }
               
            </div>

            <div className="right">
                <div className="message-placeholder">
                    <h2>Your messages</h2>
                    <p>Send private photos and messages to a friend or group.</p>
                    <button>Send message</button>
                </div>
            </div>
        </div>
    );
}

export default Chatting;
