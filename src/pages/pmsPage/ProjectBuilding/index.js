import React, { Component } from 'react'
import { connect } from 'dva';
import ProjectBuilding from '../../../components/pmsPage/ProjectBuilding';

class ProjectBuildingPage extends Component {
    state = {}
    render() {
        const { dictionary, location = {} } = this.props;
        const { pathname = '', state = {} } = location;
        const { routes = [] } = state;
        const item = routes.length ? routes[routes.length - 1] : '';
        let result = [];
        if (JSON.stringify(item) !== JSON.stringify({ name: '项目建设情况', pathname: pathname })) {
            result = routes.concat({ name: '项目建设情况', pathname: pathname });
        } else {
            result = routes
        }


        return <ProjectBuilding dictionary={dictionary} routes={result} />
    }
}


export default connect(({ global }) => ({
    dictionary: global.dictionary,
  }))(ProjectBuildingPage);