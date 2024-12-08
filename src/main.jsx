import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Store from "../src/states/Store.jsx";
import { Provider } from 'react-redux';
import { StrictMode } from 'react';

createRoot(document.getElementById('root')).render(
  <Provider store={Store}>
    <App />
  </Provider>
)
