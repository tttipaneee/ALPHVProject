import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './components/Welcome';
import Auth from './components/Auth';
import AdminPortal from './components/AdminPortal';
import UserPortal from './components/UserPortal';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        {/* We use a shared auth component for both roles */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<AdminPortal />} />
        <Route path="/user" element={<UserPortal />} />
      </Routes>
    </Router>
  );
}