import React, { Fragment } from 'react';
import { connect } from 'dva';
import SupplierSituationTab from '../../../components/pmsPage/SupplierSituation/index';
import { DecryptBase64 } from '../../../components/Common/Encrypt';
const SupplierSituation = props => {
  const {
    match: {
      params: { params: encryptParams = '' },
    },
    dictionary,
    location = {},
  } = props;
  const { state = {} } = location;
  const { routes = [] } = state;
  let routes2 = [];
  routes2 = [...routes].concat({
    name: '供应商情况',
    pathname: props?.pathname,
  });

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
  let jsonParam = {};
  if (props.match?.params?.params !== undefined) {
    jsonParam = JSON.parse(DecryptBase64(encryptParams) || '{}');
  }
  return (
    <Fragment>
      <SupplierSituationTab
        dictionary={dictionary}
        routes={newArr}
        defaultYear={jsonParam.defaultYear}
      ></SupplierSituationTab>
    </Fragment>
  );
};
export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(SupplierSituation);
