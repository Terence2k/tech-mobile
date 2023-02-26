import React from 'react';
import { Redirect } from 'umi';
import Cookies from 'js-cookie';

import config from 'utils/config';

export default (props: any) => {
  const loginState = Cookies.get(`${config.storageNamespace}loginState`);

  if (loginState === 'y') {
    return <div>{props.children}</div>;
  }

  console.log('重定向到登录');
  const { location } = props;
  const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
  return <Redirect to={`/login?redirect=${redirect}`} />;
};
