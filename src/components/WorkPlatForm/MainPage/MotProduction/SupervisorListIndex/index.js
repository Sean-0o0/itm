/* eslint-disable no-unexpected-multiline */
import React from 'react';
import { Card, Row } from 'antd';
import { connect } from 'dva';
import SupervisorListInfo from './SupervisorListInfo';
import SupervisorListDetails from './SupervisorListDetails';
//引入请求路径的示例
// import { FetchMotSameBatchList } from '../../../../../services/motProduction';
class SupervisorListIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tgtTpDicts: [],
      Key: '',
    };
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps){
  }
  render() {
    const { dictionary = {} } = this.props;
    // const { tgtTpDicts, Key } = this.state;
    return (
        <Row>
            <Card className="m-card ant-card-padding-transition" style={{ margin: '1rem 0', height: '64px' }}>
                <SupervisorListInfo dictionary={dictionary} />
            </Card>
            <Card className="m-card ant-card-padding-transition" style={{ margin: '1rem 0' }}>
                <SupervisorListDetails dictionary={dictionary} />
            </Card>
        </Row>
      
    );
  }
}

export default connect(({ motEvent, global }) => ({
  dictionary: global.dictionary,
  authorities: global.authorities,
}))(SupervisorListIndex);
