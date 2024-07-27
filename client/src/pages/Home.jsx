import "./Pages.css";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import SendIcon from '@mui/icons-material/Send';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import HomeIcon from '@mui/icons-material/Home';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { uploadPost } from "../Redux/postSlice";
import { getPosts } from "../Redux/postSlice";

function Home() {


  
  const [posts, setPosts] = useState([])

  const dispatch = useDispatch()
  
  useEffect(()=>{
    dispatch(getPosts()).then(()=>setPosts(JSON.parse(localStorage.getItem("posts"))))
  },[])

 

  const [selectedFiles, setSelectedFiles] = useState(null);

  const [caption, setCaption] = useState("")

  const handleFileSelect = (event) => {
    setSelectedFiles(event.target.files);
  };


  function handleSubmit(e){
    console.log("here")
    e.preventDefault()

    const formData = new FormData();
    formData.append("caption", caption);

    Array.from(selectedFiles).forEach(file => {
      formData.append("files", file);
    });

    dispatch(uploadPost(formData)).then(()=>{
      setCaption("")
      setSelectedFiles(null)
      setcreatePost(!createPost)
    })

  
  }

  const [createPost, setcreatePost] = useState(false)

  return (
    <div className="home-all">
      <div className="home-left">
        <div className="home-container">
          <div className="home-logo">
            <img src="assets/logo1.png" alt="Logo" width="100px" />
          </div>
          <div className="home-subtitles">
          <Link to="/">
        <HomeIcon /> <span>Home</span>
      </Link>
      <Link to="/chatting">
        <SearchIcon /> <span>Search</span>
      </Link>
      <Link to="/explore">
        <ExploreIcon /> <span>Explore</span>
      </Link>
      <Link to="/reels">
        <SlideshowIcon /> <span>Reels</span>
      </Link>
      <Link to="/chatting">
        <SendIcon /> <span>Messages</span>
      </Link>
      <Link to="/notifications">
        <FavoriteBorderIcon /> <span>Notifications</span>
      </Link>
      <button onClick={()=>setcreatePost(!createPost)}>
        <AddCircleIcon /> <span>Create</span>
        </button>
            <a href="">
              <img src="assets/founder.jpg" className="home-profile" alt="Profile" />Profile
            </a>
          </div>
          <div className="home-end">
            <a href="">
              <img src="assets/more.png" alt="More" />More
            </a>
          </div>
        </div>
      </div>
      <div className="home-middle">
        <div className="home-prev-btn">
          <img
            src="https://tse4.mm.bing.net/th?id=OIP.hkucBwyTCkwiCAWU9IL6mAAAAA&pid=Api&P=0"
            style={{ width: "20px" }}
            alt="Previous"
          />
        </div>
        <div className="home-stories">
          <a href="index2.html" className="home-story home-story1" id="0">
            <img src="assets/1.png" alt="" />
          </a>
          <a href="index2.html" className="home-story home-story2" id="1">
            <img src="assets/2.png" alt="" />
          </a>
          <a href="index2.html" className="home-story home-story3" id="2">
            <img src="assets/3.png" alt="" />
          </a>
          <a href="index2.html" className="home-story home-story4" id="3">
            <img src="assets/4.png" alt="" />
          </a>
          <a href="index2.html" className="home-story home-story5" id="4">
            <img src="assets/5.png" alt="" />
          </a>
          <a href="index2.html" className="home-story home-story6" id="5">
            <img src="assets/6.png" alt="" />
          </a>
          <a href="index2.html" className="home-story home-story7" id="6">
            <img src="assets/7.png" alt="" />
          </a>
          <a href="index2.html" className="home-story home-story8" id="7">
            <img src="assets/8.png" alt="" />
          </a>
          <a href="index2.html" className="home-story home-story9" id="8">
            <img src="assets/10.png" alt="error" />
          </a>
          <a href="index2.html" className="home-story home-story9" id="8">
            <img src="assets/12.png" alt="error" />
          </a>
        </div>
        <div className="home-next-btn">
          <img
            src="https://tse2.mm.bing.net/th?id=OIP.K9tPVcU7Rc8yxRgfK25L2gHaHa&pid=Api&P=0"
            style={{ width: "20px" }}
            alt="Next"
          />
        </div>
        
        <div className="home-post-container" style={{position:"relative"}}>
          {
            posts.map((item, index)=>(
          
          <div key = {index}>
            <div className="home-title">
              <img src="assets/founder.jpg" alt="Founder" />
              <p>
                <span className="home-name">{item.owner}</span>
                <span className="home-time">{item.createdAt}</span>
                <br />
                
              </p>
            </div>
            
            <div className="home-post home-post1">
              {
                item.posts.map((po,i)=>(
                
                   <img key = {i} src={po.secure_url} alt="Post" />
                  
                
                  
                ))
              }
              
            </div>
          
            <div className="home-bottom">
              <div className="home-icons">
                <i className="fa-regular fa-heart"></i>
                <i className="fa-sharp fa-regular fa-comment"></i>
                <img src="assets/share.png" alt="Share" />
                <i className="fa-regular fa-bookmark"></i>
              </div>
              <p>12888 Likes</p>
              <h3>Ankit kumar Dubey</h3>
              <span>
                View all 1000 comments <i className="fa-sharp fa-light fa-face-smile"></i>
              </span>
              <hr />
            </div>
          </div>
             ) )
}

        {createPost?(  <div className="createpost-container" style={{position:"absolute", top:0, left:0}}>
      <h1>Create new post</h1>
      <div className="createpost-upload-box">
        <input
          type="file"
          id="fileInput"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          
        />
        <label htmlFor="fileInput" className="createpost-upload-area">
          <div className="createpost-icon">📷📹</div>
          <p>Drag photos and videos here</p>
          
        </label>


      </div>
      {selectedFiles && (
        <div className="createpost-selected-files">
          <h2>Selected Files:</h2>
          <ul style={{display:"flex" ,gap:"20px", justifyContent:"center", flexWrap:"wrap"}}>
            {Array.from(selectedFiles).map((file, index) => (
              <li key={index}>
              {file.type.startsWith('image/') && (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  width="100"
                  height="100"
                />
              )}
            </li>
            ))}
          </ul>
        </div>
      )}

      {
        selectedFiles &&(
          <div style={{display:"flex", flexDirection:"column" ,alignItems:"center", marginTop:"20px" ,gap:"10px"}}>
         
          <input type="text" placeholder="Write caption" value={caption} onChange={(e)=>setCaption(e.target.value)} style={{borderRadius:"30px", width:"400px", border:"2px solid blue",  textAlign:"center" } }/>
          <button className="createpost-button" onClick={handleSubmit}>Upload post</button>
          </div>
        )
      }
    </div>):<br/>}
          
        </div>
      </div>
    </div>
  );
}

export default Home;
