import React, { Fragment } from 'react';
import { Row, Col, message } from 'antd';
import LeftPanel from '../../../../../../components/WorkPlatForm/EsaPage/RetailAssessment/SalaryCommissionManage/CommissionFormulaDefinition/LeftPanel';
import RightFormulaInfo from '../../../../../../components/WorkPlatForm/EsaPage/RetailAssessment/SalaryCommissionManage/CommissionFormulaDefinition/RightFormulaInfo';
import { FetchQueryListRoyaltyFormula } from '../../../../../../services/EsaServices/commissionManagement';
import { DecryptBase64 } from '../../../../../../components/Common/Encrypt';

/**
 * 薪酬方案设置
 */

class CommissionFormulaDefinition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      leftDataList: [],
      isModify: false,
      itemId: '',
      current: 1, // 当前页码
      total: 0, // 总条数
      height: 0
    };
  }

  componentWillMount() {
    this.updateDimensions();
  }
  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    this.FetchQueryListRoyaltyFormula();
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

  // 获取左侧列表点击数据
  getdata = (data) => {
    this.setState({ data });
  }

  // 搜索公式
  handleSearch = (value) => {
    this.FetchQueryListRoyaltyFormula({
      tmplName: value,
    });
  }

  // 刷新列表
  refreshLeftList = () => {
    this.FetchQueryListRoyaltyFormula();
  }

  // 修改后，刷新页面，默认显示修改的记录
  updateIsModify = (flag, itemId) => {
    this.setState({ isModify: flag, itemId });
  }

  // 查询接口
  FetchQueryListRoyaltyFormula = (params) => {
    const {  match: { params: { versionData = '' } } } = this.props;
    const versionDataJson =  versionData ? JSON.parse(DecryptBase64(versionData)) : {};
    const version = versionDataJson.VersionId || versionDataJson.parentVersionId || '';
    const paramsValus = {
      paging: 1,
      pageSize: 10,
      total: -1,
      current: 1,
      sort: '',
      tmplName: '',
      versionId: version,
      ...params,
    };
    FetchQueryListRoyaltyFormula({ ...paramsValus }).then((response) => {
      const { records = [], total = 0 } = response;
      this.setState({ leftDataList: records, data: records[0], total });
      if (records.length > 0) {
        const { isModify, itemId } = this.state;
        if (isModify) {
          records.forEach((item) => {
            const { id } = item;
            if (itemId === id) {
              this.getdata(item);
            }
          });
          this.setState({ isModify: false });
        } else {
          this.getdata(records[0]);
        }
      } else {
        this.getdata({});
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 切换页码
  handlePageChange = (current) => {
    this.setState({ current });
    this.FetchQueryListRoyaltyFormula({ current });
  }

  render() {
    const { data = {}, leftDataList = [], current = 0, total = 0, height } = this.state;
    const pagination = { current, total };
    const {  match: { params: { versionData = '' } } } = this.props;
    const versionDataJson =  versionData ? JSON.parse(DecryptBase64(versionData)) : {};
    const version = versionDataJson.VersionId || versionDataJson.parentVersionId || '';
    const st = versionDataJson.st || '';
    return (
      <Fragment>
        <Row style={{ height }} className="mt10 esa-scrollbar">
          <Col xs={6} sm={6} lg={6} xl={6} className="h100" style={{ borderRight: '1px solid #e8e8e8' }}>
            {/* 左侧 列表 */}
            <LeftPanel versionId={version} st={st} getdata={this.getdata} pagination={pagination} dataList={leftDataList} data={data} handleSearch={this.handleSearch} refreshLeftList={this.refreshLeftList} handlePageChange={this.handlePageChange} />
          </Col>
          <Col xs={18} sm={18} lg={18} xl={18} className="h100">
            {/* 右侧 详情 */}
            <RightFormulaInfo versionId={version} st={st} updateIsModify={this.updateIsModify} data={data} refreshLeftList={this.refreshLeftList} />
          </Col>
        </Row>
      </Fragment>
    );
  }
}
export default CommissionFormulaDefinition;
