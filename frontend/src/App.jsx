import React from 'react';
import './App.css'; // This imports the CSS file
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup'; // Update the path based on your project structure
import Signin from './components/Signin';
import Home from './components/Home';

function App() {
  return (
      <Router>
          <div>
              <Routes>
                  <Route path="/" element={<Signin />} />
                  <Route path="/signup" element={<Signup />} />
                  {/* Signin Route */}
                  <Route path="/signin" element={<Signin />} />
                  <Route path="/home" element={<Home />} />
              </Routes>
          </div>
      </Router>
  );
}

export default App;
