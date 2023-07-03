import React, { Fragment } from 'react';
import { connect } from 'dva';
import CustomReportDetailTab from '../../../components/pmsPage/CustomReportDetail/index';
import { DecryptBase64 } from '../../../components/Common/Encrypt';
const CustomReportDetail = props => {
  const {
    match: {
      params: { params: encryptParams = '' },
    },
    dictionary,
  } = props;
  
  let bgid = -1;
  let routes2 = [];
  if (props.match.params.params !== undefined) {
    let obj = JSON.parse(DecryptBase64(encryptParams));
    bgid = obj.bgid;
    obj.routes &&
      (routes2 = obj.routes?.concat({
        name: '报告列表',
        pathname: props?.location?.pathname,
      }));
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
      <CustomReportDetailTab dictionary={dictionary} routes={newArr} bgid={bgid} />
    </Fragment>
  );
};
export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(CustomReportDetail);
