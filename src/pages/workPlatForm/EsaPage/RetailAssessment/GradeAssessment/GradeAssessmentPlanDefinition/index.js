import React, { Fragment } from 'react';
import { Row, Col } from 'antd';
import TopSearchComponent from '../../../../../../components/WorkPlatForm/EsaPage/RetailAssessment/GradeAssessment/GradeAssessmentPlanDefinition/TopSearchComponent';
import BottomPannel from '../../../../../../components/WorkPlatForm/EsaPage/RetailAssessment/GradeAssessment/GradeAssessmentPlanDefinition/BottomPannel';

/**
 * 级别考核方案定义
 */

class GradeAssessmentPlanDefinition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    return (
      <Fragment>
        <Row>
          <Col xs={24} sm={24} lg={24} xl={24}>
            {/* 查询搜索组件 */}
            <TopSearchComponent />
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={24} lg={24} xl={24}>
            {/* 方案列表 */}
            <BottomPannel />
          </Col>
        </Row>
      </Fragment>
    );
  }
}
export default GradeAssessmentPlanDefinition;
