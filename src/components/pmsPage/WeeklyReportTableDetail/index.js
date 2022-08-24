import {Row, Col, Table, Collapse, Empty, Button,} from 'antd';
import React from 'react';
import OperationList from './OperationList';
const { Panel } = Collapse;
import {CaretLeftOutlined, CaretRightOutlined} from "@ant-design/icons";
import BasicIndexTable from "../../Common/BasicIndexTable";
class WeeklyReportTableDetail extends React.Component {
  state = {
    num:2,
    data: [
      {
        module: '零售专班',
        name: '汇金谷APP',
        manage: '张三',
        year: '【持续迭代】以"内容-工具-体验-品牌"为核心，通过APP建设迭代，包含直播、短视频、虚拟人、全局改版、运营活动、交易工具优化等，向客户提供全维度零售精细化服务',
        planTime: '2022年12月',
        plan1: '进行中',
        plan2: '45%',
        status: '低风险',
        remark: '9月份完成了大部分业务报表和基础数据的交付，领导者驾驶舱正在开发中。',
        operation: [1, 2],
      },
      {
        module: '零售专班',
        name: '展业宝APP',
        manage: '张三',
        year: '【持续迭代】以"内容-工具-体验-品牌"为核心，通过APP建设迭代，包含直播、短视频、虚拟人、全局改版、运营活动、交易工具优化等，向客户提供全维度零售精细化服务',
        planTime: '2022年12月',
        plan1: '进行中',
        plan2: '45%',
        status: '低风险',
        remark: '9月份完成了大部分业务报表和基础数据的交付，领导者驾驶舱正在开发中。',
        operation: [1, 2],
      },
      {
        module: '零售专班',
        name: '理财商城项目',
        manage: '张张三',
        year: '【持续迭代】以"内容-工具-体验-品牌"为核心，通过APP建设迭代，包含直播、短视频、虚拟人、全局改版、运营活动、交易工具优化等，向客户提供全维度零售精细化服务',
        planTime: '2022年12月',
        plan1: '进行中',
        plan2: '45%',
        status: '低风险',
        remark: '9月份完成了大部分业务报表和基础数据的交付，领导者驾驶舱正在开发中。',
        operation: '',
      },
      {
        module: '零售专班',
        name: '产品中心项目',
        year: '【持续迭代】以"内容-工具-体验-品牌"为核心，通过APP建设迭代，包含直播、短视频、虚拟人、全局改版、运营活动、交易工具优化等，向客户提供全维度零售精细化服务',
        planTime: '2022年12月',
        plan1: '进行中',
        plan2: '45%',
        status: '低风险',
        remark: '9月份完成了大部分业务报表和基础数据的交付，领导者驾驶舱正在开发中。',
        operation: '',
      },
      {
        module: '零售专班',
        name: '网厅项目',
        year: '【持续迭代】以"内容-工具-体验-品牌"为核心，通过APP建设迭代，包含直播、短视频、虚拟人、全局改版、运营活动、交易工具优化等，向客户提供全维度零售精细化服务',
        planTime: '2022年12月',
        plan1: '进行中',
        plan2: '45%',
        status: '低风险',
        remark: '9月份完成了大部分业务报表和基础数据的交付，领导者驾驶舱正在开发中。',
        operation: '',
      },
      {
        module: '投资专班',
        name: '自营信用模块开发',
        year: '【持续迭代】以"内容-工具-体验-品牌"为核心，通过APP建设迭代，包含直播、短视频、虚拟人、全局改版、运营活动、交易工具优化等，向客户提供全维度零售精细化服务',
        planTime: '2022年12月',
        plan1: '进行中',
        plan2: '45%',
        status: '低风险',
        remark: '9月份完成了大部分业务报表和基础数据的交付，领导者驾驶舱正在开发中。',
        operation: '',
      },
      {
        module: '投资专班',
        name: '自营绩效管理二期',
        year: '【持续迭代】以"内容-工具-体验-品牌"为核心，通过APP建设迭代，包含直播、短视频、虚拟人、全局改版、运营活动、交易工具优化等，向客户提供全维度零售精细化服务',
        planTime: '2022年12月',
        plan1: '进行中',
        plan2: '45%',
        status: '低风险',
        remark: '9月份完成了大部分业务报表和基础数据的交付，领导者驾驶舱正在开发中。',
        operation: '',
      },
      {
        module: '投资专班',
        name: '自营中台数据集市迭代',
        year: '【持续迭代】以"内容-工具-体验-品牌"为核心，通过APP建设迭代，包含直播、短视频、虚拟人、全局改版、运营活动、交易工具优化等，向客户提供全维度零售精细化服务',
        planTime: '2022年12月',
        plan1: '进行中',
        plan2: '45%',
        status: '低风险',
        remark: '9月份完成了大部分业务报表和基础数据的交付，领导者驾驶舱正在开发中。',
        operation: '',
      },
      {
        module: '机构专班',
        name: '特定股份管理平台',
        year: '【持续迭代】以"内容-工具-体验-品牌"为核心，通过APP建设迭代，包含直播、短视频、虚拟人、全局改版、运营活动、交易工具优化等，向客户提供全维度零售精细化服务',
        planTime: '2022年12月',
        plan1: '进行中',
        plan2: '45%',
        status: '低风险',
        remark: '9月份完成了大部分业务报表和基础数据的交付，领导者驾驶舱正在开发中。',
        operation: '',
      },
    ]
  };

