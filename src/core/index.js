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
const createElement = (type, props, ...children) => {
  console.log('createElement: ');
  delete props.__source;

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
 * Self-defined ReactDOM.render() function
 * 
 * @param {*} vdom 
 * @param {*} container 
 */
const render = (vdom, container) => {
  console.log('render: ');
  console.log(vdom);

  container.innerHTML = `<pre>${JSON.stringify(vdom, null, 2)}</pre>`;
};

// eslint-disable-next-line
export default {
  createElement,
  render
};