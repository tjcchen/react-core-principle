// import React from 'react';
// import ReactDOM from 'react-dom';
// React.createElement('h1', null, 'Hello React'),

// utilize self-defined createElement & render, both functions are all mounted to core/index.js
import React from './core/react';
import ReactDOM from './core/react-dom2';

// 1. JSX syntax
// const element = (
//   <div className="virtual-dom">
//     <h2 onClick={ () => alert(2) }>React Core Principle</h2>
//     <p id="core">Elaborate the core concept of Reactjs</p>
//     <a href="https://create-react-app.dev/">Official Website</a>
//   </div>
// );

// 2. function components
// const App = (props) => (
//   <div className="virtual-dom">
//     <h2 onClick={ () => alert(3) }>Hi { props.title }</h2>
//     <p id="core">Elaborate the core concept of Reactjs</p>
//     <a href="https://create-react-app.dev/">Official Website</a>
//   </div>;
// );

// 3. function components with useState
// TODO: we need to move useState code logic to React later
const App = (props) => {
  const [count, setCount] = ReactDOM.useState(1);
  return (
    <div className="virtual-dom">
      <h3>Hi { props.title }</h3>
      <p>Count: { count }</p>
      <button onClick={ () => setCount(count+1) }>Count++</button>
    </div>
  );
};

const element = <App title="React Core Principle"/>;

ReactDOM.render(
  element,
  document.getElementById('root')
);