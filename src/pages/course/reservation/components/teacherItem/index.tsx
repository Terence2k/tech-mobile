import React from 'react';
import PropTypes from 'prop-types';

import { Tag, WxJump } from 'components';

import styles from './index.scss';

// 标签
const tag = {
  effect: 'custom',
  style: {
    background: '#F3F9FF',
    color: '#54ADFF',
    border: '1px solid #A4CCF1',
    borderRadius: '2px',
    padding: '0 5px',
    marginRight: '10px',
  },
};

const TeacherItem: React.FC<any> = (props: any) => {
  const { data, teacherId, reservationId } = props;
  return (
    <div className={styles.teacherItem}>
      <img src={data.headimgurl} alt="" className={styles.teacherItemIcon} />
      <div className={styles.teacherContent}>
        <p className={`${styles.teacherTitle} textOverflow`}>{data.nickname}</p>
        <div className="flexLayout center">
          {
            data.subjects && data.subjects.map(
              (item, index) => (
                <Tag {...tag} key={index.toString()}>
                  {item}
                </Tag>
              ),
            )
          }
        </div>
      </div>
      <WxJump
        type="reservation_teacher_detail"
        objectIds={{
          id: teacherId,
          reservation_id: reservationId,
        }}
      >
        <div className={styles.teacherItemBtn}>去预约</div>
      </WxJump>
    </div>
  );
};

TeacherItem.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  teacherId: PropTypes.string.isRequired,
  reservationId: PropTypes.string.isRequired,
};

export default TeacherItem;
