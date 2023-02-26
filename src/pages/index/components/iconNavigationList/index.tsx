import React, { CSSProperties } from 'react';
import PropTypes from 'prop-types';
// import classNames from 'classnames';

import { WxJump } from '@/components';

import styles from './index.scss';

const Index: React.FC = (props: any) => {
  const {
    lineCount, list = [], onClick,
  } = props;

  const listFilter = (() => {
    let i;
    let j;
    const value: any = [];
    for (i = 0, j = list.length; i < j; i += lineCount) {
      value.push(list.slice(i, i + lineCount));
    }

    if (list.length > lineCount) {
      const lastRow: any[] = value[value.length - 1];

      let difference = lineCount - lastRow.length;
      if (difference > 0) {
        // eslint-disable-next-line no-plusplus
        for (difference; difference > 0; difference--) {
          lastRow.push({ image: '', title: '' });
        }
      }
    }

    return value;
  })();

  const styleObject: any = (() => {
    const value: CSSProperties = { padding: '16px 0 0' };
    if (list.length <= lineCount) {
      value.padding = '16px 0 0';
    } else if (list.length > 3 && lineCount === 3) {
      value.padding = '16px 35px 0';
    }

    return value;
  })();

  const rowStyleObject: any = (() => {
    const value: CSSProperties = {};

    if (list.length < lineCount) {
      value.justifyContent = 'initial';
    }

    return value;
  })();

  const cellStyleObject: any = (() => {
    const value: CSSProperties = {};

    if (list.length <= lineCount) {
      value.display = 'inline-block';
      value.width = `calc((100% - 16px - 1px) * (1/${lineCount}))`;
    }

    return value;
  })();

  const iconLayout = (item, index) => (
    <div
      key={index.toString()}
      className={styles.iconCell}
      style={{ ...cellStyleObject }}
      onClick={() => onClick(item)}
    >
      <WxJump
        {...item.jumpInfo}
      >
        <div className={styles.icon} style={{ opacity: item.image ? 1 : 0 }}>
          <img src={item.image} alt="" />
        </div>
        <div className={styles.title} style={{ opacity: item.title ? 1 : 0 }}>{item.title || '图标导航'}</div>
      </WxJump>
    </div>
  );

  return (
    <>
      {
        !![...listFilter].length && (
          <div style={{ ...styleObject }}>
            <div className={styles.iconCells}>
              {
                [...listFilter].map((row: any, rowIndex) => (
                  <div style={{ ...rowStyleObject }} key={rowIndex.toString()}>
                    {
                      [...row].map((item, index) => iconLayout(item, index))
                    }
                  </div>
                ))
              }
            </div>
          </div>
        )
      }
    </>
  );
};

Index.defaultProps = {
  // style: {},
  lineCount: 3,
  list: [],
  onClick: () => { },
};

Index.propTypes = {
  // style: PropTypes.objectOf(PropTypes.string),
  // 一行显示个数
  lineCount: PropTypes.number,
  //
  list: PropTypes.arrayOf(PropTypes.shape({
    appid: PropTypes.string,
    catalogId: PropTypes.string,
    image: PropTypes.string,
    linkType: PropTypes.string,
    navigationId: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    url: PropTypes.string,
    jumpInfo: PropTypes.shape({
      type: PropTypes.string,
      objectIds: PropTypes.shape({}),
      webUrl: PropTypes.string,
    }),
  })),
  onClick: PropTypes.func,
};

export default Index;
