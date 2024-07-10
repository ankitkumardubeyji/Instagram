import "./Pages.css";

function Home() {
  



  return (
    <div className="all">
      <div className="left">
        <div className="container">
          <div className="logo">
            <img src="logo1.png" alt="Logo" width="100px" />
          </div>
          <div className="subtitles">
            <a href="">
              <i className="fa-solid fa-house"></i>Home
            </a>
            <a href="">
              <img src="assets/search.png" alt="Search" />Search
            </a>
            <a href="">
              <img src="assets/explore.png" alt="Explore" />Explore
            </a>
            <a href="">
              <img src="assets/reels.png" alt="Reels" />Reels
            </a>
            <a href="">
              <img src="assets/messages.png" alt="Messages" />Messages
            </a>
            <a href="">
              <i className="fa-regular fa-heart"></i> Notifications
            </a>
            <a href="">
              <img src="assets/create.png" alt="Create" />Create
            </a>
            <a href="">
              <img src="assets/founder.jpg" className="profile" alt="Profile" />Profile
            </a>
          </div>
          <div className="end">
            <a href="">
              <img src="assets/more.png" alt="More" />More
            </a>
          </div>
        </div>
      </div>
      <div className="middle">
        <div className="prev-btn">
          <img
            src="https://tse4.mm.bing.net/th?id=OIP.hkucBwyTCkwiCAWU9IL6mAAAAA&pid=Api&P=0"
            style={{ width: "20px" }}
            alt="Previous"
          />
        </div>
        <div className="stories">
          <a href="index2.html" className="story story1" id="0">
            <img src="assets/1.png" alt="" />
          </a>
          <a href="index2.html" className="story story2" id="1">
            <img src="assets/2.png" alt="" />
          </a>
          <a href="index2.html" className="story story3" id="2">
            <img src="assets/3.png" alt="" />
          </a>
          <a href="index2.html" className="story story4" id="3">
            <img src="assets/4.png" alt="" />
          </a>
          <a href="index2.html" className="story story5" id="4">
            <img src="assets/5.png" alt="" />
          </a>
          <a href="index2.html" className="story story6" id="5">
            <img src="assets/6.png" alt="" />
          </a>
          <a href="index2.html" className="story story7" id="6">
            <img src="assets/7.png" alt="" />
          </a>
          <a href="index2.html" className="story story8" id="7">
            <img src="assets/8.png" alt="" />
          </a>
          <a href="index2.html" className="story story9" id="8">
            <img src="assets/10.png" alt="error" />
          </a>
          <a href="index2.html" className="story story9" id="8">
            <img src="assets/12.png" alt="error" />
          </a>
        </div>
        <div className="next-btn">
          <img
            src="https://tse2.mm.bing.net/th?id=OIP.K9tPVcU7Rc8yxRgfK25L2gHaHa&pid=Api&P=0"
            style={{ width: "20px" }}
            alt="Next"
          />
        </div>
        <div className="post-container">
          <div id="1">
            <div className="title">
              <img src="assets/founder.jpg" alt="Founder" />
              <p>
                <span className="name">MR DUBEYJI</span>
                <span className="time">.10h</span>
                <br />
                Jasidih, Deoghar
              </p>
            </div>
            <div className="prev">
              <img
                src="https://tse4.mm.bing.net/th?id=OIP.hkucBwyTCkwiCAWU9IL6mAAAAA&pid=Api&P=0"
                style={{ width: "20px" }}
                alt="Previous"
              />
            </div>
            <div className="post post1">
              <img src="assets/founder.jpg" alt="Post" />
              <img src="assets/dubey2.png" alt="Post" />
            </div>
            <div className="next">
              <img
                src="https://tse2.mm.bing.net/th?id=OIP.K9tPVcU7Rc8yxRgfK25L2gHaHa&pid=Api&P=0"
                style={{ width: "20px" }}
                alt="Next"
              />
            </div>
            <div className="bottom">
              <div className="icons">
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
          <div className="right">
            <div className="title">
              <img src="assets/founder.jpg" alt="Founder" />
              <p>
                <span className="name">ankitdubey2987</span>
                <br />
                Mr Dubeyji
              </p>
              <a href="">Switch</a>
            </div>
            <p>
              <span>Suggested for you</span> See All
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;