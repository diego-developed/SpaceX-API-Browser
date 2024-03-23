import React from "react";
import { Link } from "react-router-dom";
import screenfull from 'screenfull';

function HomePage(props) {
  
    const handleFullScreen = () => {
      if (screenfull.isEnabled) {
        screenfull.toggle();
      }
    };
  return (
    <div className='center'>
      <ul>
      <li><p className='home-title'>Welcome to the SpaceX API Explorer</p></li>
      <li><p>This site provides detailed information about SpaceX's launches, rockets, payloads, ships, and more, utilizing the SpaceX API.
        Anything in green can be interacted with, so feel free to explore!</p> This Application is best experienced in <a href="#!" onClick={handleFullScreen}> FullScreen</a> ;)</li>
      <nav>
          <li><Link to="/launches/page/0">Launches Listing</Link></li>
          <li><Link to="/payloads/page/0">Payloads Listing</Link></li>
          <li><Link to="/cores/page/0">Cores Listing</Link></li>
          <li><Link to="/rockets/page/0">Rockets Listing</Link></li>
          <li><Link to="/ships/page/0">Ships Listing</Link></li>
          <li><Link to="/launchpads/page/0">Launch Pads Listing</Link></li>
      </nav>
      </ul>
    </div>
  );
};

export default HomePage;
