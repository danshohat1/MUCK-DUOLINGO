import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Navigation from './components/Navigation/Navigation';
import MainPage from './components/MainPage/MainPage.js';
import LandPage from './components/LandPage/LandPage';
import VideoChat from './components/VideoChat/VideoChat';
import "./App.css";
import {AuthProvider} from "./AuthContext"
import EditAccount from './components/EditAcount/EditAcount';
import PageNotFound from './components/PageNotFound/PageNotFound';
import NewWordsComponent from './components/NewWords/NewWords';
import  WarmUp from './components/Lesson/WarmUp.js';
import LanguagePracticeComponent from './components/Lesson/LanguagePracticeComponnent.js';
import FillSentence from './components/Lesson/FillSentence.js';
import LearnLanguage from './components/Learn/Learn.js';

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

            <Route path = "/main"  element = {<MainPage userLastLanguages={["English", "Hindi", "Spanish", "Arabic"]} /> } />

            <Route path = "/edit-account" element = {<EditAccount />} />
            <Route path="/video-chat/:lang" element={<VideoChat />} />
            <Route path="/new-words/:lang/:level" element={<NewWordsComponent />} />
            <Route path="/warm-up/:lang/:level" element={<WarmUp />} />
            <Route path = "/:lang/:level" element = {<LanguagePracticeComponent />} />
            <Route path = "/fill" element = {<FillSentence /> } /> 
            <Route path = "/learn/:lang" element = {<LearnLanguage />} />
            <Route path="*" element={<PageNotFound />} />
            
          </Routes>

        </AuthProvider>

      </div>
    </Router>

  );
}

export default App;
