import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd-mobile';
import classNames from 'classnames';

import styles from './index.scss';

const SELECTED = require('./images/selectIcon.png');

const ThemeSelect: React.FC<any> = (props: any) => {
  const {
    browser, list = [], value, onChange,
  } = props;
  const item = list.find((i: any) => i.id === value);
  const [fold, setFold] = React.useState(true);

  return (
    <div className={styles.selectLayout} onClickCapture={() => setFold(false)}>
      <span className={styles.selectLabel}>主题</span>
      <div className={styles.selectValue}>{item && item.title}</div>
      <Icon size="xxs" type="down" />
      {
        !fold
        && (
          <div className={classNames(styles.fixSelection, {
            [styles.pc]: !browser.isMobileBrowser,
          })}
          >
            <div className={styles.fixSelectionClose}>
              <Icon type="cross" onClick={() => setFold(true)} />
            </div>
            {
              list.map((listItem, listIndex) => (
                <div
                  className={styles.selection}
                  key={listIndex.toString()}
                  onClick={() => {
                    onChange(listItem.id);
                    setFold(true);
                  }}
                >
                  <div className={`${styles.selectionValue} ${value === listItem.id ? styles.active : ''}`}>
                    {listItem.title}
                  </div>
                  {
                    value === listItem.id && <img src={SELECTED} alt="" className={styles.activeIcon} />
                  }
                </div>
              ))
            }
          </div>
        )
      }
    </div>
  );
};

ThemeSelect.defaultProps = {
  list: [],
  value: '',
  onChange: () => { },
};

ThemeSelect.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    id: PropTypes.string,
  })),
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default ThemeSelect;
