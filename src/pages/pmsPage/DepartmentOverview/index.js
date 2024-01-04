import React, { Component } from 'react';
import { connect } from 'dva';
import DepartmentOverview from '../../../components/pmsPage/DepartmentOverview';
import { DecryptBase64 } from '../../../components/Common/Encrypt';

class DepartmentOverviewPage extends Component {
  state = {};
  render() {
    const {
      dictionary,
      location = {},
      match: {
        params: { params: encryptParams = '' },
      },
    } = this.props;
    const { pathname = '', state = {} } = location;
    const { routes = [] } = state;
    const item = routes.length ? routes[routes.length - 1] : '';
    let result = [];
    if (JSON.stringify(item) !== JSON.stringify({ name: '部门人员情况', pathname: pathname })) {
      result = routes.concat({ name: '部门人员情况', pathname: pathname });
    } else {
      result = routes;
    }
    let jsonParam = {};
    if (this.props.match.params.params !== undefined) {
      jsonParam = JSON.parse(DecryptBase64(encryptParams) || '{}');
    }

    return <DepartmentOverview dictionary={dictionary} routes={result} defaultYear={jsonParam.defaultYear} />;
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(DepartmentOverviewPage);
