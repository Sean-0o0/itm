import React, { Fragment } from 'react';
import { Row, Col, Divider } from 'antd';
import TopSearchComponent from '../../../../../../components/WorkPlatForm/EsaPage/RetailAssessment/ParameterSetting/SystemIndicatorCode/TopSearchComponent';
import MainContent from '../../../../../../components/WorkPlatForm/EsaPage/RetailAssessment/ParameterSetting/SystemIndicatorCode/MainContent';

/**
 * 客户经理薪酬考核导航
 */

class SystemIndicator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchData: '', // 搜索的内容对象
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

  getSearchData=(item) => {
    this.setState({
      searchData: item,
    });
  }

  render() {
    const { searchData,height } = this.state;
    return (
      <Fragment>
        <div style={{ height, overflow: 'hidden', backgroundColor: '#FFF' }}>
          <Row className="m-row">
            <Col xs={24} sm={24} lg={24} xl={24} >
              {/* 搜索公共组件 */}
              <TopSearchComponent getSearchData={this.getSearchData} />
              <Divider style={{ margin: '0' }} />
            </Col>
          </Row>
          <Row >
            <Col xs={24} sm={24} lg={24} xl={24} >
              {/* 指标代码列表 */}
              <MainContent salaryTtype={1} searchData={searchData} />
            </Col>
          </Row>
        </div>
      </Fragment>
    );
  }
}
export default SystemIndicator;
