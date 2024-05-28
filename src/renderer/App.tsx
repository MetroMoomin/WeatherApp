import { useEffect, useState } from 'react';
import LocationManager from './LocationManager';
import MainView from './MainWiev';
import icon from './icons/cloudy.png';
import sunny from './icons/sun.png';
import locationMan from './icons/location.png';
import appIcon from './icons/appTransp.png';
import tabPlaceholder from './icons/tab.png';
import React from 'react';


interface Location {
  city: string;
  lat: number;
  lon: number;
}

function App() {
  const [showLocationManager, setShowLocationManager] = useState(false);
  const [showMainView, setShowMainView] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  useEffect(() => {
    (async () => {
      const savedLocations: Location[] = await window.electron.getLocations();
      if (savedLocations.length > 0) {
        setSelectedLocation(savedLocations[0]);
        console.log('Initial selected location:', savedLocations[0]);
      }
    })();
  }, []);

  const handleToggleLocationManager = () => {
    setShowLocationManager(true);
    setShowMainView(false);
  };

  const handleToggleMainView = () => {
    setShowMainView(true);
    setShowLocationManager(false);
  };

  const handleLocationChange = (location: Location) => {
    setSelectedLocation(location);
    console.log('Location changed to:', location);
  };

  return (
    <div>
      <div className="bg-zinc-800 p-3 flex flex-row h-full ">
        <div>
          <div className="container rounded-lg h-full w-40 bg-gradient-to-r from-gray-700 to-gray-800 shadow-xl flex flex-col justify-center items-center bg-center bg-cover bg-[url('./icons/bg.png')]">
            <div className="p-8">
              <img src={appIcon} alt="icon" className="h-25 w-25" />
              <h3 className="text-white text-center">App Name</h3>
            </div>
            <div className="bg-gradient-to-r from-gray-500 to-gray-600 h-2 w-40"></div>

            <div className="p-8">
              <button onClick={handleToggleMainView}>
                <img src={sunny} alt="icon" className="h-16 w-16" />
              </button>
            </div>

            <div className="p-8">
              <button onClick={handleToggleLocationManager}>
                <img src={locationMan} alt="icon" className="h-16 w-16" />
              </button>
            </div>

            <div className="p-8">
              <img src={tabPlaceholder} alt="icon" className="h-16 w-16" />
            </div>

            <div className="p-8">
              <img src={tabPlaceholder} alt="icon" className="h-16 w-16" />
            </div>

            <div className="p-8">
              <img src={tabPlaceholder} alt="icon" className="h-16 w-16" />
            </div>

            <div className="p-8">
              <img src={tabPlaceholder} alt="icon" className="h-16 w-16" />
            </div>
          </div>
        </div>

        <div id="locationManagerContainer">
          {showLocationManager && <LocationManager onLocationChange={handleLocationChange} />}
        </div>

        <div id="mainViewContainer">
          {showMainView && selectedLocation && <MainView selectedLocation={selectedLocation} />}
        </div>
      </div>
    </div>
  );
}

export default App;
