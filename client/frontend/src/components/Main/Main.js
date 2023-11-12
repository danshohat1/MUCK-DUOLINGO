// Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Main.css";
function Main() {
  const navigate = useNavigate();
  if (sessionStorage.getItem("loggedIn") !== "true"){
    return (
      navigate("/login")
    )
  }
  return (
    <div>
      <h2>Welcome to the Home Page</h2>
      <p>This is the protected home page that can only be accessed when you are logged in.</p>
    </div>
  );
}

export default Main;
