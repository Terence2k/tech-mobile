/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-const */
/* eslint-disable no-unneeded-ternary */
import React, { FC } from 'react';
import classNames from 'classnames';
import { Toast } from 'antd-mobile';
import { TState } from '@/models/types';
import { connect } from 'dva';

import styles from './index.scss';

// pic
import LEFT from './image/left.png';
import RIGHT from './image/right.png';

const mapStateToProps = (state: TState) => ({
  browser: state.browser,

});
interface IProps {
  hideFn: any
  calendarList: []
  updateDate: any
}
const weekArr = [
  { name: '日', className: '' },
  { name: '一', className: '' },
  { name: '二', className: '' },
  { name: '三', className: '' },
  { name: '四', className: '' },
  { name: '五', className: '' },
  { name: '六', className: '' },
];
const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const Index: FC<IProps> = (props: any): any => {
  const {
    calendarList,
    hideFn,
    updateDate,
    changIndex,
    browser,
  } = props;
  const [currentDay, setcurrentDay] = React.useState(0);
  const [currentMonth, setcurrentMonth] = React.useState(0);
  const [currentYear, setcurrentYear] = React.useState(0);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [weekList, setWeekList] = React.useState(weekArr);
  const [dayList, setDayList] = React.useState<any>([]);

  // 获取每月第一天字符串
  const getMonthFirstDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}/${month}/01`;
  };
  // 获取当前date字符串
  const getDateString = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    // day = day < 10 ? ('0' + day) : day;
    return `${year}/${month}/${day}`;
  };
  // 上个月
  const preMonth = () => {
    const date = new Date(`${currentYear}/${currentMonth}/${currentDay}`);

    const preMonthFirstDate = new Date(getMonthFirstDate(new Date(date.setDate(0))));
    // 0 是上个月最后一天
    initCalendar(preMonthFirstDate);
  };
  // nextMonth
  const nextMonth = () => {
    let date = new Date(`${currentYear}/${currentMonth}/${currentDay}`);
    const nextMonthFirstDate = new Date(getMonthFirstDate(new Date(date.setDate(33))));
    initCalendar(nextMonthFirstDate);
  };
  // 初始化日历
  const initCalendar = (cdate) => {
    const nowDate = cdate ? cdate : new Date();
    const nowMonthFirstDate = getMonthFirstDate(nowDate); // 获取当月1号日期
    const nowWeek = new Date(nowMonthFirstDate).getDay()
      ? new Date(nowMonthFirstDate).getDay() : 7; // 获取星期

    const newDateList: any = []; // 创建日期数组
    let startDay = 1 - nowWeek; // 开始日期的下标  以为 setDate(0)是上个月最后一天  所以是2-nowWeek
    if (startDay === -6) startDay = 1;
    const showDayLength = nowWeek < 7 ? 35 : 42; // 如果5行能显示下一个月 就只显示5行
    // 循环处理 获取日历上应该显示的日期
    for (let i = startDay; i < startDay + showDayLength; i++) {
      const date = new Date(new Date(nowMonthFirstDate).setDate(i)); // 获取时间对象
      // eslint-disable-next-line prefer-template
      const day = date.getDate();
      const dayObject: any = {
        date: getDateString(date).replace(/\//g, '-'),
        day,
        name: '',
        num: 0,
        index: 0,
        today: '',
      };

      calendarList.forEach((item: any) => {
        if (date.toDateString() === new Date(item.date).toDateString()) {
          dayObject.name = 'event';
          dayObject.num = item.count;
          dayObject.index = item.num;
        }
      });
      if (date.toDateString() === new Date().toDateString()) {
        dayObject.today = 'today';
      }
      if (i <= 0) {
        dayObject.name = 'none';
        dayObject.num = 0;
        // monthLength
      }
      if (i > monthLength[nowDate.getMonth()]) {
        dayObject.name = 'none';
        dayObject.num = 0;
      }
      newDateList.push(dayObject);
    }
    setDayList(newDateList);
    setcurrentDay(nowDate.getDate());
    // eslint-disable-next-line prefer-template
    setcurrentMonth(nowDate.getMonth() + 1);
    setcurrentYear(nowDate.getFullYear());
  };
  // 关闭日历且 发送请求
  const changeEvent = (e, date, index) => {
    console.log(e, date, index);

    if (date === 'event') {
      changIndex(index);
      updateDate(e);
      hideFn();
    } else {
      Toast.info('没有内容');
    }
  };

  React.useEffect(() => {
    initCalendar(new Date());
    // document.addEventListener('scroll', forbiddent, true);
  }, [
    // initCalendar,
    // document.removeEventListener('scroll', forbiddent, true),
  ]);

  return (
    <div
      className={classNames(styles.calendarWrapper, {
        [styles.pc]: !browser.isMobileBrowser,
      })}
      onTouchMoveCapture={() => { }}
    >

      <div className={styles.shelter} onClick={() => hideFn()} />
      <div className={styles.outside} onClick={() => hideFn()} />
      <div className={styles.calendarContent}>

        <div className={styles.calendarHeader}>

          <div className={styles.yearShow}>
            {currentYear}
            年
          </div>
          <div className={styles.monthShow}>
            <div className={styles.pic} onClick={() => preMonth()}>
              <img className={styles.cPic} src={LEFT} alt="" />
            </div>
            {Number(currentMonth)}
            月
            <div className={styles.pic} onClick={() => nextMonth()}>
              <img className={styles.cPic} src={RIGHT} alt="" />
            </div>
          </div>

          <div className={styles.today} onClick={() => initCalendar(new Date())}>
            今
          </div>
        </div>

        <div className={styles.calendarBody}>
          <div className={styles.weekWrapper}>
            {weekList.map((week) => (
              <div key={week.name} className={`${styles.week} ${week.className}`}>{week.name}</div>
            ))}
          </div>
          <div className={styles.dayWrapper}>
            {dayList.map((dayItem, index) => (
              <div
                key={`${index + dayItem.date}`}
                onClick={() => changeEvent(dayItem.date, dayItem.name, dayItem.index)}
                className={classNames(styles.day, {
                  [styles.event]: dayItem.name === 'event',
                  [styles.none]: dayItem.name === 'none',
                  [styles.today]: dayItem.today === 'today',
                })}
              >
                {
                  (dayItem.num !== 0) && (
                    <div className={styles.numWrapper}>
                      <div className={styles.num}>{dayItem.num > 99 ? '···' : dayItem.num}</div>
                    </div>
                  )
                }
                {/* {
                  dayItem.today === 'today' && <div>yes</div>
                } */}
                {dayItem.day}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>

  );
};
export default connect(mapStateToProps)(Index);
