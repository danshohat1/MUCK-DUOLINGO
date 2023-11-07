import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Navigation from './components/Navigation/Navigation';
import Main from './components/Main/Main.js';
import LandPage from './components/LandPage/LandPage';
import VideoChat from './components/VideoChat/VideoChat';
import "./App.css";
import {AuthProvider} from "./AuthContext"
import EditAccount from './components/EditAcount/EditAcount';


function App() {
  return (
    <Router>
      <div>
        <AuthProvider>
        <Navigation />
          <Routes>
            <Route path = "/" element = {<LandPage />} />
            <Route
              path="/login"
              element={<Login />}
            />
            <Route path="/signup" element={<Signup />} />

            <Route path = "/main"  element = {<Main />} />

            <Route path = "/edit-account" element = {<EditAccount />} />
            <Route path="/video-chat/:lang" element={<VideoChat />} />
          </Routes>

        </AuthProvider>

      </div>
    </Router>

  );
}

export default App;
