import React, { Fragment } from 'react';
import { Row, Col } from 'antd';
import TopSearchComponent from '../../../../../components/WorkPlatForm/EsaPage/SystemConfiguration/CleaningProcessingScheduling/TopSearchComponent';
import MainContent from '../../../../../components/WorkPlatForm/EsaPage/SystemConfiguration/CleaningProcessingScheduling/MainContent';

/**
 * 清洗加工调度
 */

class CleaningProcessingScheduling extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
  render() {
    const { height } = this.state;
    return (
      <Fragment>
        <div style={{ backgroundColor: '#FFF', height }}>
          <Row>
            <Col xs={24} sm={24} lg={24} xl={24}>
              {/* 查询搜索组件 */}
              <TopSearchComponent />
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={24} lg={24} xl={24}>
              {/* 主要内容 */}
              <MainContent />
            </Col>
          </Row>
        </div>
      </Fragment>
    );
  }
}
export default CleaningProcessingScheduling;
