
import Login from './pages/Login';
import Register from './pages/Register';
import Home from "./pages/Home"



import { Route,createBrowserRouter,createRoutesFromElements,RouterProvider,Navigate } from 'react-router-dom'

import Chatting from './pages/Chatting';
import UserProfile from './pages/UserProfile';
import Notification from './pages/Notification';



function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <> {/* at the top level of nesting giving the layout hence the below oulets are able to come automatically */}
        <Route path='' element={<Home />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} /> {/* when comes the /about Abou component passed as outlet */} 
        <Route path='chatting' element={<Chatting />} /> {/* when comes the /about Abou component passed as outlet */} 
         <Route path='userProfile' element={<UserProfile/>}/>    
         <Route path='notifications' element={<Notification/>}/>    
        
      </>
    )
  )
 
  return (
    <>
    
      <RouterProvider router = {router}/>
  
    </>
  )
}

export default App
