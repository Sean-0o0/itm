import {Row, Col, Table, Collapse, Empty,} from 'antd';
import React from 'react';
import OperationList from './OperationList';
const { Panel } = Collapse;
import {CaretLeftOutlined, CaretRightOutlined} from "@ant-design/icons";
class WeeklyReportTableDetail extends React.Component {
  state = {
    num:2,
    data: [
      {
        key: '1',
        name: '自营运营平台基础信息化建设',
        manage: '张三',
        planTime: '2022年6月',
        week: '1、生产问题排查和解决 2、场外期权和收益互换报表等待上游系统（根网）提供数据字段',
        plan: '1、生产问题排查和解决 2、场外期权和收益互换报表等待上游系统（根网）提供数据字段',
        month:'自营中台第一期主要对各业务数据进行整合，在自营业务快速增长阶段，通过数字化系统建设，为自营业务融合金融科技发展提质增效。9月份完成了大部分业务报表和基础数据的交付，领导者驾驶舱正在开发中。'
      },
      {
        key: '2',
        name: '自营运营平台基础信息化建设',
        manage: '李四',
        planTime: '2022年6月',
        week: '1、已完成项目开发，等待上游系统（根网）提供数据字段',
        plan: '1、等待上游系统（根网）提供数据字段以后，进行测试',
        month:''
      },
      {
        key: '3',
        name: '销交业务保证金系统',
        manage: '张三',
        planTime: '2022年6月',
        week: '提交信委会提案',
        plan: '等待信委会纪要',
        month:''
      },
      {
        key: '4',
        name: '北交股转使用费',
        manage: '张三',
        planTime: '2022年6月',
        week: '提交信委会提案',
        plan: '等待信委会纪要',
        month:''
      },
      {
        key: '5',
        name: '自营中台二期',
        manage: '李四',
        planTime: '2022年6月',
        week: '提交信委会提案',
        plan: '等待信委会纪要',
        month:''
      },
    ]
  };

  componentDidMount() {
  }

  onChange = (key) => {
    console.log(key);
  };

  renderContent = (value, row, index) => {
    const obj = {
      children: value,
      props: {},
    };
    if (index === this.state.data.length) {
      obj.props.colSpan = 0;
    }
    return obj;
  };

  fetchColumns = () => {
    const columns = [
      {
        title: '数字化建设项目',
        dataIndex: 'name',
        width:'16%',
        render: this.renderContent,
      },
      {
        title: '项目经理',
        width:'6%',
        dataIndex: 'manage',
        render: this.renderContent,
      },
      {
        title: '计划完成时间',
        width:'10%',
        dataIndex: 'planTime',
        render: this.renderContent,
      },
      {
        title: '本周总结',
        dataIndex: 'week',
        width:'16%',
        render: this.renderContent,
      },
      {
        title: '下周计划',
        dataIndex: 'plan',
        width:'16%',
        render: this.renderContent,
      },
      {
        title: '月度总结',
        colSpan: 2,
        width:'16%',
        dataIndex: 'month',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            //data.length
            obj.props.rowSpan = this.state.data.length;
          }
          if (index >= 1) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
    ];
    return columns;
  }


  render() {
    const { num,data } = this.state;
    const columns = this.fetchColumns();
    return (
      <Row style={{height:'100%'}} className="WeeklyReportSummary">
        <Col span={24} style={{height:'8%'}}>
          <OperationList/>
        </Col>
        <Col span={24} style={{height:'92%'}}>
          <div style={{margin:'1rem'}}>
            <Collapse defaultActiveKey={['1']} onChange={this.onChange}>
              <Panel header="自营业务   实现信息化、数字化、数智化三步走" key="1">
                <Table columns={columns} dataSource={data} bordered pagination={false}/>
              </Panel>
            </Collapse>
          </div>
          <div style={{margin:'1rem'}}>
            <Collapse defaultActiveKey={['1']} onChange={this.onChange}>
              <Panel header="自营业务   实现信息化、数字化、数智化三步走" key="1">
                <Table columns={columns} dataSource={data} bordered pagination={false}/>
              </Panel>
            </Collapse>
          </div>
          <div style={{margin:'1rem'}}>
            <Collapse defaultActiveKey={['1']} onChange={this.onChange}>
              <Panel header="自营业务   实现信息化、数字化、数智化三步走" key="1">
                <Table columns={columns} dataSource={data} bordered pagination={false}/>
              </Panel>
            </Collapse>
          </div>
        </Col>
      </Row>
    );
  }
}

export default WeeklyReportTableDetail;
