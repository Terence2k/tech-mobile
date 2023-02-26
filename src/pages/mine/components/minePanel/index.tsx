import React, { FC } from 'react';
import { Flex } from 'antd-mobile';
import styles from './index.scss';

type item = {
  name: string,
  resource_id: string,
  type: string,
  url: string
}

interface IProps {
  list: item[],
  title: string
}

const Index: FC<IProps> = (props: any) => {
  const { title, list } = props;
  return (
    <div className={styles.minePanel}>
      <div className={styles.panelTitle}>{title}</div>
      <Flex>

      </Flex>
    </div>
  )
}

export default Index