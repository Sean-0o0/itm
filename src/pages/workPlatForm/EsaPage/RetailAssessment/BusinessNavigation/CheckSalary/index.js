import React, { Fragment } from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import CheckSalarySearch from '../../../../../../components/WorkPlatForm/EsaPage/RetailAssessment/BusinessNavigation/CheckSalary/CheckSalarySearch';
import CheckSalaryTable from '../../../../../../components/WorkPlatForm/EsaPage/RetailAssessment/BusinessNavigation/CheckSalary/CheckSalaryTable';
import { DecryptBase64 } from '../../../../../../components/Common/Encrypt';

/**
 * 核对薪酬
 */

class CheckSalary extends React.Component {
  constructor(props) {
    super(props);
    const { userBasicInfo: { orgid = '', orgname = '' }, match: { params: { params } } } = props;
    const searchParam = params ? JSON.parse(DecryptBase64(params)) : {}; // 处理跳转参数
    const { mon = Number(moment().subtract(1, 'months').format('YYYYMM')), orgNo = Number(orgid), depClass = '',
      orgName = orgname, classId = '', levelId = '', status = '', type = 0, // 是否展示为单表格
    } = searchParam;
    this.state = {
      queryParams: {
        mon,
        orgNo,
        depClass,
        orgName,
        classId,
        levelId,
        status,
      },
      type,
      height: 0
    };
  }
  componentWillMount() {
    this.updateDimensions();
  }
  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }
  componentWillReceiveProps(nextProps) {
    const { userBasicInfo: { orgid: preOrgid } } = this.props;
    const { userBasicInfo: { orgid: aftOrgid, orgname = '' }, match: { params: { params } } } = nextProps;
    const { queryParams } = this.state;
    if (preOrgid !== aftOrgid && !params) {
      this.setState({
        queryParams: {
          ...queryParams,
          orgNo: aftOrgid,
          orgName: orgname
        }
      })
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }
  querySubmit = (queryParams) => {
    this.setState({ queryParams });
  }
  updateDimensions = () => {
    const { type } = this.state;
    const { documentElement } = document;
    const [body] = document.getElementsByTagName('body');
    let height = window.innerHeight || documentElement.clientHeight || body.clientHeight;
    if (type === 0) {
      height -= 109;
    }
    this.setState({ height });
  }
  render() {
    const { queryParams, type, height } = this.state;
    const { dictionary, userBasicInfo, theme } = this.props;
    return (
      <Fragment>
        <div style={{ height: '100%', overflow: `hidden ${type === 0 ? '' : 'auto'}` }} id="CheckSalaryDom">
          {type === 0 && (
            <Row className="m-row m-row-form">
              <Col xs={24} sm={24} lg={24} xl={24} style={{ marginBottom: '2px' }}>
                {/* 搜索组件 */}
                <CheckSalarySearch
                  querySubmit={this.querySubmit}
                  dictionary={dictionary}
                  userBasicInfo={userBasicInfo}
                  params={queryParams}
                />
              </Col>
            </Row>
          )}
          <Row className="m-row" style={{ height: '100%' }}>
            <Col xs={24} sm={24} lg={24} xl={24} style={{ height: 'calc(100% - 3rem)' }}>
              {/* 核对薪酬表格 */}
              <CheckSalaryTable queryParams={queryParams} theme={theme} type={type} />
            </Col>
          </Row>
        </div>
      </Fragment>
    );
  }
}
export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
  theme: global.theme,
}))(CheckSalary);
