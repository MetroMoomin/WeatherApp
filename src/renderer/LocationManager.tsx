import { useState, useEffect } from 'react';

interface Location {
  city: string;
  lat: number;
  lon: number;
}

interface LocationManagerProps {
  onLocationChange: (location: Location) => void;
}

export default function LocationManager({ onLocationChange }: LocationManagerProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [autoLocationEnabled, setAutoLocationEnabled] = useState(false);
  const [newLocation, setNewLocation] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  useEffect(() => {
    const fetchSavedLocations = async () => {
      const savedLocations: Location[] = await window.electron.getLocations();
      setLocations(savedLocations.length > 0 ? savedLocations : [{ city: 'Default City', lat: 0, lon: 0 }]);
      if (savedLocations.length > 0) {
        setSelectedLocation(savedLocations[0]);
        onLocationChange(savedLocations[0]);
        console.log('Initial location set:', savedLocations[0]);
      } else {
        const defaultLocation = { city: 'Default City', lat: 0, lon: 0 };
        setSelectedLocation(defaultLocation);
        onLocationChange(defaultLocation);
        console.log('Default location set:', defaultLocation);
      }
    };

    const fetchAutoLocationState = async () => {
      const isEnabled: boolean = await window.electron.getAutoLocationEnabled();
      setAutoLocationEnabled(isEnabled);
      console.log('Auto location enabled:', isEnabled);
    };

    fetchSavedLocations();
    fetchAutoLocationState();
  }, []);

  const fetchCitySuggestions = async (query: string) => {
    if (query.trim() === '') {
      setSuggestions([]);
      return;
    }

    const cities = [
      { city: 'New York', lat: 40.7128, lon: -74.0060 },
      { city: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
      { city: 'San Francisco', lat: 37.7749, lon: -122.4194 },
    ];

    const filtered = cities.filter((city) =>
      city.city.toLowerCase().startsWith(query.toLowerCase())
    );

    setSuggestions(filtered);
  };

  const saveNewLocation = async (location: Location) => {
    if (locations.some((loc) => loc.city === location.city)) {
      setErrorMessage('Cannot choose duplicate locations.');
      setTimeout(() => setErrorMessage(null), 3000);
    } else {
      const updatedLocations: Location[] = await window.electron.saveLocation(location);
      setLocations(updatedLocations);
      setNewLocation('');
      setSuggestions([]);
      console.log('Saved new location:', location);
    }
  };

  const toggleAutoLocation = async () => {
    const updatedState: boolean = await window.electron.setAutoLocationEnabled(!autoLocationEnabled);
    setAutoLocationEnabled(updatedState);
    console.log('Toggled auto location to:', updatedState);
  };

  const selectLocation = (location: Location) => {
    setSelectedLocation(location);
    onLocationChange(location);
    console.log('Selected location:', location);
  };

  const removeLocation = async (locationName: string) => {
    if (locations.length > 1) {
      const updatedLocations: Location[] = await window.electron.removeLocation(locationName);
      setLocations(updatedLocations);
      console.log('Removed location:', locationName);
      if (selectedLocation && selectedLocation.city === locationName) {
        const newLocation = updatedLocations[0];
        setSelectedLocation(newLocation);
        onLocationChange(newLocation);
        console.log('Selected new default location:', newLocation);
      }
    } else {
      setErrorMessage('Cannot remove the last remaining location.');
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-zinc-800 p-8">
      <div className="flex flex-col h-full w-full p-8 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-white mb-8">Manage Locations</h2>

        {errorMessage && (
          <div className="mb-8 p-4 bg-red-600 text-white rounded-lg">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col mb-8">
          <input
            type="text"
            value={newLocation}
            onChange={(e) => {
              setNewLocation(e.target.value);
              fetchCitySuggestions(e.target.value);
            }}
            placeholder="Enter city name"
            className="p-2 mb-4 w-full rounded-lg bg-gray-700 text-white border-none"
          />
          <ul className="bg-gray-800 rounded-lg shadow-lg mb-4">
            {suggestions.map((city, index) => (
              <li
                key={index}
                onClick={() => saveNewLocation(city)}
                className="cursor-pointer p-2 hover:bg-gray-700 text-white"
              >
                {city.city}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center mb-8">
          <input
            type="checkbox"
            checked={autoLocationEnabled}
            onChange={toggleAutoLocation}
            className="mr-2"
          />
          <label className="text-white">Enable Automatic Location Detection</label>
        </div>

        <ul className="space-y-4">
          {locations.map((location, index) => (
            <li
              key={index}
              className={`flex flex-row items-center justify-between text-white bg-zinc-800 p-4 rounded-lg shadow-lg ${selectedLocation && selectedLocation.city === location.city ? 'border border-light-blue-500' : ''}`}
              onClick={() => selectLocation(location)}
              style={{ cursor: 'pointer' }}
            >
              <span>{location.city} (Lat: {location.lat}, Lon: {location.lon})</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeLocation(location.city);
                }}
                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
