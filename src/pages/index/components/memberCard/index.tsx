import React from 'react';
import PropTypes from 'prop-types';
// import classNames from 'classnames';

import styles from './index.scss';

const Index: React.FC = (props: any) => {
  const {
    style, label, desc, onClick,
  } = props;

  return (
    <>
      {
        label && desc && (
          <div className={styles.layout} style={style} onClick={() => onClick()}>
            <div className={styles.layout__bd}>
              <div className={styles.icon} />
              <div className={styles.label}>{label}</div>
            </div>
            <div className={styles.layout__hd}>{desc}</div>
            <div className={styles.layout__ft} />
          </div>
        )
      }
    </>
  );
};

Index.defaultProps = {
  style: {},
  label: '',
  desc: '',
  onClick: () => { },
};

Index.propTypes = {
  style: PropTypes.objectOf(PropTypes.string),
  label: PropTypes.string,
  desc: PropTypes.string,
  onClick: PropTypes.func,
};

export default Index;
