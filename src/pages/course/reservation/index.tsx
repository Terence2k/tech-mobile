import React from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd-mobile';
import actions from 'actions';
import { usePage } from 'hooks';

import {
  Banner,
  ProductTitle,
  Tag,
  ProductDaterangeFormat,
} from 'components';

import { TeacherItem } from './components';

const mapStateToProps = (state: any) => ({
  reservationDetail: state.reservationDetail,
});

const mapDispatchToProps = (dispatch: any) => ({
  onLoad: () => {
    dispatch({ type: 'reservationDetail/onLoad' });
  },
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace: 'reservationDetail' })),
});

type IProp = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const Page: React.FC = (props: any) => {
  const { reservationDetail, onLoad, onShareAppMessage }: IProp = props;

  const [page, setPage] = React.useState(0);

  usePage({ onLoad, onShareAppMessage });

  return (
    <>
      <Banner data={reservationDetail.coverList} />
      <div style={{ backgroundColor: '#FFF', padding: '15px' }}>
        <ProductTitle title={reservationDetail.title} style={{ whiteSpace: 'normal' }} />
        <div className="flexLayout center wrap" style={{ marginBottom: '8px' }}>
          {
            reservationDetail.subjects && reservationDetail.subjects.map(
              (item, index) => (
                <Tag {...reservationDetail.tag} key={index.toString()}>
                  {item}
                </Tag>
              ),
            )
          }
        </div>
        <div style={{ marginBottom: '8px' }}>
          {
            reservationDetail.startTime !== '' && reservationDetail.startTime !== ''
            && (
              <ProductDaterangeFormat
                startTime={reservationDetail.startTime}
                endTime={reservationDetail.endTime}
              />
            )
          }
        </div>
      </div>
      <Tabs
        tabs={[
          { title: '预约' },
          { title: '简介' },
        ]}
        page={page}
        onChange={(tab, index) => { setPage(index); }}
      />
      <div style={{ padding: '10px' }}>
        {
          page === 0 && (
            reservationDetail.teacherList && reservationDetail.teacherList.map((item, index) => (
              <TeacherItem
                key={index.toString()}
                data={item}
                teacherId={item.reservationTeacherId}
                reservationId={reservationDetail.reservationId}
              />
            ))
          )
        }
        {
          page === 1
          && (
            <div style={{ padding: '10px', fontSize: '14px', backgroundColor: '#FFF' }}>
              {reservationDetail.desc}
            </div>
          )
        }
      </div>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
