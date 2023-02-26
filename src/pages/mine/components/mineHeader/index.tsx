import React, { FC } from 'react';
import { Flex, Icon } from 'antd-mobile';
import styles from './index.scss';

const RightIcon = () => {
  const color = 'rgba(0,0,0,.30)';
  return <Icon color={color} type="right" />;
};

interface IProps {
  nickname: string,
  headImgUrl: string,
  onClick?: () => void;
}

const Index: FC<IProps> = (props: any) => {
  const { headImgUrl, nickname, onClick } = props;
  return (
    <Flex className={`${styles.mineHeader}`} onClick={onClick}>
      <img src={headImgUrl} className={styles.headImg} alt="" />
      <Flex.Item className={styles.nickname}>{nickname}</Flex.Item>
      <RightIcon />
    </Flex>
  );
};

export default Index;
