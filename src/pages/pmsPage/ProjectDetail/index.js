import React, { Fragment } from 'react';
import { connect } from 'dva';
import ProjectDetailTab from '../../../components/pmsPage/ProjectDetail/index';
import { DecryptBase64 } from '../../../components/Common/Encrypt';
const ProjecDetail = props => {
  const {
    match: {
      params: { params: encryptParams = '' },
    },
    dictionary,
    location = {},
  } = props;
  const { state = {} } = location;
  const { routes = [] } = state;
  // console.log('🚀 ~ file: index.js ~ line 12 ~ ProjecDetail ~ props', props);
  let xmid = -1;
  let routes2 = [];
  if (props.match.params.params !== undefined) {
    let obj = JSON.parse(DecryptBase64(encryptParams));
    xmid = obj.xmid;
    routes2 = [...routes].concat({
      name: '项目详情',
      pathname: props?.href,
    });
  }

  return (
    <Fragment>
      <ProjectDetailTab dictionary={dictionary} routes={routes2} xmid={xmid}></ProjectDetailTab>
    </Fragment>
  );
};
export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(ProjecDetail);
