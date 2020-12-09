/**
 * Convert JSX syntax to virtual dom object with createElement
 */

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
 * Self-defined React.createElement() function.
 * 
 * @param {*} type 
 * @param {*} props 
 * @param  {...any} children 
 */
const createElement = (type, props, ...children) => {
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

// eslint-disable-next-line
export default {
  createElement
};