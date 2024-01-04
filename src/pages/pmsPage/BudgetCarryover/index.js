import React, { Fragment, useState, useEffect, Component } from 'react';
import { connect } from 'dva';
import BudgetCarryoverTab from '../../../components/pmsPage/BudgetCarryover/index';
import { DecryptBase64 } from '../../../components/Common/Encrypt';
const BudgetCarryover = props => {
  const [params, setParams] = useState({}); //路径参数
  const {
    location: { query = {} },
    match: {
      params: { params: encryptParams = '' },
    },
  } = props;
  const { state = {} } = location;
  const { routes = [] } = state;
  // console.log('🚀 ~ file: index.js ~ line 12 ~ DemandDetail ~ props', props);
  let tab = undefined;
  let routes2 = [];
  if (props.match.params.params !== undefined) {
    let obj = JSON.parse(DecryptBase64(encryptParams));
    tab = obj.tab;
    routes2 = [...routes].concat({
      name: '预算结转',
      pathname: props?.location?.pathname,
    });
    if (routes.length === 0) {
      obj.routes &&
        (routes2 = obj.routes?.concat({
          name: '预算结转',
          pathname: props?.location?.pathname,
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
  return (
    <Fragment>
      <BudgetCarryoverTab
        routes={newArr}
        {...props}
        userBasicInfo={props.userBasicInfo}
      ></BudgetCarryoverTab>
    </Fragment>
  );
};
export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
}))(BudgetCarryover);
