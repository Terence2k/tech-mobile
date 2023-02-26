import React from 'react';
import PropTypes from 'prop-types';
import { Flex } from 'antd-mobile';
import { WxJump } from 'components';

import styles from './index.scss';

const Index: React.FunctionComponent<any> = (props: any) => {
  const {
    name,
    icon,
    jumpInfo,
    count,
  } = props;
  return (
    <Flex
      direction="column"
      justify="center"
      className={styles.item}
    >
      <WxJump
        {...jumpInfo}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer',
        }}
      >
        <div style={{
          position: 'relative',
          width: '32px',
          height: '32px',
        }}
        >
          {
            count > 0 && (
              <span style={{
                position: 'absolute',
                minWidth: '12px',
                height: '12px',
                lineHeight: '12px',
                top: '-5px',
                right: '-7px',
                backgroundColor: '#F5222D',
                borderRadius: '6px',
                textAlign: 'center',
              }}
              >
                <span style={{
                  display: 'block',
                  height: '12px',
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.85)',
                  transform: 'scale(0.7)',
                }}
                >
                  {count > 99 ? '···' : count}
                </span>
              </span>
            )
          }
          <img
            style={{
              width: '32px',
              height: '32px',
              marginBottom: '4px',
              backgroundSize: '100% 100%',
            }}
            src={icon}
            alt="icon"
          />
        </div>
        <div>{name}</div>
      </WxJump>
    </Flex>
  );
};

Index.defaultProps = {
};

Index.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  jumpInfo: PropTypes.shape({
    type: PropTypes.string,
    webUrl: PropTypes.string,
    icon: PropTypes.string,
    objectIds: PropTypes.shape({}),
  }).isRequired,
};

export default Index;
