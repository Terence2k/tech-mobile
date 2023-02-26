import { useState, useCallback, useLayoutEffect } from 'react';
import { DimensionObject, UseDimensionsArgs, UseDimensionsHook } from './useDimensions.d';

function getDimensionObject(node: HTMLElement): DimensionObject {
  const rect: any = node.getBoundingClientRect();

  return {
    width: rect.width,
    height: rect.height,
    top: 'x' in rect ? rect.x : rect.top,
    left: 'y' in rect ? rect.y : rect.left,
    x: 'x' in rect ? rect.x : rect.left,
    y: 'y' in rect ? rect.y : rect.top,
    right: rect.right,
    bottom: rect.bottom,
  };
}

function useDimensions({
  liveMeasure = true,
}: UseDimensionsArgs = {}): UseDimensionsHook {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    x: 0,
    y: 0,
    right: 0,
    bottom: 0,
  });
  const [node, setNode] = useState<HTMLDivElement | undefined>();

  const ref = useCallback((args) => {
    setNode(args);
  }, []);

  useLayoutEffect(() => {
    if (node) {
      const measure = () => window.requestAnimationFrame(
        () => setDimensions(getDimensionObject(node)),
      );
      measure();

      if (liveMeasure) {
        window.addEventListener('resize', measure);
        window.addEventListener('scroll', measure);

        return () => {
          window.removeEventListener('resize', measure);
          window.removeEventListener('scroll', measure);
        };
      }
    }

    return () => { };
  }, [liveMeasure, node]);

  return [ref, dimensions, node];
}

export default useDimensions;
