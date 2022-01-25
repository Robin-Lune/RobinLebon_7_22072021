import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Account from "./pages/Account";
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
