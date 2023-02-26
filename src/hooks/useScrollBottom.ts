import { useState, useEffect, MutableRefObject } from 'react';

interface IProp<R> {
  ref: MutableRefObject<R | null>,
}

/**
 * Check scroll.
 */
const useScrollBottom = <R extends HTMLDivElement>({
  ref,
}: IProp<R>) => {
  const [isScrollBottom, setIsScrollBottom] = useState<boolean>(false);

  useEffect(() => {
    const onScroll = () => {
      const { current } = ref;
     console.log('success');

      if (current) {
        setIsScrollBottom(current.scrollTop >= (current.scrollHeight - current.clientHeight - 100));
      }
    };

    const { current } = ref;
    if (current) {
      current.addEventListener('scroll', onScroll);
    }

    return () => {
      if (current) {
        current.removeEventListener('scroll', onScroll);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current]);

  return [isScrollBottom];
};

export default useScrollBottom;
