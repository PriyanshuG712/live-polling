import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import HomePage from './pages/HomePage';
import StudentPage from './pages/StudentPage';
import StudentPollView from './pages/StudentPollView';
import TeacherPage from './pages/TeacherPage';
import PollPage from './pages/PollPage'; // Import the ResultsPage

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/teacher" element={<TeacherPage />} />
        <Route path="/student/poll" element={<StudentPollView />} />
        <Route path="/pollpage" element={<PollPage />} />
      </Routes>
    </Router>
  );
}

export default App;
