import React from 'react';
import { connect } from 'dva';
import { Empty } from 'components';

import { namespace } from './model';

const mapStateToProps = (res) => ({
  state: res[namespace],
});

type IProp = ReturnType<typeof mapStateToProps>;

const Page: React.FunctionComponent<any> = (props: any) => {
  const { state }: IProp = props;
  return (<Empty message={state.message} />);
};

export default connect(mapStateToProps)(Page);
