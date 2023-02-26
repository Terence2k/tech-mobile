import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './index.scss';

const Index: React.FC = (props: any) => {
  const {
    style, effect, status, color, backgroundColor, children,
  } = props;

  const customStyle = {};

  if (effect === 'dark') {
    Object.assign(customStyle, {
      color,
      backgroundColor,
    }, style);
  } else if (effect === 'plain') {
    Object.assign(customStyle, {
      color,
      border: `1px solid ${color}`,
      backgroundColor: '#00000000',
    }, style);
  } else if (effect === 'custom') {
    Object.assign(customStyle, {}, style);
  }

  return (
    <div
      className={classNames(styles.layout, styles[effect], styles[status])}
      style={customStyle}
    >
      {children}
    </div>
  );
};

Index.defaultProps = {
  style: {},
  effect: 'dark',
  status: 'wait',
  color: '#ffffff',
  backgroundColor: 'rgb(65, 93, 150)',
};

Index.propTypes = {
  // 样式
  style: PropTypes.objectOf(PropTypes.string),
  // 主题（代码暂无实现，后续加入）
  effect: PropTypes.oneOf(['dark', 'plain', 'custom']),
  // 状态
  status: PropTypes.oneOf(['wait', 'doing', 'done']),
  // 字段颜色
  color: PropTypes.string,
  // 背景色
  backgroundColor: PropTypes.string,
};

export default Index;
