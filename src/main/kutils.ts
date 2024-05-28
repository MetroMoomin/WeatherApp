import{ setLat } from './main'
import{ setLon } from './main'


type DayOfWeek = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

interface WeekData {
  daysOfWeek: DayOfWeek[];
  singleDate: string;
}

interface Location
{
  lon: number;
  lat: number;
  city: string;
}

const getNextFiveDays = async (): Promise<WeekData | null> => {
  const today = new Date();
  const daysOfWeek: DayOfWeek[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const nextFiveDays: DayOfWeek[] = [];

  for (let i = 1; i <= 5; i++) {
    const nextDate = new Date();
    nextDate.setDate(today.getDate() + i);
    const dayOfWeek = daysOfWeek[nextDate.getDay()];
    nextFiveDays.push(dayOfWeek);
  }

  const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

  return { daysOfWeek: nextFiveDays, singleDate: formattedDate };
};

const getLocation = async (): Promise<Location | null> => {
  try {

      const responseIp = await fetch('https://api.ipify.org?format=json');
      const ipData = await responseIp.json();
      const ipAddress = ipData.ip;
      const response = await fetch(`https://ipapi.co/${ipAddress}/json/ `);

      if (!response.ok) {
          throw new Error('Failed to fetch location data');
      }

      const data = await response.json();

      const { city, latitude, longitude } = data;

      if (!city || !latitude || !longitude) {
          throw new Error('Location data not found in API response');
      }

      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);

      setLat(lat);
      setLon(lon);

      return { city, lat, lon };
  } catch (error) {
      console.error('Error fetching location:', error);
      return null;
  }
};

export { getNextFiveDays, WeekData as DayOfWeek };
export { getLocation, Location}