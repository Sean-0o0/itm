import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {DecryptBase64} from '../../../components/Common/Encrypt';
import MemberDetailPage from '../../../components/pmsPage/MemberDetailPage';

const MemberDetail = props => {
  const {
    match: {
      params: {params: encryptParams = ''},
    },
    dictionary,
    location = {},
  } = props;
  const {state = {}} = location;
  const {routes = []} = state;
  let ryid = -1;
  let routes2 = [];
  console.log("props.match", props.match)
  console.log("props.match.params.params", props.match.params.params)
  if (props.match.params.params !== undefined) {
    let obj = JSON.parse(DecryptBase64(encryptParams));
    ryid = obj.ryid;
    routes2 = [...routes].concat({
      name: '外包人员详情',
      pathname: props?.pathname,
    });
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
      <MemberDetailPage dictionary={dictionary} routes={newArr} ryid={ryid}/>
    </Fragment>
  );
};

export default connect(({global}) => ({
  dictionary: global.dictionary,
}))(MemberDetail);
