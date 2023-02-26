import React from 'react';
import { connect } from 'dva';
import actions from 'actions';

import { Panel, CardTpl1, CardTpl2 } from 'components';
import getImageHeight from '@/common/getImageHeight';
import styles from './index.scss';

import { MyFileTag } from './components';

const mapStateToProps = (state: any) => ({
  fileData: state.fileData,
});

const mapDispatchToProps = (dispatch: any) => ({
  onLoad: () => {
    dispatch({ type: 'fileData/onLoad' });
  },
  jumpToPage: (path: string, params: object = {}) => {
    dispatch(actions.jumpToPage(path, params));
  },
});

const tpl2Height = getImageHeight(2, 166 / 343);

type IProp = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const Page: React.FC<any> = (props: any) => {
  const {
    fileData,
    jumpToPage,
    onLoad,
  }: IProp = props;

  const { subjectList = [], fileSetList = [], newFiles = {} } = fileData;

  React.useEffect(() => {
    onLoad();
  }, [onLoad]);

  return (
    <div className="pageLayout">
      <div className="pageLayout__scrollLayout">
        <div className={styles.fileListLayout}>
          <MyFileTag
            text="我的资料"
            onClick={() => {
              jumpToPage('/mine/myCourse', { currentTab: 'file' });
            }}
          />
          {
            newFiles.list && newFiles.list.length > 0
            && (
              <Panel {...newFiles}>
                {
                  newFiles.list.map((subjectItem, subjectItemIndex) => (
                    <div
                      className={styles.blockCourseItem}
                      key={subjectItemIndex.toString()}
                      onClick={() => {
                        jumpToPage('/file/fileDetail', { opern_id: subjectItem.opernId });
                      }}
                    >
                      <CardTpl1
                        mode={2}
                        data={subjectItem}
                      />
                    </div>
                  ))
                }
              </Panel>
            )
          }
          {
            subjectList.map((subject, subjectIndex) => (
              <Panel
                {...subject}
                key={subjectIndex.toString()}
                style={{ marginTop: subjectIndex > 0 ? '20px' : '' }}
                onClick={() => {
                  jumpToPage('/file/fileListInner', { opernSubjectId: subject.opernSubjectId });
                }}
              >
                {
                  subject.list.map((subjectItem, subjectItemIndex) => (
                    <div
                      className={styles.blockCourseItem}
                      key={subjectItemIndex.toString()}
                      onClick={() => {
                        jumpToPage('/file/fileDetail', { opern_id: subjectItem.opernId });
                      }}
                    >
                      <CardTpl1
                        mode={2}
                        data={subjectItem}
                      />
                    </div>
                  ))
                }
              </Panel>
            ))
          }
          <Panel
            title="资料集"
            allFlag="y"
            style={{ marginTop: '20px' }}
            onClick={() => {
              jumpToPage('/file/fileSetInner');
            }}
          >
            <div className={styles.flexCourse}>
              {
                fileSetList && fileSetList.map((fileSet, fileSetIndex) => (
                  <div
                    key={fileSetIndex.toString()}
                    className={styles.flexCourseItem}
                    onClick={() => {
                      jumpToPage('/file/fileSetDetail', { opernsetId: fileSet.opernsetId });
                    }}
                  >
                    <CardTpl2
                      mode={2}
                      data={fileSet}
                      showPrice={false}
                      imageHeight={tpl2Height}
                    />
                  </div>
                ))
              }
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
