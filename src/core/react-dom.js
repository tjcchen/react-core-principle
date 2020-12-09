/**
 * Convert virtual DOM tree to real DOM nodes with render function. A virtual dom tree looks like this:
 * {
 *   "type": "div",
 *   "props": {
 *     "children": [
 *       {
 *         "type": "h2",
 *         "props": {
 *          "children": [
 *            {
 *               "type": "TEXT",
 *               "props": {
 *                 "nodeValue": "React Core Principle",
 *                 "children": []
 *               }
 *             }
 *           ]
 *          }
 *        },
 *        {
 *          "type": "a",
 *          "props": {
 *            "href": "https://create-react-app.dev/",
 *            "children": [
 *              {
 *                "type": "TEXT",
 *                "props": {
 *                  "nodeValue": "Official Website",
 *                  "children": []
 *                }
 *              }
 *            ]
 *          }
 *        }
 *      ]
 *   }
 * }
 */

/**
 * A self-defined ReactDOM.render() function.
 * 
 * @param {*} vdom 
 * @param {*} container
 */
const render = (vdom, container) => {
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
  
  // recursively append virtual dom children elements to parent node, parent node refers to current DOM node
  vdom.props.children.forEach(child => {
    render(child, dom);
  });

  container.appendChild(dom);

  // container.innerHTML = `<pre>${JSON.stringify(vdom, null, 2)}</pre>`; // print out vdom to html page
};

// next unit of work, we will initialize first task with render
let nextUnitOfWork = null;

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