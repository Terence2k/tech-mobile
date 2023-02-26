import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

const InnerModule: React.FC<any> = (props: any) => {
  const {
    title, children, height, onReachBottom,
  } = props;
  const scrollRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className={styles.moduleInner}>
      <div className={styles.moduleHeader}>{title}</div>
      <div
        ref={scrollRef}
        style={{ padding: '30px 15px', overflow: 'auto', height: `${height}px` }}
        onScroll={() => {
          const { current } = scrollRef;
          if (current && (current.scrollTop >= current.scrollHeight - current.clientHeight)) {
            onReachBottom();
          }
        }}
      >
        {children}
      </div>
    </div>
  );
};

InnerModule.defaultProps = {
  height: '',
  onReachBottom: () => {},
};

InnerModule.propTypes = {
  title: PropTypes.string.isRequired,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onReachBottom: PropTypes.func,
};

export default InnerModule;
