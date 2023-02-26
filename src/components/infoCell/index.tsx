import React, { FC } from 'react';
import { Flex } from 'antd-mobile';

import styles from './index.scss';

interface IProps {
  label: string,
  value: string,
  valType: string,  // img, text
  nextIcon: string,  //  y, 显示， n 不显示right图标
  onClellClick: Function,
}

// 导入图片
import rightImg from './images/right.png'

const InfoCell: FC<IProps> = (props: IProps) => {
  const { label, value, valType = 'text', nextIcon = 'n', onClellClick } = props;

  function cellClick() {
    if (nextIcon == 'y') onClellClick()
  }

  return (
    <Flex justify="between" className={styles.cell} onClick={cellClick}>
      <p className={styles.cellKey}>{label}:</p>
      <Flex.Item>
        <Flex justify="end">
          { valType == 'text' && <p className={styles.cellText}>{value}</p>}
          { valType == 'img' && <img src={value} className={styles.cellImg} />}
          {
            nextIcon == 'y' ? 
            <img src={rightImg} className={styles.cellRight} alt=""/> :
            <div className={styles.cellRight}></div>
          }
        </Flex>
      </Flex.Item>
    </Flex>
  )
}

export default InfoCell;