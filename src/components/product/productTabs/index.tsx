import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

const productTabs: React.FC = (props: any) => {
  const { tabArr, activeTab, onTabChange } = props;

  return (
    <div className="flexLayout">
      {
        tabArr.map((item, index) => (
          <div
            className={`${styles.tabsItem} ${index === activeTab ? styles.activeTab : ''} flexLayout`}
            key={index.toString()}
            onClick={() => { onTabChange(index); }}
          >
            <span className={styles.tabsItemInner}>{item.title}</span>
          </div>
        ))
      }
    </div>
  );
};

productTabs.defaultProps = {
  tabArr: [],
  activeTab: 0,
  onTabChange: () => {},
};

productTabs.propTypes = {
  tabArr: PropTypes.arrayOf(PropTypes.object),
  activeTab: PropTypes.number,
  onTabChange: PropTypes.func,
};

export default productTabs;
