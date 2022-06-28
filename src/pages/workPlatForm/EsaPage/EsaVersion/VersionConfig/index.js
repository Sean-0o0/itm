import React, { Fragment } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import VersionConfigTable from '../../../../../components/WorkPlatForm/EsaPage/EsaVersion/VersionConfig';

/**
 * 版本配置表
 */

class VersionConfig extends React.Component {
  constructor(props) {
    // const { userBasicInfo: { orgid = '', orgname = '' } } = props;
    super(props);
    this.state = {
      // orgNo: Number(orgid),
      // orgName: orgname,
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
    // const { userBasicInfo: { orgid, orgname } } = nextProps;
    // if (orgid) {
    //   this.setState({ orgNo: Number(orgid), orgName: orgname, })
    // }
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
    const { theme } = this.props;

    return (
      <Fragment>
        <div style={{ height, overflow: 'hidden' }}>
          <Row className="m-row" style={{ height: '100%' }}>
            <Col xs={24} sm={24} lg={24} xl={24} style={{ height: '100%' }}>
              <VersionConfigTable theme={theme} />
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
}))(VersionConfig);
