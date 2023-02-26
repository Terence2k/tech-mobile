import React, { FC } from 'react';
import classNames from 'classnames';
import { connect } from 'dva';
import styles from './index.scss';

interface IProps {
  hideFn: any
  rolesForm: []
  updateRole: any
}
const mapStateToProps = (state: any) => ({
  browser: state.browser,
});
const Index: FC<IProps> = (props: any): any => {
  const {
    rolesForm,
    hideFn,
    updateRole,
    browser,
  } = props;
  const changePage = (e) => {
    updateRole(e);
    hideFn();
  };
  return (
    <div className={classNames(styles.calendarWrapper, {
      [styles.pc]: !browser.isMobileBrowser,
    })}
    >
      <div className={styles.shelter} onClick={() => hideFn()} />
      <div className={styles.outside} onClick={() => hideFn()} />

      <div className={styles.rolesWrapper}>
        <div className={styles.wrapperHideScroll}>
          {
            rolesForm.map((item) => (
              <div
                className={styles.rolesItem}
                key={item.user.user_id}
                onClick={() => changePage(item.user)}
              >
                <img className={styles.rPic} src={item.user.headimgurl} alt="" />
                <div className={styles.numWrapper}>
                  <div className={styles.num}>{item.count > 99 ? '···' : item.count}</div>
                </div>
                <div className={styles.name}>{item.user.nickname}</div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};
export default connect(mapStateToProps)(Index);
