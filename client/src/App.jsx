import React from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Chatting from './pages/Chatting';
import UserProfile from './pages/UserProfile';
import Notification from './pages/Notification';
import { SocketProvider } from './socket';

const RequireAuth = ({ children }) => {
  const data = JSON.parse(localStorage.getItem("data"));
  if (!data || Object.keys(data).length === 0) {
    return <Navigate to="/login" />;
  }
  return children;
};

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="chatting" element={<RequireAuth><Chatting /></RequireAuth>} />
        <Route path="userProfile" element={<RequireAuth><UserProfile /></RequireAuth>} />
        <Route path="notifications" element={<RequireAuth><Notification /></RequireAuth>} />
      </>
    )
  );

  return (
    <SocketProvider>
      <RouterProvider router={router} />
    </SocketProvider>
  );
};

export default App;
