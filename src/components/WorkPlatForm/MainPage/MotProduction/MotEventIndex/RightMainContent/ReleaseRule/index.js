import React from 'react';
import { Card, Tabs } from 'antd';
import TaskRule from './TaskRule';
import MsgRule from './MsgRule';
// 引入请求路径的示例
// import { FetchMotSameBatchList } from '../../../../../services/motProduction';
// import { getDictKey } from '../../../../../utils/dictUtils';
const { TabPane } = Tabs;
class MotEventIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonMsg: [],
      msgKey: '',
      inputTreeType: false,
      inputTreeLength: 0,
      position: {},
    };
  }
  componentDidMount() {
    // this.fetchTaskData(this.props.data);
    this.fetchMagData(this.props.data);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      //   this.fetchTaskData(nextProps.data);
      this.fetchMagData(nextProps.data);
    }
  }
  fetchMagData = (data) => {
    if (data !== '') {
      let jsonMsg = [];
      if (data.jsonMsgSndRule !== '') {
        jsonMsg = JSON.parse(data.jsonMsgSndRule);
      }
      this.setState({ jsonMsg });
      const { setData } = this.props;
      if (setData) {
        setData('jsonMsg', jsonMsg);
      }
    }
  }
  setJsonMsgData = (value) => {
    const { setData } = this.props;
    this.setState({
      jsonMsg: value,
    });
    if (setData) {
      setData('jsonMsg', value);
    }
  };
  setJsonTaskData = (value) => {
    const { setData } = this.props;
    if (setData) {
      setData('jsonTask', value);
    }
  };
  getMsgFormData = () => {
    if (this.msgRule) {
      const valus = this.msgRule.getItemsValue();
      return valus;
    }
  }
  getTaskFormData = () => {
    if (this.taskRule) {
      const valus = this.taskRule.getItemsValue();
      return valus;
    }
  }
  setRuleData = (field, value) => {
    this.setState({
      [field]: value,
    });
  }
  render() {
    const { dictionary = {}, type, data, treeData, fffw, mblx, variableRecord } = this.props;
    const { jsonMsg, msgKey, inputTreeType, inputTreeLength, position } = this.state;
    
    const task = fffw.filter(Item => Item === '1');
    const msg = fffw.filter(Item => Item === '2' || Item === '4');
    return (
      <Card className="m-card ant-card-padding-transition" style={{ margin: '1rem 0', height: '100%' }}>
        <Tabs defaultActiveKey="1">
          {/* <TabPane tab='消息推送规则' key='1'><MsgRule type={type} data={data} jsonMsg={jsonMsg} treeData={treeData} setJsonMsgData={this.setJsonMsgData} dictionary={dictionary} /></TabPane> */}
          {task.length > 0 ? <TabPane tab="任务分配规则" key="1"><TaskRule type={type} data={data} mblx={mblx} setJsonTaskData={this.setJsonTaskData} dictionary={dictionary} wrappedComponentRef={(c) => { this.taskRule = c; }} /></TabPane> : ''}
          {msg.length > 0 ? <TabPane tab="消息推送规则" key={task.length > 0 ? '2' : '1'} forceRender={msg.length > 0}>
            <MsgRule type={type} data={data} jsonMsg={jsonMsg} msgKey={msgKey} setRuleData={this.setRuleData} inputTreeType={inputTreeType} inputTreeLength={inputTreeLength} position={position} treeData={treeData} variableRecord={variableRecord} setJsonMsgData={this.setJsonMsgData} dictionary={dictionary} wrappedComponentRef={(c) => { this.msgRule = c; }} /></TabPane> : ''}
        </Tabs>
      </Card>
    );
  }
}

export default MotEventIndex;
