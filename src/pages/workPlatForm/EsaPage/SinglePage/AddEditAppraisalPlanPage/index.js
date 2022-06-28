import React, { Fragment } from 'react';
import { connect } from 'dva';
import AddEditAppraisalPlan from './../../../../../components/WorkPlatForm/EsaPage/RetailAssessment/PerformanceAppraisal/Common/AddEditAppraisalPlan';
/**
 * 新增修改供livebos直接打开
 */
class AddEditAppraisalPlanPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    const { dictionary = {}, onSubmitOperate, onCancelOperate, match = {} } = this.props;
    const { id } = match.params;
    return (
      <Fragment>
        <AddEditAppraisalPlan dictionary={dictionary} onSubmitOperate={onSubmitOperate} onCancelOperate={onCancelOperate} id={id} />
      </Fragment>
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(AddEditAppraisalPlanPage);
