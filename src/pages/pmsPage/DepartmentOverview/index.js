import React, { Component } from 'react'
import { connect } from 'dva';
import DepartmentOverview from '../../../components/pmsPage/DepartmentOverview';

class DepartmentOverviewPage extends Component {
    state = {}
    render() {
        const { dictionary, location = {} } = this.props;
        const { pathname = '', state = {} } = location;
        const { routes = [] } = state;
        const item = routes.length ? routes[routes.length - 1] : '';
        let result = [];
        if (JSON.stringify(item) !== JSON.stringify({ name: '部门人员情况', pathname: pathname })) {
            result = routes.concat({ name: '部门人员情况', pathname: pathname });
        } else {
            result = routes
        }


        return <DepartmentOverview dictionary={dictionary} routes={result} />;
    }
}


export default connect(({ global }) => ({
    dictionary: global.dictionary,
  }))(DepartmentOverviewPage);