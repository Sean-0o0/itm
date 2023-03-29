import React, { Fragment } from 'react';
import { connect } from 'dva';
import ProjectDetailTab from '../../../components/pmsPage/ProjectDetail/index';
import { DecryptBase64 } from '../../../components/Common/Encrypt';
const ProjecDetail = props => {
  const {
    match: {
      params: { params: encryptParams = '' },
    },
  } = props;
  let xmid = -1;
  let routes = [];
  if (props.match.params.params !== undefined) {
    let obj = JSON.parse(DecryptBase64(encryptParams));
    xmid = obj.xmid;
    routes = [...obj.routes].concat({
      name: '项目详情',
      pathname: props?.cacheKey?.replace('/:params'),
    });
  }

  return (
    <Fragment>
      <ProjectDetailTab
        dictionary={props.dictionary}
        routes={routes}
        xmid={xmid}
      ></ProjectDetailTab>
    </Fragment>
  );
};
export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(ProjecDetail);
