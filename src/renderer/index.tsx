import { createRoot } from 'react-dom/client';
import LocationManager from './LocationManager';
import './styles.css';
import App from './App';


const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);


//root.render(<LocationManager />);