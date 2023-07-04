import React, {Fragment, useState, useEffect, Component} from 'react';
import {connect} from 'dva';
import ProjectStatisticsInfoTab from '../../../components/pmsPage/ProjectStatisticsInfo/index';
import {DecryptBase64} from '../../../components/Common/Encrypt';

const ProjectStatisticsInfo = props => {
  const {
    location: {state = {}},
    match: {
      params: {params: encryptParams = ''},
    },
  } = props;

  const {routes = []} = state;
  let routes2 = [];
  let obj = [];
  let cxlx = '';
  let memberID = '';
  let orgID = '';
  if (props.match.params.params !== undefined) {
    obj = JSON.parse(DecryptBase64(encryptParams));
    cxlx = obj.cxlx;
    memberID = obj.memberID;
    orgID = obj.orgID;
    console.log('🚀 ~ file: index.js ~ line 12 ~ ProjectStatisticsInfo ~ props', obj);
    // setParams(JSON.parse(DecryptBase64(encryptParams)));
    // console.log('🚀 ~ file: index.js:20 ~ ProjecDetail ~ obj:', obj);
    // console.log('🚀 ~ file: index.js ~ line 12 ~ ProjecDetail ~ routes', routes);
    routes2 = [...routes].concat({
      name: '项目列表',
      pathname: props?.pathname,
    });
    if (routes.length === 0) {
      obj.routes &&
      (routes2 = obj.routes?.concat({
        name: '项目列表',
        pathname: props?.pathname,
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

  return (
    <Fragment>
      <ProjectStatisticsInfoTab dictionary={props.dictionary} routes={newArr} cxlx={cxlx} memberID={memberID}
                                orgID={orgID}/>
    </Fragment>
  );
};
export default connect(({global}) => ({
  dictionary: global.dictionary,
}))(ProjectStatisticsInfo);
