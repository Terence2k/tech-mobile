import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

const Index: React.FC = (props: any) => {
  const { style, list, spacer } = props;

  return (
    <div className={styles.propertyLayout} style={style}>
      {
        [...list].map((item, index) => (
          <div key={index.toString()}>
            {index > 0 && <label className={styles.spacer}>{spacer}</label>}
            {item}
          </div>
        ))
      }
    </div>
  );
};

Index.defaultProps = {
  style: {},
  list: [],
  spacer: '/',
};

Index.propTypes = {
  style: PropTypes.objectOf(PropTypes.string),
  list: PropTypes.arrayOf(PropTypes.string),
  spacer: PropTypes.string,
};

export default Index;
