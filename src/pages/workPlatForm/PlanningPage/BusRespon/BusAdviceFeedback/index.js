import React, { Component } from 'react';
import { connect } from 'dva';
import AssessmentList from '../../../../../components/WorkPlatForm/PlanningPage/BusAccessPlan/BusAdviceFeedbackList';

class BusAdviceFeedback extends Component {
  render() {
    return (
      <AssessmentList/>

    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(BusAdviceFeedback);
