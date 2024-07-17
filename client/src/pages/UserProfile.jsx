import React, { useState } from 'react';
import './UserProfile.css'; // Import your CSS file for styling
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useDispatch, useSelector } from 'react-redux';
import { sendFriendRequest } from '../Redux/authSlice';

function UserProfile() {

    const dispatch =  useDispatch()

    const [requested, setRequested] = useState(false)


    function sendRequest(){
        dispatch(sendFriendRequest({userId:user._id}))
        setRequested(true)
    }

    const user = useSelector((state)=>state.auth.sUserDetail)
    console.log(user)

    return (
    <div className="user-profile">
      <div className="profile-header">
        <img src={user.avatar.secure_url} alt={`${user.fullName} avatar`} className="avatar" />
        <div className="profile-info">
          <div className="profile-top">
            <h2 className="username">{user.userName}</h2>
            {!requested? ( user.isFollowing ? (<button className="follow-button">Following</button>):<button className="follow-button" style={{backgroundColor:"blue", color:"white"}} onClick = {sendRequest}>Follow</button>):<button className="follow-button" style={{color:"black"}}>Requested </button>} 
            <button className="message-button" style={{color:"black"}}>Message</button>
          </div>
          <div className="profile-stats">
            <span>{user.posts} posts</span>
            <span>{user.followersCount} followers</span>
            <span>{user.followingCount} following</span>
          </div>
          <div className="profile-details">
            <h3>{user.fullName}</h3>
            <p>{user.bio}</p>

            <p>Followed by {user.followersCount}</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default UserProfile;
