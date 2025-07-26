import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GenerateFlash from './components/GenerateFlash';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<GenerateFlash/>} />
            </Routes>
        </Router>
    );
}

export default App;
