import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/HomePage";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import "bootstrap/dist/css/bootstrap.min.css";
import HomePage from "./components/HomePage";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" exact component={Home} element={<HomePage />} />
          <Route path="/home" component={Home} element={<HomePage />} />
          <Route path="/signin" component={SignIn} element={<SignIn />}/>
          <Route path="/signup" component={SignUp} element={<SignUp />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
