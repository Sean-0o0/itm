import React, { Fragment } from 'react';
import { connect } from 'dva';
import CustomRptManagementTab from '../../../components/pmsPage/CustomRptManagement/index';
import { DecryptBase64 } from '../../../components/Common/Encrypt';
const CustomRptManagement = props => {
  const {
    match: {
      params: { params: encryptParams = '' },
    },
    dictionary,
    cacheLifecycles,
  } = props;
  const { routes = [] } = props?.location?.state || {};
  let routes2 = [];

  routes2 = [...routes].concat({
    name: '报表管理',
    pathname: props?.pathname,
  });
  // if (props.match.params.params !== undefined) {
  //   let obj = JSON.parse(DecryptBase64(encryptParams));
  //   routes.length === 0 &&
  //     obj.routes &&
  //     (routes2 = obj.routes?.concat({
  //       name: '报表管理',
  //       pathname: props?.location?.pathname,
  //     }));
  // }

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
      <CustomRptManagementTab
        dictionary={dictionary}
        routes={newArr}
        cacheLifecycles={cacheLifecycles}
      />
    </Fragment>
  );
};
export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(CustomRptManagement);
