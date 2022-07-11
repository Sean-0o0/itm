import React from 'react';
import { connect } from 'dva';
import { Card, Tabs } from 'antd';
import EventTabs from './EventTabs';

// 引入请求路径的示例
// import { FetchMotSameBatchList } from '../../../../../services/motProduction';
import { getDictKey } from '../../../../../utils/dictUtils';

const { TabPane } = Tabs;
class MotEventIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tgtTpDicts: [],
      Key: '',
    };
  }
  componentWillMount() {
    this.fetchData(this.props.dictionary);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.dictionary !== this.props.dictionary) {
      this.fetchData(nextProps.dictionary);
    }
  }
  fetchData = (dictionary) => {
    // const { dictionary = {} } = this.props;
    const { [getDictKey('tgtTp')]: tgtTpDicts = [] } = dictionary; // MOT任务要求字典
    let Key = '0';
    if (tgtTpDicts.length > 0) {
      Key = tgtTpDicts[0].ibm;
    }
    this.setState({ tgtTpDicts, Key });
  }
  onChange = (Key) => {
    this.setState({ Key });
  }
  render() {
    const { dictionary = {} } = this.props;
    const { tgtTpDicts, Key } = this.state;
    return (
      <Card className="m-card ant-card-padding-transition mot-event ant-card-body" style={{ margin: '1rem 0', height: 'calc(100vh - 10rem)' }}>
        {/*<Tabs className="mot-tabs" defaultActiveKey={Key} onChange={this.onChange}>*/}
        {/*  {*/}
        {/*    tgtTpDicts.map(item => <TabPane tab={item.note} key={item.ibm}>{item.ibm === Key ?*/}
        {/*      <EventTabs tgtTp={item.ibm} dictionary={dictionary} /> : ''}*/}
        {/*    </TabPane>)*/}
        {/*  }*/}
        {/*</Tabs>*/}
              <EventTabs tgtTp={Key} dictionary={dictionary} />
      </Card>
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  authorities: global.authorities,
}))(MotEventIndex);
