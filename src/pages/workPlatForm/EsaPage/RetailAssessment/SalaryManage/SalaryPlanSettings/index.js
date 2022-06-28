import React, { Fragment } from 'react';
import { Row, Col, Spin } from 'antd';
import { connect } from 'dva';
import TopSearchComponent from '../../../../../../components/WorkPlatForm/EsaPage/RetailAssessment/SalaryManage/SalaryPlanSettings/TopSearchComponent';
import MainContent from '../../../../../../components/WorkPlatForm/EsaPage/RetailAssessment/SalaryManage/SalaryPlanSettings/MainContent';
import { DecryptBase64 } from '../../../../../../components/Common/Encrypt';

/**
 * 薪酬方案设置
 */
class SalaryPlanSettings extends React.Component {
  constructor(props) {
    super(props);
    const { userBasicInfo: { orgid = '', orgname = '' }, match: { params: { versionData = '' } } } = props;
    const versionDataJson = versionData ? JSON.parse(DecryptBase64(versionData)) : {};
    const { version: versionId, orgid: orgId } = versionDataJson;
    this.state = {
      selectedYyb: orgId || orgid,
      selectedYybName: orgname,
      versionId: versionId || '',
      height: 0,
      loading: false
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
  componentWillReceiveProps(nextProps) {
    const { userBasicInfo = {}, match: { params: { versionData = '' }} } = nextProps;
    const versionDataJson = versionData ? JSON.parse(DecryptBase64(versionData)) : {};
    const { version: versionId, orgid: orgId } = versionDataJson;
    if (orgId && versionId && orgId !== this.props.orgId && versionId !== this.props.versionId) {
      this.setState({
        selectedYyb: orgId,
        versionId: versionId,
      });
    } else if (JSON.stringify(userBasicInfo) !== JSON.stringify(this.props.userBasicInfo)) {
      const { orgid = '', orgname = '' } = userBasicInfo;
      this.setState({
        selectedYyb: orgid,
        selectedYybName: orgname,
      });
    }
  }
  updateDimensions = () => {
    const { documentElement } = document;
    const [body] = document.getElementsByTagName('body');
    let height = window.innerHeight || documentElement.clientHeight || body.clientHeight;
    height -= 118;
    this.setState({ height });
  }
  handleYYBChange = (value, label) => {
    this.setState({
      selectedYyb: value || '',
      selectedYybName: label,
    });
  }
  setLoading = (loading) => {
    this.setState({
      loading: loading
    })
  }
  render() {
    const { selectedYyb = '', selectedYybName = '', height, loading } = this.state;
    const {
      gxyybDatas = [],
      staffClassData = [],
      staffLevelData = [],
      selectedStaff = [],
      selectedSalary = [],
      salaryData = [],
      dispatch, match: { params: { versionData = '' } } } = this.props;
    const versionDataJson = versionData ? JSON.parse(DecryptBase64(versionData)) : {};
    const { version: versionId, orgid: orgId } = versionDataJson;
    return (
      <Fragment>
        <Spin spinning={loading}>
          <div className="bg-white mt10" style={{ height }}>
            <Row>
              <Col xs={24} sm={24} lg={24} xl={24}>
                {/* 查询搜索组件 */}
                <TopSearchComponent handleYYBChange={this.handleYYBChange} gxyybDatas={gxyybDatas} selectedYyb={selectedYyb} selectedYybName={selectedYybName} orgId={orgId} versionId={versionId} />
              </Col>
            </Row>
            <Row>
              <MainContent
                height={height}
                selectedYyb={selectedYyb}
                selectedYybName={selectedYybName}
                staffClassData={staffClassData}
                staffLevelData={staffLevelData}
                selectedStaff={selectedStaff}
                selectedSalary={selectedSalary}
                salaryData={salaryData}
                dispatch={dispatch}
                setLoading={this.setLoading}
                orgId={orgId}
                versionId={versionId}
              />
            </Row>
          </div>
        </Spin>
      </Fragment>

    );
  }
}

export default connect(({ global, salaryPlanSettings }) => ({
  userBasicInfo: global.userBasicInfo,
  gxyybDatas: salaryPlanSettings.gxyybDatas,
  staffClassData: salaryPlanSettings.staffClassData, // 人员类别数据
  staffLevelData: salaryPlanSettings.staffLevelData, // 人员级别数据
  selectedStaff: salaryPlanSettings.selectedStaff, // 已选人员数据（包含人员下的薪酬方案数据）
  selectedSalary: salaryPlanSettings.selectedSalary, // 已选薪酬代码（已排序）
  salaryData: salaryPlanSettings.salaryData, // 薪酬代码数据
}))(SalaryPlanSettings);
