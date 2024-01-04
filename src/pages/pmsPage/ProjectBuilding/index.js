import React, { Component } from 'react';
import { connect } from 'dva';
import ProjectBuilding from '../../../components/pmsPage/ProjectBuilding';
import { DecryptBase64 } from '../../../components/Common/Encrypt';

class ProjectBuildingPage extends Component {
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
    if (JSON.stringify(item) !== JSON.stringify({ name: '项目建设情况', pathname: pathname })) {
      result = routes.concat({ name: '项目建设情况', pathname: pathname });
    } else {
      result = routes;
    }
    let jsonParam = {};
    if (this.props.match.params.params !== undefined) {
      jsonParam = JSON.parse(DecryptBase64(encryptParams) || '{}');
    }

    return <ProjectBuilding dictionary={dictionary} routes={result} defaultYear={jsonParam.defaultYear} />;
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(ProjectBuildingPage);
