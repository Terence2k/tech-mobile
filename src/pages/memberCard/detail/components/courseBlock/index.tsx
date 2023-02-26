import React from 'react';
import PropTypes from 'prop-types';

import { CardTpl2 } from 'components';

import getImageHeight from '@/common/getImageHeight';
import styles from './index.scss';

const tpl2Height = getImageHeight(2, 166 / 343);

const CourseBlock: React.FC<any> = (props: any) => {
  const {
    list, title, type, onItemClick,
  } = props;
  return (
    <div style={{ width: '100%' }}>
      <div className="flexLayout center spaceBetween" style={{ width: '200px', margin: '0 auto' }}>
        <div className={styles.line} />
        <span style={{ fontSize: '13px', color: '#C0C4CC', margin: '0 24px' }}>
          {title}
        </span>
        <div className={styles.line} />
      </div>
      <div className={styles.flexCourse}>
        {
          list.map((item, index) => (
            <div className={styles.flexCourseItem} key={index.toString()}>
              <CardTpl2
                mode={9}
                data={item}
                showPrice={type === 'discount'}
                imageHeight={tpl2Height}
                onClick={() => onItemClick(item)}
              />
            </div>
          ))
        }
      </div>
    </div>
  );
};

CourseBlock.defaultProps = {
  type: 'free',
  onItemClick: () => {},
};

CourseBlock.propTypes = {
  list: PropTypes.arrayOf(PropTypes.any).isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string,
  onItemClick: PropTypes.func,
};

export default CourseBlock;
