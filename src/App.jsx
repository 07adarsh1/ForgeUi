import React from 'react'
import "./App.css"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NoPage from './pages/NoPage';
import StarsCanvas from './components/StarBackground';
import LandingPage from './pages/LandingPage';
import Documentation from './pages/Documentation';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <StarsCanvas />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/generate" element={<Home />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App