import React, { forwardRef, useImperativeHandle } from 'react';

import styles from './index.scss';

const Index = forwardRef((props: any, ref): any => {
  const {
    dateOrStudent,
    switchItem,
    pullDown,
    dateList,
    rolesList,
    updateDate,
    updateRole,
    isShow,
  }: any = props;

  React.useEffect(() => {
    setCurrentIndex(0);
  }, [dateList]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  useImperativeHandle(ref, () => ({
    countNum: (e) => {
      setCurrentIndex(e);
    },
  }));
  const toCurrentPage = (index, date) => {
    console.log(index, date, 'toCurrentPage');

    setCurrentIndex(index);
    if (!dateOrStudent) {
      updateDate(date);
    } else {
      updateRole(date);
    }
  };
  return (
    <div className={styles.componentsChildren}>
      <div className={styles.timeWrapper}>
        {/* 按学员显示 */}
        <div className={styles.rolesWrapper}>

          {
            dateOrStudent && rolesList && (
              rolesList.map((item, index) => (
                <div
                  key={item.user.user_id}
                  className={styles.rolesItem}
                  onClick={() => toCurrentPage(index, item.user)}
                >

                  <img src={item.user.headimgurl} alt="" />
                  <div className={styles.numWrapper}>
                    <div className={styles.num}>{item.count}</div>
                  </div>
                </div>
              ))
            )
          }
          {/* 按日期显示 */}
          {!dateOrStudent && dateList && (
            dateList.map((item, idx) => (
              <div key={item.num} className={currentIndex === item.num ? `${styles.timeItem} ${styles.current}` : `${styles.timeItem}`} onClick={() => toCurrentPage(idx, item.date)}>
                <div className={styles.dateItem}>
                  {item.dateShow}
                  <div className={styles.numWrapper}>
                    <div className={styles.num}>{item.count > 99 ? '···' : item.count}</div>
                  </div>
                </div>
                <div>{item.weekDay}</div>

              </div>
            ))
          )}
        </div>

        <div className={styles.arrowDown} onClick={() => pullDown()}>
          {
            isShow ? <i className="iconfont iconzhankai2" /> : <i className="iconfont iconshouqi2" />
          }

        </div>
        <div className={styles.switch} onClick={() => switchItem()}>
          {!dateOrStudent ? '日期/' : '学员/'}
          <span className={styles.switch_item}>{dateOrStudent ? '日期' : '学员'}</span>
        </div>

      </div>
    </div>
  );
});

export default Index;
