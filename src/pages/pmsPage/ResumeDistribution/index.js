import React, { Fragment, useState, useEffect, Component } from 'react';
import { connect } from 'dva';
import ResumeDestributionPage from '../../../components/pmsPage/ResumeDestributionPage/index';
import { DecryptBase64 } from '../../../components/Common/Encrypt';
const ResumeDestribution = props => {
  const {
    location: { query = {} },
    match: {
      params: { params: encryptParams = '' },
    },
  } = props;
  const { state = {} } = location;
  const { routes = [] } = state;
  // console.log('🚀 ~ file: index.js ~ line 12 ~ ProjecDetail ~ props', props);
  let routes2 = [];
  if (props.match.params.params !== undefined) {
    let obj = JSON.parse(DecryptBase64(encryptParams));
    // console.log('🚀 ~ file: index.js:20 ~ ProjecDetail ~ obj:', obj);
    // console.log('🚀 ~ file: index.js ~ line 12 ~ ProjecDetail ~ routes', routes);
    routes2 = [...routes].concat({
      name: '简历分发',
      pathname: props?.pathname,
    });
    if (routes.length === 0) {
      obj.routes &&
        (routes2 = obj.routes?.concat({
          name: '简历分发',
          pathname: props?.pathname,
        }));
      // console.log('🚀 ~ file: index.js:29 ~ ProjecDetail ~ routes2:', routes2);
    }
  }
  //去重 考虑到从其他区详情页面回退到简历分发页面的情况
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
      <ResumeDestributionPage
        dictionary={props.dictionary}
        params={JSON.parse(DecryptBase64(encryptParams))}
        routes={newArr}
        {...props}
      ></ResumeDestributionPage>
    </Fragment>
  );
};
export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(ResumeDestribution);
