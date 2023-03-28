import React, { Fragment, useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { connect } from 'dva';
import ProjectInfoTab from '../../../components/pmsPage/ProjectDetail/index';
import { DecryptBase64 } from '../../../components/Common/Encrypt';
const ProjecDetail = props => {
  const [params, setParams] = useState({}); //路径参数
  const location = useLocation();
  const { pathname = {}, state = {} } = location;
  const { routes = [], xmid = -1 } = state;
  const newRoutes = routes.concat({ name: '项目详情', pathname: pathname });
  return (
    <Fragment>
      <ProjectInfoTab dictionary={props.dictionary} routes={newRoutes} xmid={xmid}></ProjectInfoTab>
    </Fragment>
  );
};
export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(ProjecDetail);
