import React, {Fragment, useState, useEffect, Component} from 'react';
import {connect} from 'dva';
import AttendanceListInfoTab from '../../../components/pmsPage/AttendanceListInfo/index';
import {DecryptBase64} from '../../../components/Common/Encrypt';

const AttendanceListInfo = props => {
  const [params, setParams] = useState({}); //路径参数
  const {
    location: {},
    match: {
      params: {params: encryptParams = ''},
    },
  } = props;
  useEffect(() => {
    if (props.match.params.params !== undefined) {
      console.log("JSON.parse(DecryptBase64(encryptParams))", JSON.parse(DecryptBase64(encryptParams)))
      setParams(JSON.parse(DecryptBase64(encryptParams)));
    }
    return () => {
    };
  }, [props]);

  const {state = {}} = props.location;
  const {routes = []} = state;
  let splId = -1;
  let routes2 = [];
  console.log("props.routes", routes)
  console.log("props.match", props.match)
  console.log("props.match.params.params", props.match.params.params)
  if (props.match.params.params !== undefined) {
    let obj = JSON.parse(DecryptBase64(encryptParams));
    splId = obj.splId;
    routes2 = [...routes].concat({
      name: '考勤列表',
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
  console.log("props.newArr", newArr)


  return (
    <Fragment>
      <AttendanceListInfoTab dictionary={props.dictionary} routes={newArr} params={params}></AttendanceListInfoTab>
    </Fragment>
  );
};
export default connect(({global}) => ({
  dictionary: global.dictionary,
}))(AttendanceListInfo);
