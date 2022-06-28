import React, { Fragment } from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { connect } from 'dva';
import SalaryAppraisalSearch from '../../../../../../components/WorkPlatForm/EsaPage/RetailAssessment/BusinessNavigation/Common/SalaryAppraisalSearch';
import SalaryTabDetail from '../../../../../../components/WorkPlatForm/EsaPage/RetailAssessment/BusinessNavigation/Common/SalaryTabDetail';

/**
 * 证券经纪人考核薪酬
 */

class AssessmentSalary extends React.Component {
  constructor(props) {
    super(props);
    const { userBasicInfo: { orgid = '', orgname = '' } } = props;
    this.state = {
      mon: Number(moment().subtract(1, 'months').format('YYYYMM')),
      orgNo: Number(orgid),
      orgName: orgname,
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

  componentWillReceiveProps(nextProps) {
    const { userBasicInfo: { orgid, orgname } } = nextProps;
    if (orgid) {
      this.setState({ orgNo: Number(orgid), orgName: orgname, })
    }
  }
  chooseMonth = (date) => {
    this.setState({ mon: Number(date.format('YYYYMM')) });
  }
  chooseOrg = (item) => {
    this.setState({ orgNo: Number(item.key), orgName: item.title });
  }
  updateDimensions = () => {
    const { documentElement } = document;
    const [body] = document.getElementsByTagName('body');
    let height = window.innerHeight || documentElement.clientHeight || body.clientHeight;
    height -= 109;
    this.setState({ height });
  }
  render() {
    const { theme, dictionary } = this.props;
    const { mon, orgNo, orgName, height } = this.state;
    const commonProps = {
      mon,
      orgNo,
      orgName,
      dictionary,
      theme,
      depClass: 2,
    };
    return (
      <Fragment>
         <div style={{ height, overflow: 'hidden' }}>
          <Row className="m-row">
            <Col xs={24} sm={24} lg={24} xl={24} style={{marginBottom: '2px' }}>
              {/* 搜索公共组件 */}
              <SalaryAppraisalSearch leftTile="证券经纪人考核薪酬" {...commonProps} chooseMonth={this.chooseMonth} chooseOrg={this.chooseOrg} />
            </Col>
          </Row>
          <Row className="m-row" style={{ height: 'calc(100% - 5rem)' }}>
            <Col xs={24} sm={24} lg={24} xl={24} style={{ height: '100%' }}>
              {/* 薪酬详情 */}
              <SalaryTabDetail {...commonProps} />
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
}))(AssessmentSalary);
