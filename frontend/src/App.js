import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import 'lenis/dist/lenis.css';
import NeuroTitanHub from './pages/NeuroTitanHub';
import SemiconductorPage from './pages/SemiconductorPage';
import useLenis from './hooks/useLenis';

function App() {
  useLenis();

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NeuroTitanHub />} />
          <Route path="/semiconductor" element={<SemiconductorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;