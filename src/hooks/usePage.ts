import { useRef, useEffect, MutableRefObject } from 'react';
import { useSelector } from 'react-redux';
import { useScrollBottom, useDebounceFn } from 'hooks';
import { TState } from '@/models/types';
import { IShare } from '@/utils/model';
import commonWeixin from 'common/weixin';
// import { delay } from 'redux-saga';
// import { select } from 'redux-saga/effects';

interface IProp {
  elementId?: string,
  onLoad?: () => void;
  onReachBottom?: () => void;
  onShareAppMessage?: () => Promise<IShare>;
}

/**
 * Page hook(Lifecycles).
 */
const usePage = <T extends IProp, R extends HTMLDivElement>({
  elementId = 'root',
  onLoad,
  onReachBottom,
  onShareAppMessage,
}: T): [MutableRefObject<R | null>] => {
  const ref = useRef<R | null>(null);
  const [isScrollBottom] = useScrollBottom<R>({ ref });
  const weixin = useSelector((state: TState) => state.weixin);
  const client = useSelector((state: TState) => state.client);
  const { run, cancel } = useDebounceFn(
    () => {
      const { isJssdkConfigReady } = weixin;
      const { logo } = client;

      if (isJssdkConfigReady && typeof onShareAppMessage === 'function') {
        onShareAppMessage().then((result) => {
          if (result) {
            const options: IShare = { ...result };
            options.imgUrl = logo;
            commonWeixin.updateShareData(options);
          }
        });
      }
    },
    {
      wait: 500,
    },
  );

  useEffect(() => {
    if (elementId && !ref.current) {
      ref.current = document.getElementById(elementId) as R | null;
    }
  }, [elementId]);

  useEffect(() => {
    if (typeof onLoad === 'function') {
      onLoad();
    }
  }, [onLoad]);

  useEffect(() => {
    if (isScrollBottom && typeof onReachBottom === 'function') {
      onReachBottom();
    }
  }, [isScrollBottom, onReachBottom]);

  useEffect(() => {
    run();
    return () => cancel();
  });

  return [ref];
};

export default usePage;
