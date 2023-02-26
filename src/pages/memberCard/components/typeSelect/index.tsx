import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

const TypeSelect: React.FC<any> = (props: any) => {
  const { list, active, onChange } = props;

  return (
    <div className={styles.typesLayout}>
      {
        list.map((item, index) => (
          <div key={index.toString()} className={`${styles.typesItem} ${active === item.id ? styles.activeItem : ''}`} onClick={() => onChange(item.id)}>
            {item.label}
          </div>
        ))
      }
    </div>
  );
};

TypeSelect.defaultProps = {
  list: [],
  active: '',
  onChange: () => {},
};

TypeSelect.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    id: PropTypes.string,
  })),
  active: PropTypes.string,
  onChange: PropTypes.func,
};

export default TypeSelect;
