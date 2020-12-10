// import React from 'react';
// import ReactDOM from 'react-dom';
// React.createElement('h1', null, 'Hello React'),

// utilize self-defined createElement & render, both functions are all mounted to core/index.js
import React from './core/react';
import ReactDOM from './core/react-dom2';

const element = (
  <div className="virtual-dom">
    <h2 onClick={ () => alert(2) }>React Core Principle</h2>
    <p id="core">Elaborate the core concept of Reactjs</p>
    <a href="https://create-react-app.dev/">Official Website</a>
  </div>
);

ReactDOM.render(
  element,
  document.getElementById('root')
);