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
    // console.log('🚀 ~ file: index.js:20 ~ ProjecDetail ~ obj:', obj);
    xmid = obj.xmid;
    // console.log('🚀 ~ file: index.js ~ line 12 ~ ProjecDetail ~ routes', routes);
    routes2 = [...routes].concat({
      name: '项目详情',
      pathname: props?.pathname || props?.location?.pathname,
    });
    if (routes.length === 0) {
      obj.routes &&
        (routes2 = obj.routes?.concat({
          name: '项目详情',
          pathname: props?.pathname || props?.location?.pathname,
        }));
      // console.log('🚀 ~ file: index.js:29 ~ ProjecDetail ~ routes2:', routes2);
    }
  }
  //去重 考虑到从标签详情页面回退到项目详情页面的情况
  const newArr = [];
  let name = [];
  for (let i = 0; i < routes2.length; i++) {
    //判断在id这个数组中有没有找到id
    if (name.indexOf(routes2[i].name) === -1) {
      //把id用push存进id这个数组中
      name.push(routes2[i].name);
      newArr.push(routes2[i]);
    }
  }
  // console.log('🚀 ~ file: index.js ~ line 12 ~ ProjecDetail ~ routes2', newArr);

  return (
    <Fragment>
      <ProjectDetailTab dictionary={dictionary} routes={newArr} xmid={xmid}></ProjectDetailTab>
    </Fragment>
  );
};
export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(ProjecDetail);
