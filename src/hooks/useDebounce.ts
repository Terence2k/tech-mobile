import { useState, useEffect } from 'react';
import useDebounceFn from './useDebounceFn';

export interface DebounceOptions {
  wait?: number;
  leading?: boolean;
  trailing?: boolean;
}

function useDebounce<T>(value: T, options?: DebounceOptions) {
  const [debounced, setDebounced] = useState(value);

  const { run } = useDebounceFn(() => {
    setDebounced(value);
  }, options);

  useEffect(() => {
    run();
  }, [value]);

  return debounced;
}

export default useDebounce;
