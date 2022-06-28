import React, { Fragment } from 'react';
import { Row, Col } from 'antd';
import LeftSearchComponent from '../../../../../components/WorkPlatForm/EsaPage/HumanAssessment/AssesstorStructureConfiguration/LeftSearchComponent';
import RightMainContent from '../../../../../components/WorkPlatForm/EsaPage/HumanAssessment/AssesstorStructureConfiguration/RightMainContent';

/**
 * 考评人员结构配置
 */

class AssesstorStructureConfiguration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companyData: [],
    };
  }
  setCompany = (value) => {
    this.setState({ companyData: value });
  }
  render() {
    const { companyData } = this.state;
    return (
      <Fragment>
        <Row style={{ height: '100%', backgroundColor: '#FFF' }}>
          <Col xs={8} sm={8} lg={8} xl={8} style={{ height: '100%', padding: '30px 20px', borderRight: '1px solid #E3E3E3' }}>
            {/* 左侧搜索组件 */}
            <LeftSearchComponent setCompany={this.setCompany} />
          </Col>
          <Col xs={16} sm={16} lg={16} xl={16} style={{ height: '100%', padding: '10px 20px' }}>
            {/* 右侧主要内容 */}
            <RightMainContent companyData={companyData} />
          </Col>
        </Row>
      </Fragment>
    );
  }
}
export default AssesstorStructureConfiguration;
