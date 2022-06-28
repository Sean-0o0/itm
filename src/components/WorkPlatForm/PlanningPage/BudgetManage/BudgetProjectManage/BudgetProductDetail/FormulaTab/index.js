import React from 'react';
import { Tabs } from 'antd';
import Define from './Define';

class FormulaTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: '1',
      personData: [], // 人员预算数据
      columns: [
      { title: '计算方式', dataIndex: 'calModeName', render: text => text || '--' },
      { title: '取值', dataIndex: 'value', width: 300, render: text => <span title={text}>{this.handleStrFormat(text, 42) || '--'}</span> },
      { title: '开始月份', dataIndex: 'beginMon', render: text => text || '--' },
      { title: '结束月份', dataIndex: 'endMon', render: text => text || '--' }],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { rightData: newData } = nextProps;
    const { rightData: oldData } = this.props;
    const { id: oldid } = oldData;
    const { id: newId } = newData;
    if (oldid !== newId) {
      this.setState({
        currentTab: '1',
        columns: [
        { title: '计算方式', dataIndex: 'calModeName', render: text => text || '--' },
        { title: '取值', dataIndex: 'value', width: 300, render: text => <span title={text}>{this.handleStrFormat(text, 42) || '--'}</span> },
        { title: '开始月份', dataIndex: 'beginMon', render: text => text || '--' },
        { title: '结束月份', dataIndex: 'endMon', render: text => text || '--' }],
      });
    }
  }

  // 限制表格内容显示长度
  handleStrFormat = (str, length) => {
    let temp = '--';
    if (str && str.length > length) {
      temp = `${str.substr(0, length - 1)}...`;
    } else {
      temp = str;
    }
    return temp;
  }


  // tab栏切换
  handleTabChange = (key) => {
    const columns = [];
    if (key === '1') {
      columns.push(
        { title: '计算方式', dataIndex: 'calModeName', render: text => text || '--' },
        { title: '取值', dataIndex: 'value', width: 300, render: text => <span title={text}>{this.handleStrFormat(text, 42) || '--'}</span> },
        { title: '开始月份', dataIndex: 'beginMon', render: text => text || '--' },
        { title: '结束月份', dataIndex: 'endMon', render: text => text || '--' },
      );
    } else if (key === '2') {
      columns.push(
        { title: '营业部', dataIndex: 'orgName', render: text => <span title={text}>{this.handleStrFormat(text, 6) || '--'}</span> },
        { title: '结算人', dataIndex: 'settPer', render: text => text || '--' },
        { title: '计算方式', dataIndex: 'calModeName', render: text => text || '--' },
        { title: '计算表达式', dataIndex: 'value', width: 300, render: text => <span title={text}>{this.handleStrFormat(text, 6) || '--'}</span> },
        { title: '套用模板', dataIndex: 'payTmplId', render: text => <span title={text}>{this.handleStrFormat(text, 6) || '--'}</span> },
        { title: '开始月份', dataIndex: 'beginMon', render: text => text || '--' },
        { title: '结束月份', dataIndex: 'endMon', render: text => text || '--' },
      );
      // this.fetchPersonnelData();
    }
    this.setState({
      currentTab: key,
      columns,
    });
  }


  render() {
    const { rightData, initialOrgid, st, version } = this.props;

    const { columns, personData = [] } = this.state;
    return (
      <Tabs
        className="m-tabs-sec ant-tabs"
        tabPosition="top"
        type="line"
        style={{ padding: '1rem 0 .5rem' }}
        // defaultActiveKey="1"
        activeKey={this.state.currentTab}
        onChange={this.handleTabChange}
      >
        <Tabs.TabPane tab="公式定义" key="1" style={{ marginTop: '.866rem' }}>
          <Define st={st} version={version} initialOrgid={initialOrgid} rightData={rightData} Seccolumns={columns} gxyybDatas={this.props.gxyybDatas} fetchLeftList={this.props.fetchLeftList} />
        </Tabs.TabPane>
      </Tabs>
    );
  }
}

export default FormulaTab;
