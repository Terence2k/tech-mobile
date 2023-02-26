import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

const RankTab: React.FC<any> = (props: any) => {
  const { tabs, active, onTabClick } = props;

  return (
    <div className={styles.tabs}>
      {
        tabs.map((item, index) => (
          <div
            className={`${styles.tabsItem} ${active === item.id ? styles.tabsItemActive : ''} textOverflow`}
            key={index.toString()}
            onClick={() => onTabClick(item.id)}
          >
            {item.title}
          </div>
        ))
      }
    </div>
  );
};

RankTab.defaultProps = {
  onTabClick: () => {},
};

RankTab.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    id: PropTypes.string,
  })).isRequired,
  active: PropTypes.string.isRequired,
  onTabClick: PropTypes.func,
};

export default RankTab;
