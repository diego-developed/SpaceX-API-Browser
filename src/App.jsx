import React from "react";
import './App.css';
import { Link, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import LaunchesPage from "./components/LaunchesPage";
import LaunchDetails from "./components/LaunchDetails";
import PayloadsPage from "./components/PayloadsPage";
import PayloadDetails from "./components/PayloadDetails";
import CoresPage from "./components/CoresPage";
import CoresDetails from "./components/CoreDetails";
import RocketsPage from "./components/RocketsPage";
import RocketDetails from "./components/RocketDetails";
import ShipsPage from "./components/ShipsPage";
import ShipDetails from "./components/ShipDetails";
import LaunchpadsPage from "./components/LaunchpadsPage";
import LaunchpadDetails from "./components/LaunchpadDetails";
import NotFoundPage from "./components/NotFoundPage";
import Starfield from 'react-starfield';
import { IoLogoGithub } from "react-icons/io";

const App = () => {
  return (
      <div className="App">
        <Starfield
        starCount={2500}
        starColor={[255, 255, 255]}
        speedFactor={0.25}
        backgroundColor="black"
      />
        <header className="App-header">
          <h1 className='App-title'>SpaceX API</h1>
          <Link to="/">Home</Link>
        </header>
        <br />
        <br />
        <Routes>
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/launches/page/:page" element={<LaunchesPage />} />
          <Route path="/launches/:id" element={<LaunchDetails />} />
          <Route path="/payloads/page/:page" element={<PayloadsPage />} />
          <Route path="/payloads/:id" element={<PayloadDetails />} />
          <Route path="cores/page/:page" element={<CoresPage />} />
          <Route path="/cores/:id" element={<CoresDetails />} />
          <Route path="rockets/page/:page" element={<RocketsPage />} />
          <Route path="/rockets/:id" element={<RocketDetails />} />
          <Route path="ships/page/:page" element={<ShipsPage />} />
          <Route path="/ships/:id" element={<ShipDetails />} />
          <Route path="launchpads/page/:page" element={<LaunchpadsPage />} />
          <Route path="/launchpads/:id" element={<LaunchpadDetails />} />
        </Routes>
        <footer>
          <p>Developed by <a href="https://github.com/diego-developed" target="_blank">Diego Ramirez <IoLogoGithub  /></a></p>
        </footer>
      </div>
  );
};

export default App;