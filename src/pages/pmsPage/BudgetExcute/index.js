import { connect } from 'dva';
import React, { Component } from 'react';
import BudgetExcute from '../../../components/pmsPage/BudgetExcute';

class BudgetExcutePage extends Component {
  state = {};
  render() {
    const { dictionary, location = {} } = this.props;
    const { pathname = '', state = {} } = location;
    const { routes = [] } = state;
    const item = routes.length ? routes[routes.length - 1] : '';
    let result = [];
    if (JSON.stringify(item) !== JSON.stringify({ name: '预算执行情况', pathname: pathname })) {
      result = routes.concat({ name: '预算执行情况', pathname: pathname });
    } else {
      result = routes;
    }

    return <BudgetExcute dictionary={dictionary} routes={result} />;
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(BudgetExcutePage);
