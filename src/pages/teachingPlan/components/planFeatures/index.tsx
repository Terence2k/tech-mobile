import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

const PlanFeatures: React.FC<any> = (props: any) => {
  const { list } = props;
  return (
    <div className={styles.featureList}>
      {
        list.map(
          (item, index) => <div className={`${styles.featureItem} textOverflow`} key={index.toString()}><span className={styles.featureItemInner}>{item}</span></div>,
        )
      }
    </div>
  );
};

PlanFeatures.defaultProps = {
  list: [],
};

PlanFeatures.propTypes = {
  list: PropTypes.arrayOf(PropTypes.string),
};

export default PlanFeatures;
