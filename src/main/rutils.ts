import { ipcRenderer } from 'electron';

interface LocationData {
  cityName: string;
  lat: number;
  lon: number;
}

export async function fetchSelectedLocation(): Promise<LocationData | undefined> {
  try {
    const locationData: LocationData = await ipcRenderer.invoke('get-selected-location');
    return locationData;
  } catch (error) {
    console.error('Failed to fetch selected location:', error);
    return undefined;
  }
}