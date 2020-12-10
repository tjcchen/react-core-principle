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
 * Retrieve nextUnitOfWork by current fiber
 * nextUnitOfWork = {
 *   dom: container,
 *   props: {
 *     children: [vdom]
 *   }
 *  };
 * 
 * fiber = {
 *   dom: 'self node'
 *   parent: 'parent node'
 *   child: 'first child node'
 *   sibling: 'sibling node'
 * };
 * 
 * @param {*} fiber 
 */
const performUnitOfWork = (fiber) => {
  // createDom with fiber if fiber.dom does not exist
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // append current fiber node when fiber has parent
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }

  const elements = fiber.props.children;

  let index = 0;
  let prevSibling = null;

  // build fiber tree with while loop
  while (index < elements.length) {
    let element = elements[i];
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null
    };

    if (index === 0 ) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = fiber;
    index++;
  }

  // find nextUnitOfWork, we start with child
  if (fiber.child) {
    return fiber.child;
  }

  // if child does not exist, we find sibling element
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.siblings) {
      return nextFiber.sibling;
    }

    // if we do not have sibling element either, find parent element
    nextFiber = newFiber.parent;
  }
};

// eslint-disable-next-line
export default {
  render
};