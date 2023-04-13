import React, { Fragment } from 'react';
import { connect } from 'dva';
import SupplierDetailTab from '../../../components/pmsPage/SupplierDetail/index';
import { DecryptBase64 } from '../../../components/Common/Encrypt';
const SupplierDetail = props => {
  const {
    match: {
      params: { params: encryptParams = '' },
    },
    dictionary,
    location = {},
  } = props;
  const { state = {} } = location;
  const { routes = [] } = state;
  let splId = -1;
  let routes2 = [];
  if (props.match.params.params !== undefined) {
    let obj = JSON.parse(DecryptBase64(encryptParams));
    splId = obj.splId;
    routes2 = [...routes].concat({
      name: '供应商详情',
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
      <SupplierDetailTab dictionary={dictionary} routes={newArr} splId={splId}></SupplierDetailTab>
    </Fragment>
  );
};
export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(SupplierDetail);
