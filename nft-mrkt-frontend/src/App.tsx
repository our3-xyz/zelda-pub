import React from 'react';
import './App.scss';
import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

function App() {

  return (
    <div className="App">
        <Navbar />
        <Outlet />
        {/* <div>Temporary Title</div> */}
        <Footer />
    </div>
  );
}

export default App;
