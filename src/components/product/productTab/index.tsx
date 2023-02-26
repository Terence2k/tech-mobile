import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './index.scss';

const Index: React.FC = (props: any) => {
  const {
    style, active, tabs, onChange,
  } = props;

  return (
    <div className={styles.layout} style={style}>
      {
        [...tabs].map((item, index) => (
          <div
            key={index.toString()}
            className={classNames({
              [styles.active]: active === item.value,
            })}
            onClick={() => onChange({ ...item })}
          >
            {item.label}
          </div>
        ))
      }
    </div>
  );
};

Index.defaultProps = {
  style: {},
  onChange: () => { },
};

Index.propTypes = {
  style: PropTypes.objectOf(PropTypes.string),
  //
  active: PropTypes.string.isRequired,
  //
  tabs: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired).isRequired,
  // 当前激活的标签改变时触发
  onChange: PropTypes.func,
};

export default Index;
