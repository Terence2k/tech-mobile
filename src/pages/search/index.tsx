import React from 'react';
import { connect } from 'dva';
import { SearchBar, Tabs, Icon } from 'antd-mobile';
import actions from 'actions';
import { usePage } from 'hooks';
import useScrollBottom from '@/hooks/useScrollBottom';

import styles from './index.scss';

const DELETE = require('./images/deleteIcon.png');
const NO_DATA = require('./images/no-data.png');

const mapStateToProps = (state: any) => ({
  searchData: state.searchData,
});

const mapDispatchToProps = (dispatch: any) => ({
  textChange: (title) => {
    dispatch({ type: 'searchData/textChange', payload: { title } });
  },
  typeChange: (data) => {
    dispatch({ type: 'searchData/typeChange', payload: { ...data } });
  },
  submit: (item) => {
    dispatch({ type: 'searchData/submit', payload: { insertTitle: item } });
  },
  getHistory: () => {
    dispatch({ type: 'searchData/getHistory' });
  },
  deleteHistory: (item) => {
    dispatch({ type: 'searchData/historyOpe', payload: { title: item, type: 'delete' } });
  },
  jumpToPage: (path: string, params: object = {}) => {
    dispatch(actions.jumpToPage(path, params));
  },
  reset: () => {
    dispatch({ type: 'searchData/resetList' });
  },
  onReachBottom: () => {
    dispatch({ type: 'searchData/onReachBottom' });
  },
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace: 'searchData' })),
});

const Page: React.FC = (props: any) => {
  const {
    searchData, textChange, typeChange, submit, getHistory, deleteHistory, jumpToPage, reset,
    onReachBottom,
    onShareAppMessage,
  } = props;
  const { list } = searchData;

  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    getHistory();
  }, [getHistory]);

  // const scrollRef = React.useRef<HTMLDivElement>(null);
  // const [isScrollBottom] = useScrollBottom({ ref: scrollRef });

  // React.useEffect(() => {
  //   if (isScrollBottom) {
  //     onReachBottom();
  //   }
  // }, [isScrollBottom, onReachBottom]);

  const [scrollRef] = usePage({ onReachBottom, onShareAppMessage });

  return (
    <div ref={scrollRef} className={styles.searchLayout}>
      <div style={{ padding: '10px 10px 0', backgroundColor: '#FFF' }}>
        <SearchBar
          className="searchbar-layout"
          value={searchData.title}
          placeholder="输入关键词进行搜索"
          onChange={(val) => {
            textChange(val);
            setIsDeleting(false);
          }}
          onSubmit={() => submit()}
          onClear={() => reset()}
          onCancel={() => reset()}
        />
        <Tabs
          tabs={searchData.types}
          page={searchData.currentType}
          onChange={(val) => { typeChange(val); }}
        />
      </div>
      <div style={{ height: '8px', backgroundColor: '#EFEFF4' }} />
      {
        !searchData.isSearching
        && (
          <div style={{ padding: '10px', backgroundColor: '#FFF' }}>
            <div className="flexLayout center spaceBetween">
              <span className={styles.historyTitle}>搜索历史</span>
              {
                isDeleting && <span onClick={() => { setIsDeleting(false); }}>完成</span>
              }
              {
                !isDeleting
                && (
                  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                  <img
                    src={DELETE}
                    alt=""
                    className={styles.deleteIcon}
                    onClick={() => { setIsDeleting(true); }}
                  />
                )
              }
            </div>
            <div className="flexLayout center wrap" style={{ marginTop: '10px' }}>
              {
                searchData.historyItems && searchData.historyItems.map((item, index) => (
                  <div
                    className={styles.deleteItem}
                    key={index.toString()}
                    onClick={() => { submit(item); }}
                  >
                    <p className={`${styles.deleteItemInner} textOverflow`}>{item}</p>
                    {
                      isDeleting && (
                        <Icon
                          type="cross-circle-o"
                          size="xxs"
                          color="#777"
                          style={{
                            position: 'absolute',
                            right: '-5px',
                            top: '-5px',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteHistory(item);
                          }}
                        />
                      )
                    }
                  </div>
                ))
              }
            </div>
          </div>
        )
      }
      {
        searchData.isSearching
        && (
          <div>
            {
              (!list || list.length === 0)
              && (
                <div className={`${styles.noData} flexLayout column center`}>
                  <img src={NO_DATA} alt="" className={styles.noDataIcon} />
                  <p>没有找到匹配的结果</p>
                </div>
              )
            }
            {
              list && list.length > 0
              && (
                <div style={{ paddingLeft: '15px' }}>
                  {
                    list.map((item, index) => (
                      <div
                        key={index.toString()}
                        className={`${styles.listItem} textOverflow`}
                        onClick={() => {
                          jumpToPage(searchData.getJumpQuery(item.id).path,
                            searchData.getJumpQuery(item.id).query);
                        }}
                      >
                        {item.title}
                      </div>
                    ))
                  }
                </div>
              )
            }
          </div>
        )
      }
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
