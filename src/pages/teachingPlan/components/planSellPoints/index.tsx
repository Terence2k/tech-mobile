import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

const CHECK_ICON = require('./images/checkIcon.png');

const PlanSellPoints: React.FC<any> = (props: any) => {
  const { list } = props;
  return (
    <div>
      {
        list.map(
          (item, index) => (
            <div className={styles.sellPoint} key={index.toString()}>
              <img src={CHECK_ICON} alt="" className={styles.sellPointIcon} />
              {item}
            </div>
          ),
        )
      }
    </div>
  );
};

PlanSellPoints.defaultProps = {
  list: [],
};

PlanSellPoints.propTypes = {
  list: PropTypes.arrayOf(PropTypes.string),
};

export default PlanSellPoints;
