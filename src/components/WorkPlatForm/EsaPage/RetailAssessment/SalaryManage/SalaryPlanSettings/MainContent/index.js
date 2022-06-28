import React from 'react';
import { Col } from 'antd';
import LeftPanel from './LeftPanel';
import RightProInfo from './RightProInfo';

class MainContent extends React.Component {
  componentDidMount() {
    // 查询现有项目
    this.fetchSelectedSalaryItems(this.props);
    const { dispatch, versionId } = this.props;
    if (dispatch) {
      dispatch({
        type: 'salaryPlanSettings/fetchSalary',
        payload: { versionId: versionId },
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { selectedYyb: preYyb } = this.props;
    const { selectedYyb: aftYyb } = nextProps;
    if (preYyb !== aftYyb) {
      this.fetchSelectedSalaryItems(nextProps);
    }
  }

  fetchSelectedSalaryItems = (nextProps) => {
    const { selectedYyb = '', versionId = '' } = nextProps;
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'salaryPlanSettings/fetchQuerySalaryProgram',
        payload: { orgNo: selectedYyb === '' ? 0 : selectedYyb, versionId },
      });
    }
  }

  render() {
    const {
      selectedYyb = '',
      selectedYybName = '',
      staffClassData = [],
      staffLevelData = [],
      selectedStaff = [],
      selectedSalary = [],
      salaryData = [],
      height,
      dispatch,
      setLoading,
      versionId
    } = this.props;
    return (
      <React.Fragment>
        <Col xs={24} sm={8} lg={5}>
          <LeftPanel
            height={height}
            selectedYyb={selectedYyb}
            selectedYybName={selectedYybName}
            staffClassData={staffClassData}
            staffLevelData={staffLevelData}
            selectedStaff={selectedStaff}
            selectedSalary={selectedSalary}
            salaryData={salaryData}
            dispatch={dispatch}
            setLoading={setLoading}
            versionId={versionId}
          />
        </Col>
        <Col xs={24} sm={16} lg={19}>
          <RightProInfo
            height={height}
            selectedYybName={selectedYybName}
            staffClassData={staffClassData}
            staffLevelData={staffLevelData}
            salaryData={salaryData}
            selectedStaff={selectedStaff}
            selectedSalary={selectedSalary}
            dispatch={dispatch}
          />
        </Col>
      </React.Fragment>
    );
  }
}

export default MainContent;
