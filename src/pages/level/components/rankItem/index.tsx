import React from 'react';
import PropTypes from 'prop-types';

import { UserItem } from '../index';

import styles from './index.scss';

const GOLD = require('./images/gold.png');
const SILVER = require('./images/silver.png');
const COPPER = require('./images/copper.png');

const RankItem: React.FC<any> = (props: any) => {
  const { data, mode, isMine } = props;

  return (
    <div className={
      `${styles.rankItem} ${styles[`rankItem-${mode}`]} ${(mode === 2 && isMine === 'y') ? styles.mine2 : ''} flexLayout center`
    }
    >
      {
        (!data.rank || data.rank > 3) && (
        <div className={
          `${styles.rankLabel} ${styles[`rankLabel-${mode}`]} ${(mode === 1 && isMine === 'y') ? styles.rankLabelMine : ''}`
        }
        >
          {(mode === 1 && isMine === 'y') ? '我的成绩' : data.rank || '无'}
        </div>
        )
      }
      {
        data.rank === 1 && <img src={GOLD} alt="" className={styles['rankLabel-2']} />
      }
      {
        data.rank === 2 && <img src={SILVER} alt="" className={styles['rankLabel-2']} />
      }
      {
        data.rank === 3 && <img src={COPPER} alt="" className={styles['rankLabel-2']} />
      }
      <div className={styles.rankUser}>
        <UserItem data={data} level={(mode === 1 && isMine === 'y') ? data.rank : ''} />
      </div>
      {
        data.levelIcon && <img src={data.levelIcon} alt="" className={styles.rankIcon} />
      }
      {
        data.isFinished === 'n' && <span style={{ color: '#909399', fontSize: '12px', whiteSpace: 'nowrap' }}>通过考核会出现排名哦</span>
      }
    </div>
  );
};

RankItem.defaultProps = {
  mode: 1,
  isMine: 'n',
};

RankItem.propTypes = {
  mode: PropTypes.number,
  isMine: PropTypes.oneOf(['y', 'n']),
  data: PropTypes.shape({
    // mode1为外层排行，mode2为内层排行
    rank: PropTypes.number,
    // 是否为我的
    userName: PropTypes.string,
    image: PropTypes.string,
    levelCount: PropTypes.number,
    levelIcon: PropTypes.string,
  }).isRequired,
};

export default RankItem;
