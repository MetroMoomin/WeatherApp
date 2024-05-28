import path from 'path';
import { app, BrowserWindow, shell, ipcMain, IpcMainInvokeEvent } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { getWeatherData, test } from './weather-data';
import { getNextFiveDays, getLocation } from './kutils';
import store from './store';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      nodeIntegration: true,
      // contextIsolation: false
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  
  new AppUpdater();
};



app.on('window-all-closed', () => {
 
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
     
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);


let globalLat: number = 0;
let globalLon: number = 0;
export const setLat = (lat: number) => {
  globalLat = lat;
};

export const setLon = (lon: number) => {
  globalLon = lon;
};

ipcMain.handle('update-coordinates', (event, { lat, lon }) => {
  setLat(lat);
  setLon(lon);
});

const fs = require('fs');


ipcMain.handle('check-file-exists', (event, path) => fs.existsSync(path));
ipcMain.handle('test', test);
ipcMain.handle('get-next-five-days', getNextFiveDays);
ipcMain.handle('get-location', getLocation);


ipcMain.handle('get-locations', () => {
  const locations = store.get('locations');
  console.log('Retrieved locations:', locations);  
  return locations;
});

ipcMain.handle('save-location', (event, location) => {
  const locations = store.get('locations');
  locations.push(location);
  store.set('locations', locations);
  console.log('Saved new location:', location);  
  return locations;
});

ipcMain.handle('remove-location', (event, locationName) => {
  let locations = store.get('locations');
  locations = locations.filter(loc => loc.city !== locationName);
  store.set('locations', locations);
  console.log('Removed location:', locationName);  
  return locations;
});

ipcMain.handle('get-auto-location-enabled', () => {
  const autoLocationEnabled = store.get('autoLocationEnabled');
  console.log('Auto-location enabled:', autoLocationEnabled); 
  return autoLocationEnabled;
});

ipcMain.handle('set-auto-location-enabled', (event, isEnabled) => {
  store.set('autoLocationEnabled', isEnabled);
  console.log('Set auto-location enabled to:', isEnabled);  
  return isEnabled;
});


ipcMain.handle('get-weather-data', async (event: IpcMainInvokeEvent, lat: number, lon: number) => {
  return await getWeatherData(lat, lon);
});
