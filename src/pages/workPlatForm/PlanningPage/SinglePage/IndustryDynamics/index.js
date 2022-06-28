import React, { Component } from 'react';
import { connect } from 'dva';
import IndustryDynamicsList from '../../../../../components/WorkPlatForm/PlanningPage/SinglePage/IndustryDynamics';

class IndustryDynamics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: '',
      type: '1',
      datas:[],
      id:'',//选中的行业动态id
    };
  }

  render() {
    return (
      <IndustryDynamicsList/>
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(IndustryDynamics);
