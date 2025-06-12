import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import Navbar from '../src/components/Navbar'
import Home from '../src/components/Home'
import Login from '../src/components/Login'
import Register from '../src/components/Register'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ToastContainer />{/* חלונית הודעות - עיצוב */}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/lessons" element={<Lessons />} /> */}
        {/* <Route path="/teachers" element={<Teachers />} /> */}
        {/* <Route path="/faq" element={<Questions />} /> */}
        {/* <Route path="/contactUs" element={<ContactUs />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
