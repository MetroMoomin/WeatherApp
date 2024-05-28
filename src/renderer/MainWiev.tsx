import { useEffect, useState } from 'react';
import icon from './icons/cloudy.png';
import sunny from './icons/sun.png';
import React from 'react';

interface Location {
  city: string;
  lat: number;
  lon: number;
}

interface WeatherValue {
  raw: number;
}

interface OneFormatWeatherValue extends WeatherValue {
  formatted: string;
}

interface TwoFormatWeatherValue extends WeatherValue {
  short: string;
  long: string;
}

interface CurrentWeatherData {
  main: {
    temperature: TwoFormatWeatherValue;
    minTemperature: TwoFormatWeatherValue;
    maxTemperature: TwoFormatWeatherValue;
    feelsLike: TwoFormatWeatherValue;
    humidity: OneFormatWeatherValue;
  };
}

interface WeatherData {
  current: CurrentWeatherData;
}

interface MainViewProps {
  selectedLocation: Location;
}

function MainView({ selectedLocation }: MainViewProps) {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [feelsLike, setFeelsLike] = useState<number | null>(null);
  const [day1, setDay1] = useState<string | null>(null);
  const [day2, setDay2] = useState<string | null>(null);
  const [day3, setDay3] = useState<string | null>(null);
  const [day4, setDay4] = useState<string | null>(null);
  const [day5, setDay5] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [cityName, setCityName] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async (lat: number, lon: number) => {
      const newWeatherData: WeatherData | null = await window.electron.getWeatherData(lat, lon);
      if (newWeatherData != null) {
        setTemperature(newWeatherData.current.main.temperature.raw);
        setHumidity(newWeatherData.current.main.humidity.raw);
        setFeelsLike(newWeatherData.current.main.feelsLike.raw);
        setCityName(selectedLocation.city);
        console.log('Fetched weather data for:', selectedLocation.city);
      }
    };

    const fetchNextFiveDays = async () => {
      const nextDays = await window.electron.getNextFiveDays();
      if (nextDays != null) {
        setDay1(nextDays.daysOfWeek[0]);
        setDay2(nextDays.daysOfWeek[1]);
        setDay3(nextDays.daysOfWeek[2]);
        setDay4(nextDays.daysOfWeek[3]);
        setDay5(nextDays.daysOfWeek[4]);
        setDate(nextDays.singleDate);
        console.log('Fetched next five days');
      }
    };

    if (selectedLocation) {
      fetchWeatherData(selectedLocation.lat, selectedLocation.lon);
      fetchNextFiveDays();
    }
  }, [selectedLocation]);

  return (
    <div className="flex flex-col h-screen w-screen bg-zinc-800 p-8">
      <div className="flex flex-row h-full w-full">
        <div className="flex flex-col p-8 h-full w-full">
          <div className="p-8 rounded-lg shadow-lg bg-gradient-to-r from-gray-700 to-gray-800 w-96 h-96 mb-8">
            <div className="p-8">
              <img src={sunny} alt="icon" className="h-16 w-16" />
            </div>
            <div className="flex items-center">
              <div className="text-7xl font-bold mr-2 text-white mb-2"> {temperature}° </div>
              <div className="text-gray-500">Partly Cloudy</div>
            </div>
            <div className="text-xl text-gray-400">Feels like: {feelsLike}°</div>
            <div className="h-5"></div>
            <div className="bg-gradient-to-r from-gray-500 to-gray-600 h-1 w-80 justify-center items-center"></div>
            <div className="h-3"></div>
            <div className="text-3xl font-bold text-white">{selectedLocation.city}</div>
            <div className="text-3xl font-bold text-white">{date}</div>
            <div></div>
          </div>

          <div className="h-9"></div>

          <div className="container mx-auto p-8 bg-gray-700 rounded-lg max-w-96 max-h-96 bg-gradient-to-r from-gray-700 to-gray-800">
            <div className="text-3xl font-bold text-white">5 Day Forecast</div>
            <div className="h-6"></div>
            <div className="bg-gradient-to-r from-gray-500 to-gray-600 h-1 w-80 justify-center items-center"></div>
            <div className="h-4"></div>

            <div className="flex items-center">
              <h1 className="text-xl font-semibold p-3 text-white">{day1}</h1>
              <img src={icon} alt="icon" className="h-8 w-8" />
              <div className="p-3"></div>
              <img src={icon} alt="icon" className="h-8 w-8" />
              <div className="p-1"></div>
              <h1 className="text-xl font-semibold p-3 text-white">{temperature}°</h1>
              <h1 className="text-xl font-semibold p-3 text-white">{temperature}°</h1>
            </div>

            <div className="flex items-center">
              <h1 className="text-xl font-semibold p-3 text-white">{day2}</h1>
              <img src={icon} alt="icon" className="h-8 w-8" />
              <div className="p-3"></div>
              <img src={icon} alt="icon" className="h-8 w-8" />
              <div className="p-1"></div>
              <h1 className="text-xl font-semibold p-3 text-white">{temperature}°</h1>
              <h1 className="text-xl font-semibold p-3 text-white">{temperature}°</h1>
            </div>

            <div className="flex items-center">
              <h1 className="text-xl font-semibold p-3 text-white">{day3}</h1>
              <img src={icon} alt="icon" className="h-8 w-8" />
              <div className="p-3"></div>
              <img src={icon} alt="icon" className="h-8 w-8" />
              <div className="p-1"></div>
              <h1 className="text-xl font-semibold p-3 text-white">{temperature}°</h1>
              <h1 className="text-xl font-semibold p-3 text-white">{temperature}°</h1>
            </div>

            <div className="flex items-center">
              <h1 className="text-xl font-semibold p-3 text-white">{day4}</h1>
              <img src={icon} alt="icon" className="h-8 w-8" />
              <div className="p-3"></div>
              <img src={icon} alt="icon" className="h-8 w-8" />
              <div className="p-1"></div>
              <h1 className="text-xl font-semibold p-3 text-white">{temperature}°</h1>
              <h1 className="text-xl font-semibold p-3 text-white">{temperature}°</h1>
            </div>

            <div className="flex items-center">
              <h1 className="text-xl font-semibold p-3 text-white">{day5}</h1>
              <img src={icon} alt="icon" className="h-8 w-8" />
              <div className="p-3"></div>
              <img src={icon} alt="icon" className="h-8 w-8" />
              <div className="p-1"></div>
              <h1 className="text-xl font-semibold p-3 text-white">{temperature}°</h1>
              <h1 className="text-xl font-semibold p-3 text-white">{temperature}°</h1>
            </div>
          </div>
        </div>

        <div className="flex flex-col p-8 h-full">
          <div className="container mx-auto p-8 bg-gray-700 rounded-lg w-144 h-96 bg-gradient-to-r from-gray-700 to-gray-800">
            <div className="text-white">Today's Highlight</div>
            <div className="container mx-auto p-8 bg-gray-700 rounded-lg max-w-96 max-h-96 bg-gradient-to-r from-gray-500 to-gray-600"></div>
            <div className="h-6"></div>
            <div className="container mx-auto p-8 bg-gray-700 rounded-lg max-w-96 max-h-96 bg-gradient-to-r from-gray-500 to-gray-600">
              <h1 className="text-xl font-semibold p-3 text-white">Humidity {humidity}%</h1>
            </div>
          </div>

          <div className="h-9"></div>

          <div className="container mx-auto p-8 bg-gray-700 rounded-lg max-w-96 max-h-96 bg-gradient-to-r from-gray-700 to-gray-800">
            <div className="text-white">Weather condition map</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainView;
