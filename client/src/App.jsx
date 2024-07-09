
import Login from './pages/Login';
import Register from './pages/Register';
import Home from "./pages/Home"



import { Route,createBrowserRouter,createRoutesFromElements,RouterProvider,Navigate } from 'react-router-dom'




function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <> {/* at the top level of nesting giving the layout hence the below oulets are able to come automatically */}
        <Route path='' element={<Home />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} /> {/* when comes the /about Abou component passed as outlet */} 
         
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
