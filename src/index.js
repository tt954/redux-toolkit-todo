import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";

import './index.css';
import App from './App';
import store from './store/store';
import { fetchTodos } from './reducers/todosReducer';

import reportWebVitals from './reportWebVitals';

document.addEventListener('DOMContentLoaded', () => {
  window.store = store //testing purposes

  store.dispatch(fetchTodos())

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
