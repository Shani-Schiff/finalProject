import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import Navbar from '../src/components/Navbar'
import Home from '../src/components/Home'
import Login from '../src/components/Login'
import Register from '../src/components/Register'
import Lessons from './components/Lessons';
import ContactUs from './components/ContactUs';
import Questions from './components/Questions';
import Teachers from './components/Teachers';
import Notifications from './components/Notifications';
import ApplyTeacher from './components/ApplyTeacher';
import LessonPage from './components/LessonPage'


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/lessons/:id" element={<LessonPage />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/apply" element={<ApplyTeacher />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
