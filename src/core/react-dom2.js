/**
 * Convert virtual DOM tree to real DOM nodes with Fiber Tree Algorithms(LinkedList)
 */

// nextUnitOfWork, we will initialize first task with render
let nextUnitOfWork = null;
// work in progress root node, this is to memorize working fiber root
let wipRoot        = null;
// current working node, this is to memorize working node
let currentRoot    = null;
// deleted fiber nodes collection
let deletions      = [];

/**
 * Create real dom node with virtual dom
 * 
 * @param {*} vdom 
 */
const createDom = (vdom) => {
  // create real dom element by virtual dom type
  const dom = vdom.type.toUpperCase() === 'TEXT' ? document.createTextNode('') : document.createElement(vdom.type);

  // mount properties to real DOM element by virtual dom attrs
  // Object.keys(vdom.props)
  //       .filter(key => key !== 'children')
  //       .forEach(attr => {
  //         // TODO: we also need to add event handling and property compatibility solutions later
  //         // in this case, attr refers to nodeValue and href,
  //         // nodeValue used for TextNode element
  //         dom[attr] = vdom.props[attr];
  //       });

  updateDom(dom, {}, vdom.props);
  
  return dom;
};

/**
 * Update DOM:
 * 1. bypass children properties
 * 2. cancel update if old dom node exist
 * 3. add node if new dom node exist
 * 
 * TODO: we also need to handle event cross browsers issues in the near future
 * 
 * @param {*} dom 
 * @param {*} prevProps 
 * @param {*} nextProps 
 */
const updateDom = (dom, prevProps, nextProps) => {
  // old node props
  Object.keys(prevProps)
        .filter(name => name !== 'children')
        .filter(name => !(name in nextProps))
        .forEach(name => {
          if (name.slice(0, 2) === 'on') {
            dom.removeEventListener(name.slice(2).toLowerCase(), prevProps[name], false);
          } else {
            dom[name] = '';
          }
        });

  // next node props
  Object.keys(nextProps)
        .filter(name => name !== 'children')
        .forEach(name => {
          if (name.slice(0, 2) === 'on') {
            dom.addEventListener(name.slice(2).toLowerCase(), nextProps[name], false);
          } else {
            dom[name] = nextProps[name];
          }
        });
};

/**
 * A self-defined ReactDOM.render() function.
 * 
 * @param {*} vdom 
 * @param {*} container
 */
const render = (vdom, container) => {
  // simple fiber tree
  wipRoot = {
    dom: container,
    props: {
      children: [vdom]
    },
    base: currentRoot // store previous fiber node
  };

  nextUnitOfWork = wipRoot;
  
  // recursively append virtual dom children elements to parent node, parent node refers to current DOM node
  // vdom.props.children.forEach(child => {
  //   render(child, dom);
  // });
  // container.appendChild(dom);
};

/**
 * Commit root fiber node
 */
const commitRoot = () => {
  // delete fiber nodes in deletions with commitWork
  deletions.forEach(commitWork);

  commitWork(wipRoot.child);

  // cancel wip
  currentRoot = wipRoot;
  wipRoot = null;
};

/**
 * Commit each fiber node, including child, sibling etc. This function actually to build dom tree
 * 
 * @param {*} fiber 
 */
const commitWork = (fiber) => {
  if (!fiber) {
    return;
  }

  let domParentFiber = fiber.parent;
  
  // recursively find domParentFiber that contains dom property
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }

  const domParent = domParentFiber.dom;

  if (fiber.effectTag === 'REPLACEMENT' && fiber.dom !== null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom != null) {
    updateDom(
      fiber.dom,
      fiber.base.props,
      fiber.props
    );
  } else if (fiber.effectTag === 'DELETION') {
    // domParent.removeChild(fiber.dom);
    commitDeletion(fiber, domParent);
  } 

  commitWork(fiber.child);
  commitWork(fiber.sibling);
};

/**
 * Commit Deletion
 * 
 * @param {*} fiber 
 * @param {*} domParent 
 */
const commitDeletion = (fiber, domParent) => {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  }
};

/**
 * Dispatch diff or render tasks 
 * 
 * @param {*} deadline 
 */
const workLoop = (deadline) => {
  // performUnitOfWork while we still have work and current timeframe is still existing,
  // we didn't consider deadline.didTimeout at this time, will resolve it later
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  // commit root when we do not have nextUnitOfWork and wipRoot still exits
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  window.requestIdleCallback(workLoop);
};

// start idle callback with workloop
window.requestIdleCallback(workLoop);

/**
 * reconcile working in progress fiber and children fibers
 * 
 * Note:
 * the operator '&&' will return the value of the second operand if the first is truthy,
 * and it will return the value of the first operand if it is by itself falsy.
 * 
 * Eg:
 * true && 'foo';     // 'foo'
 * NaN && 'anything'; // NaN
 * 0 && 'anything';   // 0
 * 
 * @param {*} wipFiber work in progress fiber
 * @param {*} elements children fibers
 */
const reconcileChildren = (wipFiber, elements) => {
  let index = 0;
  let prevSibling = null;
  let oldFiber = wipFiber.base && wipFiber.base.child;

  // build fiber tree with while loop
  while (index < elements.length || oldFiber !== null) {
    let element = elements[index];
    let newFiber = null;

    // compare old fiber with current fiber, we start with type comparison
    const sameType = oldFiber && element && oldFiber.type === element.type;

    // reuse node to update if two elements are same type
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        base: oldFiber,
        effectTag: 'UPDATE'
      };
    }

    // replace fiber node
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        base: null,
        effectTag: 'REPLACEMENT'
      };
    }

    // delete old node
    if (oldFiber && !sameType) {
      oldFiber.effectTag = 'DELETION';
  
      deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    // const newFiber = {
    //   type: element.type,
    //   props: element.props,
    //   parent: wipFiber,
    //   dom: null
    // };

    if (index === 0 ) {
      wipFiber.child = newFiber;
    } else if (element) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
};

/**
 * Retrieve nextUnitOfWork by current fiber. 
 * 
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
  console.log('performUnitOfWork: ');
  console.log(fiber);

  // add function component support
  const isFunctionComponent = fiber.type instanceof Function;

  if (isFunctionComponent) {
    updateFunctionComponent(fiber); // function component
  } else {
    updateRegularComponent(fiber); // regular html dom component
  }

  //-------------------------------------------------
  // find nextUnitOfWork, we start with child node
  //-------------------------------------------------
  if (fiber.child) {
    return fiber.child;
  }

  // if child does not exist, we find sibling element
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }

    // if we do not have sibling element either, find parent element
    nextFiber = nextFiber.parent;
  }
};

/**
 * Update function component
 * 
 * @param {*} fiber 
 */
const updateFunctionComponent = (fiber) => {
  const children = [fiber.type(fiber.props)]; // fiber.type is function already

  reconcileChildren(fiber, children);
};

/**
 * Update regular html component
 * 
 * @param {*} fiber 
 */
const updateRegularComponent = (fiber) => {
  // createDom with fiber if fiber.dom does not exist
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // append current fiber node when fiber has parent, this is real dom manipulation
  // if (fiber.parent) {
  //   fiber.parent.dom.appendChild(fiber.dom);
  // }

  const elements = fiber.props.children;

  // reconcile current fiber with children fibers
  reconcileChildren(fiber, elements);
};

// eslint-disable-next-line
export default {
  render
};