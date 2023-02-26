import React, { FC } from 'react';
import { Flex } from 'antd-mobile';
import moment from 'moment';
import classNames from 'classnames';

import styles from './index.scss';

// import PropTypes from 'prop-types';

type cardInfo = {
  showMembercard: any,
  myMembercard: any[]
}

interface IProps {
  memberCardInfo: cardInfo,
  onClick?: () => void;
}

const MineMemberCard: FC<IProps> = (props: any) => {
  const { memberCardInfo: { myMembercard = [], showMembercard = {} }, onClick } = props;
  return (
    <>
      {
        (myMembercard.length > 0 || Object.keys(showMembercard).length > 0) && (
          <Flex justify="between" className={styles.mineMembercard} onClick={() => onClick()}>
            <Flex.Item className={styles.mineMemberInfo}>
              <Flex direction="column" justify="between" align="stretch" className={styles.mineMemberInfo}>
                <div
                  className={classNames(styles.title, 'br-ellipsis')}
                >
                  {myMembercard.length ? myMembercard[0].title : showMembercard.title}
                </div>
                {myMembercard.length > 0 && (
                  <div className={styles.date}>
                    {moment(myMembercard[0].expireTime).format('YYYY.MM.DD')}
                    到期
                  </div>
                )}
              </Flex>
            </Flex.Item>
            <Flex justify="center" className={styles.btn}>{myMembercard.length ? '会员中心' : '立即开通'}</Flex>
          </Flex>
        )
      }
    </>
  );
};

export default MineMemberCard;
