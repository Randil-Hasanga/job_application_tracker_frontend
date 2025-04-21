import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddApplication from './pages/AddApplication';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-application" element={<AddApplication />} />
        <Route path="/notifications" element={<div>Notifications Page</div>} />
      </Routes>
    </Router>
  );
}

export default App;