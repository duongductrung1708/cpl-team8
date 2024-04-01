import React from "react";
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/HomePage";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import "bootstrap/dist/css/bootstrap.min.css";
import Setting from "./components/User/Setting";
import UserProfile from "./components/User/UserProfile";
import CreateArticle from "./components/User/CreateArticle";
import Favorite from "./components/User/Favorite";
import ArticleDetail from "./components/ArticleDetail";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />}/>
          <Route path="/signup" element={<SignUp />}/>
          <Route path="/settings" element={<Setting />}/>
          <Route path="/profile/:username" element={<UserProfile />}/>
          <Route path="/profile/:username/favorites" element={<Favorite />}/>
          <Route path="/editor" element={<CreateArticle />}/>
          <Route path="/article/:slug" element={<ArticleDetail />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
