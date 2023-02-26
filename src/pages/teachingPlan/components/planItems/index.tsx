import React from 'react';
import PropTypes from 'prop-types';
import { Accordion } from 'antd-mobile';

import { WxJump } from '@/components';
import styles from './index.scss';

import { MainItem, SubItem } from '../index';

// 获取核心课标题
const getKernelTitle = (res = []) => {
  const item: any = res.find((i: any) => i.content_type === 'kernel');
  let value = '';

  if (item && item.title) {
    value = item.title;
  }

  return value;
};

const ItemHeader: React.FC = (props: any) => {
  const { content_list: contentList = [], show_index: showIndex, showTitle } = props;
  const isDiploma = contentList[0] && contentList[0].object_type === 323;
  return (
    <div className={`${styles.itemTitle} textOverflow`}>
      <span className={styles.itemIndex} style={{ opacity: isDiploma ? '0' : '1' }}>
        第
        {showIndex}
        节
      </span>
      {
        showTitle && getKernelTitle(contentList)
      }
    </div>
  );
};

const PlanItems: React.FC<any> = (props: any) => {
  const {
    itemList, joinFlag, activeKey, onOpenChange,
  } = props;

  const mainItemLayout = (data, showLine) => {
    if (joinFlag === 'n') {
      return (<MainItem data={data} showLine={showLine} joinFlag={joinFlag} />);
    }

    let jumpInfo = {};
    if (data.object_type === 200) {
      // 课程
      jumpInfo = {
        webUrl: `/course/product?course_id=${data.object_id}&plan_id=${data.plan_id}`,
      };
    } else if (data.object_type === 312) {
      // 直播
      jumpInfo = {
        webUrl: `/course/live?livecourse_id=${data.object_id}&plan_id=${data.plan_id}`,
      };
    } else if (data.object_type === 321) {
      // 预约
      jumpInfo = {
        webUrl: `/course/reservation?reservation_id=${data.object_id}&plan_id=${data.plan_id}`,
      };
    } else if (data.object_type === 323) {
      // 证书
      if (!data.diploma_user_id) {
        jumpInfo = {
          type: 'wait_cert_detail',
          objectIds: {
            diploma_id: data.object_id,
            object_id: data.plan_id,
            object_type: 314,
          },
        };
      } else {
        jumpInfo = {
          type: 'certificate_detail',
          objectIds: {
            id: data.diploma_user_id,
          },
        };
      }
    }
    // console.log('JUMP', jumpInfo, data);

    return (
      <WxJump
        {...jumpInfo}
      >
        <MainItem data={data} showLine={showLine} joinFlag={joinFlag} />
      </WxJump>
    );
  };

  return (
    <div>
      <p className={styles.blockTitle}>教学大纲</p>
      <Accordion activeKey={activeKey} onChange={(val) => onOpenChange(val)}>
        {
          itemList.map((item, index) => (
            <Accordion.Panel
              className={styles.itemLayout}
              key={item.item_id.toString()}
              header={(
                <ItemHeader
                  {...item}
                  showTitle={activeKey && activeKey.indexOf(item.item_id) === -1}
                />
              )}
              style={{ marginBottom: '12px' }}
            >
              {
                item.content_list.map((content, contentIndex) => (
                  <div key={String(content.content_id)}>
                    {
                      content.content_type === 'prepare'
                      && (
                      <div>
                        {
                          (content.title || (content.task_list && content.task_list.length))
                          && <SubItem data={content} joinFlag={joinFlag} />
                        }
                      </div>
                      )
                    }
                    {
                      content.content_type === 'kernel' && mainItemLayout(content, contentIndex !== item.content_list.length - 1)
                    }
                    {
                      content.content_type === 'review'
                       && (
                       <div>
                         {
                          (content.title || (content.task_list && content.task_list.length))
                          && <SubItem data={content} joinFlag={joinFlag} />
                        }
                       </div>
                       )
                    }
                  </div>
                ))
              }
            </Accordion.Panel>
          ))
        }
      </Accordion>
    </div>
  );
};

PlanItems.defaultProps = {
  itemList: [],
  joinFlag: 'n',
  activeKey: '',
  onOpenChange: () => {},
};

PlanItems.propTypes = {
  itemList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  joinFlag: PropTypes.oneOf(['y', 'n']),
  activeKey: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
  onOpenChange: PropTypes.func,
};

export default PlanItems;
