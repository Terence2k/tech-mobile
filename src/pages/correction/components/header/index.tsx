import React, { FC } from 'react';
import { Popover } from 'antd-mobile';
import styles from './index.scss';
// pic
import search from '../../images/searchbar／empty+left.png';

const { Item } = Popover;
interface IProps {
  searchPaper: any,
  correctNum: object,
  tip: string,
  rightTxt: string,
  onClick?: () => void;
  changeExampaperType: any;
  exampaperType:string;
  keyword:string
}

const Index: FC<IProps> = (props: any): any => {
  const {
    correctNum,
    rightTxt,
    searchPaper,
    changeExampaperType,
    exampaperType,
    keyword,
  }: any = props;
  const [isshowList, setIsshowList] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  React.useEffect(() => {
    setselectItem(exampaperType === 'exam' ? '试卷' : '作业');
  }, [exampaperType]);
  React.useEffect(() => {
    setSearchValue(keyword);
    console.log('keyword change');
  }, [keyword]);
  const [selectItem, setselectItem] = React.useState(exampaperType === 'exam' ? '试卷' : '作业');
  const inputref = React.useRef<any>(null);

  const onSelect = (e) => {
    const list = ['试卷', '作业', '考级', '打卡'];
    setIsshowList(false);
    setselectItem(list[e.key]);
    console.log(list[e.key]);
    changeExampaperType(list[e.key]);
  };
  const [searchValue, setSearchValue] = React.useState('');
  const onkeydown = (e) => {
    if (e.keyCode === 13) {
      searchPaper(searchValue);
      // setSearchValue('');
      inputref.current.blur();
    }
  };
  const changeValue = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <div>
      <div className={styles.correntHeader}>
        <div className={styles.typeSelect} onClick={() => setIsshowList(!isshowList)}>
          <div className={styles.txt}>
            {selectItem}
            {
              selectItem === '作业' && (
                <span className={styles.numWrapper}>
                  <span className={styles.num}>{correctNum.set > 99 ? '···' : correctNum.set}</span>
                </span>
              )
            }
            {
              selectItem === '试卷' && (
                <span className={styles.numWrapper}>
                  <span className={styles.num}>{correctNum.exam > 99 ? '···' : correctNum.exam}</span>
                </span>
              )
            }

          </div>
          <span className={styles.arrowDown} />
        </div>
        <div className={styles.search}>
          <input
            ref={inputref}
            value={searchValue}
            type="text"
            className={styles.input}
            placeholder={exampaperType === 'exam' ? '请输入试卷信息' : '搜索题集标题'}
            onChange={(e) => changeValue(e)}
            onKeyDown={(e) => onkeydown(e)}
          />
          <img className={styles.hPic} src={search} alt="" />
        </div>
        <div className={styles.hadCorrent}>
          {/* <span className={styles.hadCorrentTxt}>{rightTxt}</span>
          <span className={styles.arrowright} /> */}
        </div>
      </div>
      <div className={styles.selectList}>
        <Popover
          visible={isshowList}
          placement="bottomLeft"
          onSelect={(e) => onSelect(e)}
          overlay={[
            (
              <Item key="0" style={{ whiteSpace: 'nowrap', width: '100px' }}>
                <div className={styles.itemWrapper}>
                  试卷
                  <span className={styles.numWrapper}>
                    <span className={styles.num}>{correctNum.set > 99 ? '···' : correctNum.exam}</span>
                  </span>
                </div>
              </Item>),
            (
              <Item key="1" data-seed="logId">
                <div className={styles.itemWrapper}>
                  作业
                  <span className={styles.numWrapper}>
                    <span className={styles.num}>{correctNum.exam > 99 ? '···' : correctNum.set}</span>
                  </span>
                </div>
              </Item>),

            // (<Item key="2" style={{ whiteSpace: 'nowrap' }}>考级</Item>),
            // (<Item key="3" style={{ whiteSpace: 'nowrap' }}>打卡</Item>),
          ]}
        >
          <div style={{
            height: '100%',
            padding: '0 15px',
            marginRight: '15px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'red',
            marginLeft: '14px',
          }}
          />
        </Popover>
      </div>

    </div>
  );
};
export default Index;
