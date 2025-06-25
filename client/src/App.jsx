import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import { UserProvider } from './components/UserContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import NotFound from './components/NotFound';
import Login from './components/Login';
import Register from './components/Register';
import Subjects from './components/Subjects';
import SubjectsLessons from './components/SubjectsLessons';
import LessonPage from './components/LessonPage';
import Teachers from './components/Teachers';
import TeacherPage from './components/TeacherPage';
import Questions from './components/Questions';
import ContactUs from './components/ContactUs';
import Messages from './components/Messages';
import PersonalArea from './components/PersonalArea';
import ApplyTeacher from './components/personal/ApplyTeacher';
import Calendar from './components/personal/Calendar';
import CreateLesson from './components/personal/CreateLesson';
import ManageTeachers from './components/personal/ManageTeachers';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Navbar />
        <ToastContainer position="top-center" rtl />
        <Routes>

          {/* עמוד ראשי */}
          <Route path="/" element={<Home />} />

          {/* מקצועות ושיעורים */}
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/subjects/:id" element={<SubjectsLessons />} />
          <Route path="/subjects/lessons/:id" element={<LessonPage />} />

          {/* מורים */}
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/teachers/:id" element={<TeacherPage />} />

          {/* אזור אישי */}
          <Route path="/personal" element={<PersonalArea />}>
            <Route path="calendar" element={<Calendar />} />
            <Route path="apply" element={<ApplyTeacher />} />
            <Route path="messages" element={<Messages />} />
            <Route path="create-lesson" element={<CreateLesson />} />
            <Route path="manage-teachers" element={<ManageTeachers />} />
          </Route>

          {/* עמודים כלליים */}
          <Route path="/questions" element={<Questions />} />
          <Route path="/contactUs" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
