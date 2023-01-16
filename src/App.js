// Imports
import Header from './components/Header';
import React, { useState } from 'react';
import Home from './components/Home';
import Lifestyle from './components/Footer';
import Gallery from './components/Gallery';
import Blog from './components/Blog';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import BootstrapCarousel from './components/BootstrapCarousel';


function App() {
  const [currentTab, setCurrentTab] = useState("home");



  const renderTab = () => {
    switch (currentTab) {
      case "home":
          return <Home />;

      case "blog":
        return <Blog />;

      case "lifestyle":
        return <Lifestyle />;

      case "gallery":
        return <Gallery />;
      default:
        return null;
    }
  };
  return (
    <div>
      <div>

        <Header currentTab={currentTab} setCurrentTab={setCurrentTab}></Header>
       
      </div>
      <BootstrapCarousel />
   
      <div>
        <main>{renderTab()}</main>

      </div>
      <div>
        
      </div>
    </div>

  );
}


export default App;
