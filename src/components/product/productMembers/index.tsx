import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

const Index: React.FC = (props: any) => {
  const {
    style, nameStyle, list, count, name,
  } = props;

  return (
    <>
      {
        list.length > 0 && (
          <div className={styles.layout} style={style}>
            <div className={styles.layout__hd}>
              {
                [...list].map((item, index) => (
                  <img key={index.toString()} className={styles.icon} src={item.headimgurl} alt="" />
                ))
              }
            </div>
            <div className={styles.layout__ft} style={nameStyle}>
              <div className={styles.name}>{list[list.length - 1].nickname}</div>
              {`等${count}人参加了${name}`}
            </div>
          </div>
        )
      }
    </>
  );
};

Index.defaultProps = {
  style: {},
  nameStyle: {},
  list: [],
  count: 0,
  name: '',
};

Index.propTypes = {
  style: PropTypes.objectOf(PropTypes.string),
  nameStyle: PropTypes.objectOf(PropTypes.string),
  list: PropTypes.arrayOf(PropTypes.shape({
    headimgurl: PropTypes.string,
    nickname: PropTypes.string,
  })),
  count: PropTypes.number,
  name: PropTypes.string,
};

export default Index;
