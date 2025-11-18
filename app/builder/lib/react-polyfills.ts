/**
 * Polyfill for ReactDOM.findDOMNode which was removed in React 19
 * This is needed for react-quill compatibility
 * 
 * This polyfill patches ReactDOM.findDOMNode before react-quill tries to use it
 */
if (typeof window !== "undefined") {
  // Patch ReactDOM.findDOMNode before any imports that might use it
  const patchFindDOMNode = () => {
    try {
      const ReactDOM = require("react-dom");
      
      if (ReactDOM && typeof ReactDOM.findDOMNode === "undefined") {
        // Polyfill findDOMNode for React 19 compatibility
        ReactDOM.findDOMNode = function(componentOrElement: any): Element | Text | null {
          if (componentOrElement == null) {
            return null;
          }
          
          // If it's already a DOM node, return it
          if (componentOrElement.nodeType === 1 || componentOrElement.nodeType === 3) {
            return componentOrElement;
          }
          
          // If it has a current property (ref object), use that
          if (componentOrElement.current) {
            return componentOrElement.current;
          }
          
          // For class components with refs
          if (componentOrElement.refs) {
            for (const key in componentOrElement.refs) {
              const ref = componentOrElement.refs[key];
              if (ref && (ref.nodeType === 1 || ref.nodeType === 3)) {
                return ref;
              }
            }
          }
          
          // Try to get from React internals (this might not work in React 19)
          // But we'll try anyway
          if (componentOrElement._reactInternalFiber || componentOrElement._reactInternalInstance) {
            // React 19 uses a different internal structure
            // This is a best-effort fallback
            return null;
          }
          
          return null;
        };
      }
    } catch (e) {
      // Silently fail if ReactDOM is not available
      console.warn("Could not polyfill findDOMNode:", e);
    }
  };
  
  // Patch immediately
  patchFindDOMNode();
  
  // Also patch after a short delay to ensure ReactDOM is loaded
  if (typeof window !== "undefined") {
    setTimeout(patchFindDOMNode, 0);
  }
}

