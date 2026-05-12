import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; // 금고를 공급해주는 도구
import { store } from './store';        // 우리가 만든 금고
import App from './App';
import './App.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}> 
    <App />
  </Provider>
);