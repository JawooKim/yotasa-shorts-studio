import { useEffect, useRef } from 'react';

// Esc closes only the top-most open modal (the one opened last).
type Entry = { current: () => void };
const stack: Entry[] = [];
let bound = false;

function onKeyDown(e: KeyboardEvent) {
  if (e.key !== 'Escape' || e.isComposing || stack.length === 0) return;
  e.preventDefault();
  e.stopPropagation();
  stack[stack.length - 1].current();
}

export function useEscapeKey(active: boolean, handler: () => void) {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => {
    if (!active) return;
    if (!bound) {
      window.addEventListener('keydown', onKeyDown);
      bound = true;
    }
    const entry: Entry = ref;
    stack.push(entry);
    return () => {
      const i = stack.lastIndexOf(entry);
      if (i >= 0) stack.splice(i, 1);
    };
  }, [active]);
}
