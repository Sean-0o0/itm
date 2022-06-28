import React, { Fragment } from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import SalaryAppraisalSearch from '../../../../../../components/WorkPlatForm/EsaPage/RetailAssessment/BusinessNavigation/Common/SalaryAppraisalSearch';
import SalaryTabDetail from '../../../../../../components/WorkPlatForm/EsaPage/RetailAssessment/BusinessNavigation/Common/SalaryTabDetail';

/**
 * 考核导航整合页面
 */

class NavigationCommon extends React.Component {
  constructor(props) {
    super(props);
    const { userBasicInfo: { orgid = '', orgname = '' } } = props;
    this.state = {
      mon: Number(moment().subtract(1, 'months').format('YYYYMM')),
      orgNo: Number(orgid),
      orgName: orgname,
      depClass: '',
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
  chooseMonth = (date) => {
    this.setState({ mon: Number(date.format('YYYYMM')) });
  }
  chooseOrg = (item) => {
    this.setState({ orgNo: Number(item.key), orgName: item.title });
  }
  chooseDepClass = (depClass) => {
    this.setState({ depClass: depClass ? Number(depClass) : '' });
  }
  render() {
    const { theme, dictionary } = this.props;
    const { mon, orgNo, orgName, depClass,height } = this.state;
    const commonProps = {
      mon,
      orgNo,
      orgName,
      dictionary,
      theme,
      depClass,
    };
    return (
      <Fragment>
        <div style={{ height, overflow: 'hidden' }}>
          <Row className="m-row">
            <Col xs={24} sm={24} lg={24} xl={24} style={{ marginBottom: '2px' }}>
              {/* 搜索公共组件 */}
              <SalaryAppraisalSearch
                leftTile="薪酬考核导航"
                {...commonProps}
                chooseMonth={this.chooseMonth}
                chooseOrg={this.chooseOrg}
                chooseDepClass={this.chooseDepClass}
                type="common"
              />
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
}))(NavigationCommon);
