import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

const Index: React.FC = (props: any) => {
  const { style, list, onClick } = props;

  return (
    <div className={styles.layout} style={style} onClick={onClick}>
      <div className={styles.layout__hd}>领券</div>
      <div className={styles.layout__bd}>
        {
          [...list].map((item, index) => (
            <div key={index.toString()}>
              <div className={styles.left} />
              <div className={styles.center}>{item.name}</div>
              <div className={styles.right} />
            </div>
          ))
        }
      </div>
      <div className={styles.layout__ft} />
    </div>
  );
};

Index.defaultProps = {
  style: {},
};

Index.propTypes = {
  style: PropTypes.objectOf(PropTypes.string),
  list: PropTypes.arrayOf(PropTypes.shape({
    ticketId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    useLimit: PropTypes.number.isRequired,
    type: PropTypes.number.isRequired,
    discount: PropTypes.number.isRequired,
  })).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Index;
