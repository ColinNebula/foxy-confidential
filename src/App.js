// Imports

import Header from './components/Header';
import React, { useState } from 'react';
import Home from './components/Home';
import Lifestyle from './components/Lifestyle';
import Gallery from './components/Gallery';
import Login from './components/Login';
import Blog from './components/Blog';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import ParticlesBackground from './components/config/ParticlesBackground';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


function App() {
  const [currentTab, setCurrentTab] = useState("home");
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadComplete = () => {
    setIsLoading(false);
  };



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
        
      case "login":
      return <Login />;

      default:
        return null;
    }
  };
  return (
    <>
      {isLoading ? (
        <SplashScreen onLoadComplete={handleLoadComplete} />
      ) : (
        <div className="app-bg">
          <ParticlesBackground />
          <div className="app-container">
            <Header currentTab={currentTab} setCurrentTab={setCurrentTab} />
            <main className="app-main">{renderTab()}</main>
          </div>
          {currentTab !== "login" && <Footer />}
        </div>
      )}
    </>
  );
}


export default App;
