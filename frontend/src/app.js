import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>} />
          {/* <Route path='/' element={<Login/>} />
          <Route path='/' element={<Login/>} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
