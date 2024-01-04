import React, {Fragment, useState, useEffect, Component} from 'react';
import {connect} from 'dva';
import ProjectStateInfoTab from '../../../components/pmsPage/ProjectBuilding/ProjectDynamics/ProjectStateInfo/index';
import {DecryptBase64} from '../../../components/Common/Encrypt';

const ProjectStateInfo = props => {
  const {
    location: {state = {}},
    match: {
      params: {params: encryptParams = ''},
    },
  } = props;
  const {routes = []} = state;
  // console.log('🚀 ~ file: index.js ~ line 12 ~ ProjecDetail ~ props', props);
  let routes2 = [];
  let obj = [];
  let cxlx = '';
  if (props.match.params.params !== undefined) {
    obj = JSON.parse(DecryptBase64(encryptParams));
    cxlx = obj.cxlx;
    defaultYear = obj.defaultYear;
    // setParams(JSON.parse(DecryptBase64(encryptParams)));
    // console.log('🚀 ~ file: index.js:20 ~ ProjecDetail ~ obj:', obj);
    // console.log('🚀 ~ file: index.js ~ line 12 ~ ProjecDetail ~ routes', routes);
    routes2 = [...routes].concat({
      name: '阶段项目列表',
      pathname: props?.pathname,
    });
    if (routes.length === 0) {
      obj.routes &&
      (routes2 = obj.routes?.concat({
        name: '阶段项目列表',
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

  // console.log('🚀 ~ file: index.js:29 ~ ProjectStateInfoTab ~ newArr:', newArr);
  // console.log('🚀 ~ file: index.js:29 ~ ProjectStateInfoTab ~ cxlx:', cxlx);

  return (
    <Fragment>
      <ProjectStateInfoTab dictionary={props.dictionary} routes={newArr} cxlx={cxlx} defaultYear={defaultYear}/>
    </Fragment>
  );
};
export default connect(({global}) => ({
  dictionary: global.dictionary,
}))(ProjectStateInfo);
