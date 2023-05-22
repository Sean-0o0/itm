import React, { Fragment } from 'react';
import { connect } from 'dva';
import DemandDetailTab from '../../../components/pmsPage/DemandDetail/index';
import { DecryptBase64 } from '../../../components/Common/Encrypt';
const DemandDetail = props => {
  const {
    match: {
      params: { params: encryptParams = '' },
    },
    dictionary,
    location = {},
  } = props;
  const { state = {} } = location;
  const { routes = [] } = state;
  // console.log('🚀 ~ file: index.js ~ line 12 ~ DemandDetail ~ props', props);
  let xqid = -1;
  let fqrid = -1;
  let routes2 = [];
  if (props.match.params.params !== undefined) {
    let obj = JSON.parse(DecryptBase64(encryptParams));
    xqid = obj.xqid;
    fqrid = obj.fqrid;
    routes2 = [...routes].concat({
      name: '需求详情',
      pathname: props?.pathname,
    });
    if (routes.length === 0) {
      obj.routes &&
        (routes2 = obj.routes?.concat({
          name: '需求详情',
          pathname: props?.pathname,
        }));
    }
  }
  //去重
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
  // console.log('🚀 ~ file: index.js ~ line 12 ~ DemandDetail ~ routes2', newArr);

  return (
    <Fragment>
      <DemandDetailTab dictionary={dictionary} routes={newArr} xqid={xqid} fqrid={fqrid}/>
    </Fragment>
  );
};
export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(DemandDetail);
