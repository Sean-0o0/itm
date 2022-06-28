import React, { Fragment } from 'react';
import { connect } from 'dva';
import PerformanceAppraisal from '../../../../../../components/WorkPlatForm/EsaPage/RetailAssessment/PerformanceAppraisal';
import { DecryptBase64 } from '../../../../../../components/Common/Encrypt';

/**
 * 个人绩效考核方案
 */

class PersonalAppraisalPlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    const { theme, dictionary = {}, userBasicInfo = {}, match: { params: { versionData = '' } } } = this.props;
    const versionDataJson = versionData ? JSON.parse(DecryptBase64(versionData)) : {};
    const { version: versionId = '', orgid: orgId = '', examClass:vexamClass='', orgName: vorgName = '' } = versionDataJson;
     return (
      <Fragment>
        <PerformanceAppraisal vorgName={vorgName} vexamClass={vexamClass} theme={theme} dictionary={dictionary} userBasicInfo={userBasicInfo} pageType="2" orgId={orgId} versionId={versionId} />
      </Fragment>
    );
  }
}
export default connect(({ global }) => ({
  dictionary: global.dictionary,
  theme: global.theme,
  userBasicInfo: global.userBasicInfo,
}))(PersonalAppraisalPlan);
