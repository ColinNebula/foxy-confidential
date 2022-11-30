// Imports
import Header from './components/Header';
import React, { useState } from 'react';
import Home from './components/Home';
import Food from './components/Food';
import Wines from './components/Wines';
import Foxy from './components/Foxy';
import Gallery from './components/Gallery';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import BootstrapCarousel from './components/BootstrapCarousel';


function App() {
  const [currentTab, setCurrentTab] = useState("home");

  const renderTab = () => {
    switch (currentTab) {
      case "food":
        return <Food  />;

      case "home":
        return <Home />;
      
      case "blog":
        return <blog />;

        case "wines":
          return <Wines />;
          
          case "foxy":
            return <Foxy />;
          
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
        <main>{renderTab()}
        
        </main>
        
      </div>

      <div>
        <Footer></Footer>
      </div>
    </div>

  );
}


export default App;
