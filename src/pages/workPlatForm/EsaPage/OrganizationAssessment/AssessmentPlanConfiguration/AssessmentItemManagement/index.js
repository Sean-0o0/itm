import React, { Fragment } from 'react';
import { Row, Col } from 'antd';
import LeftSearchComponent from '../../../../../../components/WorkPlatForm/EsaPage/OrganizationAssessment/AssessmentPlanConfiguration/AssessmentItemManagement/LeftSearchComponent';
import RightMainContent from '../../../../../../components/WorkPlatForm/EsaPage/OrganizationAssessment/AssessmentPlanConfiguration/AssessmentItemManagement/RightMainContent';

/**
 * 考核项管理
 */

class AssessmentItemManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      examId: '', // 选中考核项id
      height:0
    };
  }
  componentWillMount() {
    this.updateDimensions();
  }
  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }
  updateDimensions = () => {
    const { documentElement } = document;
    const [body] = document.getElementsByTagName('body');
    let height = window.innerHeight || documentElement.clientHeight || body.clientHeight;
    height -= 109;
    this.setState({ height });
  }
  handleSelectItem =(examId) => {
    this.setState({
      examId,
    });
  }
  render() {
    const { examId,height } = this.state;
    return (
      <Fragment>
        <Row className="esa-scrollbar" style={{ height, backgroundColor: 'white' }}>
          <Col span={8} style={{ height: '100%', borderRight: '1px solid #eee', overflowY: 'auto', overflowX: 'auto' }}>
            {/* 左侧搜索组件 */}
            <LeftSearchComponent handleSelectItem={this.handleSelectItem} />
          </Col>
          <Col span={16} style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
            {/* 右侧主要内容 */}
            <RightMainContent examId={examId} />
          </Col>
        </Row>
      </Fragment>
    );
  }
}
export default AssessmentItemManagement;
