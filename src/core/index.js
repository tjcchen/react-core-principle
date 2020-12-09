/**
 * Create Text Virtual DOM Element
 * 
 * @param {*} text text innerHTML
 */
const createTextElement = (text) => {
  return {
    type: 'TEXT',
    props: {
      nodeValue: text,
      children: []
    }
  }
};

/**
 * Self-defined React.createElement() function
 * 
 * @param {*} type 
 * @param {*} props 
 * @param  {...any} children 
 */
const createElement = (type, props, ...children) => {  console.log('[createElement]: ');
  delete props.__source;
  delete props.__self;

  return {
    type,
    props: {
      ...props,
      // put children into props, therefore we can obtain children by this.props.children
      children: children.map(child => {
        return typeof child === 'object' ? child : createTextElement(child);
      })
    }
  };
};

/**
 * Self-defined ReactDOM.render() function. A virtual dom tree looks like this:
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
 * 
 * @param {*} vdom 
 * @param {*} container
 */
const render = (vdom, container) => {
  console.log('[render]: ');

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

  // print out vdom to html page
  // container.innerHTML = `<pre>${JSON.stringify(vdom, null, 2)}</pre>`;
};

// eslint-disable-next-line
export default {
  createElement,
  render
};