  componentDidMount() {
  }

  onChange = (key) => {
    console.log(key);
  };

  fetchColumns = () => {
    const columns = [
      {
        columnName: '指标类别',
        colSpan: 1,
        dataIndex: 'module',
        type: '1',
        width: '7%',
        columnAlign: 'center',
      },
      {
        columnName: '系统建设',
        dataIndex: 'name',
        colSpan: 1,
        type: '1',
        width: '7%',
        columnAlign: 'center',
      },
      {
        columnName: '负责人',
        dataIndex: 'manage',
        colSpan: 1,
        type: '1',
        width: '6%',
        columnAlign: 'center',
      },
      {
        columnName: '年度规划',
        dataIndex: 'year',
        colSpan: 1,
        type: '1',
        // width:'40%',
        columnAlign: 'center',
      },
      {
        columnName: '完成时间',
        dataIndex: 'planTime',
        colSpan: 1,
        type: '1',
        width: '9%',
        columnAlign: 'center',
      },
      {
        columnName: '当前进展',
        dataIndex: 'plan1',
        colSpan: 1,
        type: '1',
        width: '6%',
        columnAlign: 'center',
      },
      {
        columnName: '当前进度',
        dataIndex: 'plan2',
        colSpan: 1,
        type: '1',
        width: '4%',
        columnAlign: 'center',
      },
      {
        columnName: '当前状态',
        dataIndex: 'status',
        width: '6%',
        colSpan: 1,
        type: '1',
        columnAlign: 'center',
      },
      {
        columnName: '风险说明',
        dataIndex: 'remark',
        colSpan: 1,
        type: '1',
        columnAlign: 'center',
      },
      // {
      //   columnName: '操作',
      //   dataIndex: 'operation',
      //   colSpan: 1,
      //   render: (text, row, index) => {
      //     let node;
      //     node =text === '1' &&<div>
      //       <Button size="small" >修改</Button>
      //       <Button size="small" >删除</Button>}
      //     </div>
      //     return node
      //   },
      // },
    ];
    return columns;
  }


  render() {
    const {data = []} = this.state;
    return (
      <Row style={{height:'100%'}} className="WeeklyReportSummary">
        <Col span={24} style={{height:'8%'}}>
          <OperationList/>
        </Col>
        <Col span={24} style={{height:'92%'}}>
          <div style={{margin:'1rem'}}>
            <Collapse defaultActiveKey={['1']} onChange={this.onChange}>
              {/*<Panel header="自营业务   实现信息化、数字化、数智化三步走" key="1">*/}
              <BasicIndexTable
                data={data}
                column={this.fetchColumns()}
                bordered={true}
                sortColumn={1}
                operation={true}
                onRef={(ref) => this.child1 = ref}
              />
              {/*</Panel>*/}
            </Collapse>
          </div>
          {/*<div style={{margin:'1rem'}}>*/}
          {/*  <Collapse defaultActiveKey={['1']} onChange={this.onChange}>*/}
          {/*    <Panel header="自营业务   实现信息化、数字化、数智化三步走" key="1">*/}
          {/*      /!*<Table columns={columns} dataSource={data} bordered pagination={false}/>*!/*/}
          {/*    </Panel>*/}
          {/*  </Collapse>*/}
          {/*</div>*/}
          {/*<div style={{margin:'1rem'}}>*/}
          {/*  <Collapse defaultActiveKey={['1']} onChange={this.onChange}>*/}
          {/*    <Panel header="自营业务   实现信息化、数字化、数智化三步走" key="1">*/}
          {/*      /!*<Table columns={columns} dataSource={data} bordered pagination={false}/>*!/*/}
          {/*    </Panel>*/}
          {/*  </Collapse>*/}
          {/*</div>*/}
        </Col>
      </Row>
    );
  }
}

export default WeeklyReportTableDetail;
