import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import AddTask from './components/AddTask';
import EditTask from './components/EditTask';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/add" element={<AddTask />} />
                    <Route path="/edit/:id" element={<EditTask />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;