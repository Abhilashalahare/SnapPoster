import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Workspace from './pages/Workspace';

function App() {
  return (
    <Router>
      <Routes>
        {/* The main gallery view */}
        <Route path="/" element={<Dashboard/>} />
        
        {/* The dynamic route for the canvas editor. 
            :id will either be 'new' or a MongoDB document ID */}
        <Route path="/design/:id" element={<Workspace/>} />
      </Routes>
    </Router>
  );
}

export default App;