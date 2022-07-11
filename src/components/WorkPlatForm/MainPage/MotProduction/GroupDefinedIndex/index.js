/* eslint-disable react/no-unused-state */
import React from 'react';
import { Card, Tabs } from 'antd';
import { connect } from 'dva';
import { getDictKey } from '../../../../../utils/dictUtils';
import GroupDefinedIndexTabs from './GroupDefinedIndexTabs';

const { TabPane } = Tabs;

class GroupDefinedIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      defaultActiveKey: '',
      tgtTpDicts: [],
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
    let defaultActiveKey = '0';
    if (tgtTpDicts.length > 0) {
      defaultActiveKey = tgtTpDicts[0].ibm;
    }
    this.setState({
      defaultActiveKey,
      tgtTpDicts,
    });
  }
  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  change = (e) => {
    this.setState({
      defaultActiveKey: e,
    });
  };
  render() {
    const { defaultActiveKey, tgtTpDicts } = this.state;
    const { dictionary = {} } = this.props;
    return (
      <Card className="m-card ant-card-padding-transition mot-group" style={{ margin: '1rem 0', height: 'calc(100vh - 10rem)' }}>
        {/*<Tabs className="mot-tabs" activeKey={defaultActiveKey} onChange={this.change}>*/}
        {/*  {*/}
        {/*    tgtTpDicts.map(item => <TabPane tab={item.note} key={item.ibm}>{defaultActiveKey === item.ibm ? <GroupDefinedIndexTabs tgtTp={defaultActiveKey} dictionary={dictionary} /> : ''}</TabPane>)*/}
        {/*  }*/}
        {/*</Tabs>*/}
          <GroupDefinedIndexTabs tgtTp={defaultActiveKey} dictionary={dictionary} />
      </Card>
    );
  }
}

export default GroupDefinedIndex;

