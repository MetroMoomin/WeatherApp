import { contextBridge, ipcRenderer } from 'electron';
import { WeatherData } from './weather-data';
import { DayOfWeek } from './kutils';
import { Location } from './kutils';

const electronHandler = {
  getWeatherData: async (lat: number, lon: number): Promise<WeatherData | null> =>
    ipcRenderer.invoke('get-weather-data', lat, lon),

  test: async (): Promise<string | null> =>
    ipcRenderer.invoke('test'),

  getNextFiveDays: async (): Promise<DayOfWeek | null> =>
    ipcRenderer.invoke('get-next-five-days'),

  getLocation: async (): Promise<Location | null> =>
    ipcRenderer.invoke('get-location'),

  getLocations: async (): Promise<Location[]> =>
    ipcRenderer.invoke('get-locations'),

  saveLocation: async (location: Location): Promise<Location[]> =>
    ipcRenderer.invoke('save-location', location),

  removeLocation: async (locationName: string): Promise<Location[]> =>
    ipcRenderer.invoke('remove-location', locationName),

  getAutoLocationEnabled: async (): Promise<boolean> =>
    ipcRenderer.invoke('get-auto-location-enabled'),

  setAutoLocationEnabled: async (isEnabled: boolean): Promise<boolean> =>
    ipcRenderer.invoke('set-auto-location-enabled', isEnabled),
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
