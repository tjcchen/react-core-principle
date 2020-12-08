// import React from 'react';
// import ReactDOM from 'react-dom';
// React.createElement('h1', null, 'Hello React'),

// utilize self-defined createElement & render
import React from './core';
const ReactDOM = React;

const element = (
  <div>
    <h2>React Core Principle</h2>
    <p>Elaborate the core concept of Reactjs</p>
    <a href="https://create-react-app.dev/">Official Website</a>
  </div>
);

ReactDOM.render(
  element,
  document.getElementById('root')
);