/**
 * Convert virtual DOM tree to real DOM nodes with Fiber Tree Algorithms(LinkedList)
 */

// nextUnitOfWork, we will initialize first task with render
let nextUnitOfWork = null;

/**
 * Create real dom node with virtual dom
 * 
 * @param {*} vdom 
 */
const createDom = (vdom) => {
  // create real dom element by virtual dom type
  const dom = vdom.type.toUpperCase() === 'TEXT' ? document.createTextNode('') : document.createElement(vdom.type);

  // mount properties to real DOM element by virtual dom attrs
  Object.keys(vdom.props)
        .filter(key => key !== 'children')
        .forEach(attr => {
          // TODO: we also need to add event handling and property compatibility solutions later
          // in this case, attr refers to nodeValue and href,
          // nodeValue used for TextNode element
          dom[attr] = vdom.props[attr];
        });
  
  return dom;
};

/**
 * A self-defined ReactDOM.render() function.
 * 
 * @param {*} vdom 
 * @param {*} container
 */
const render = (vdom, container) => {

  // simple fiber tree
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [vdom]
    }
  };
  
  // recursively append virtual dom children elements to parent node, parent node refers to current DOM node
  // vdom.props.children.forEach(child => {
  //   render(child, dom);
  // });
  // container.appendChild(dom);
};

/**
 * Dispatch diff or render tasks 
 * 
 * @param {*} deadline 
 */
const workLoop = (deadline) => {
  // performUnitOfWork while we still have work and current timeframe is still existing
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  window.requestIdleCallback(workLoop);
};

// start idle callback with workloop
window.requestIdleCallback(workLoop);

/**
 * Retrieve nextUnitOfWork by current work
 * 
 * @param {*} fiber 
 */
const performUnitOfWork = (fiber) => {
  
  
}

// eslint-disable-next-line
export default {
  render
};