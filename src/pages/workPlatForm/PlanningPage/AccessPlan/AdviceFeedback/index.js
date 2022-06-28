import React, { Component } from 'react';
import { connect } from 'dva';
import AdviceFeedbackList from '../../../../../components/WorkPlatForm/PlanningPage/AccessPlan/AdviceFeedbackList';

class AdviceFeedback extends Component {
  render() {
    return (
      <AdviceFeedbackList/>
      
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(AdviceFeedback);