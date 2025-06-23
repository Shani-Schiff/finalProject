import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import { UserProvider } from './components/UserContext';

// רכיבי עמודים
import Navbar from './components/Navbar';
import Home from './components/Home';
import NotFound from './components/NotFound';
import Login from './components/Login';
import Register from './components/Register';
import Lessons from './components/Lessons';
import LessonPage from './components/LessonPage';
import Teachers from './components/Teachers';
import TeacherPage from './components/TeacherPage';
import Questions from './components/Questions';
import ContactUs from './components/ContactUs';
import Notifications from './components/Notifications';
import ApplyTeacher from './components/personal/ApplyTeacher';
import PersonalArea from './components/PersonalArea';

// תתי רכיבים לאזור האישי
import Calendar from './components/personal/Calendar';
import CreateLesson from './components/personal/CreateLesson';
import ManageStudents from './components/personal/ManageStudents';
import ManageTeachers from './components/personal/ManageTeachers';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Navbar />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
          
          {/* אזור אישי */}
          <Route path="/personal" element={<PersonalArea />}>
            <Route path="calendar" element={<Calendar />} />
            <Route path="apply" element={<ApplyTeacher />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="create-lesson" element={<CreateLesson />} />
            <Route path="manage-students" element={<ManageStudents />} />
            <Route path="manage-teachers" element={<ManageTeachers />} />
          </Route>

          {/* עמודים נוספים */}
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/lessons/:id" element={<LessonPage />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/teachers/:id" element={<TeacherPage />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/contactUs" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
