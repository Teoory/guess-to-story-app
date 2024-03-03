import React from 'react'
import { Routes, Route } from 'react-router-dom';
import HomePage from '../Pages/HomePage';
import RoomPage from '../Pages/RoomPage';
import RegisterPage from '../Pages/RegisterPage';
import LoginPage from '../Pages/LoginPage';
import CreateStoryPage from '../Pages/CreateStoryPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route index path ="/*" element={<HomePage/>} />
      <Route path="/room/:id" element={<RoomPage/>} />
      <Route path="/register" element={<RegisterPage/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/createStory" element={<CreateStoryPage/>} />
    </Routes>
  )
}

export default AppRoutes