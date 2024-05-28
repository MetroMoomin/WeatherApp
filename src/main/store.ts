
import Store from 'electron-store';

interface Location {
  city: string;
  lat: number;
  lon: number;
}

interface StoreSchema {
  locations: Location[];
  autoLocationEnabled: boolean;
}

const schema: Store.Schema<StoreSchema> = {
  locations: {
    type: 'array',
    default: [],
    items: {
      type: 'object',
      properties: {
        city: { type: 'string' },
        lat: { type: 'number' },
        lon: { type: 'number' },
      },
      required: ['city', 'lat', 'lon'],
    },
  },
  autoLocationEnabled: {
    type: 'boolean',
    default: false,
  },
};

const store = new Store<StoreSchema>({ schema });

export default store;


// const Store = require('electron-store');

// const schema = {
//     general: {
//         type: 'object',
//         properties: {
//             gpu: { type: 'boolean' },
//             openOnStartup: { type: 'boolean' },
//             tray: { type: 'boolean' },
//         },
//         default: {
//             gpu: true,
//             openOnStartup: false,
//             tray: true,
//         }
//     },
//     theme: {
//         type: 'object',
//         properties: {
//             modes: {
//                 type: 'string',
//                 enum: ['dark', 'light', 'system'],
//                 default: 'dark',
//             },
//             themes: {
//                 type: 'object',
//                 properties: {
//                     name: { type: 'string'},
//                     colours: {
//                         type: 'array',
//                         items: {
//                             type: 'string'
//                         },
//                         // TODO: Add default theme
//                         default: [],
//                     }
//                 }
//             }
//         }
//     }
// };

// const store = new Store({schema});

// export default store;




