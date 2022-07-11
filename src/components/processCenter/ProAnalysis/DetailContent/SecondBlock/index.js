import React, { Fragment } from 'react';
import { Row, Col, Table, Form } from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/custom';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import ReactEchartsCore from 'echarts-for-react/lib/core';

class SecondBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      visible: false,
      data: '',
      blx: '1',
      lsjbList: [],
      lsjb: 0,
    };
  }
  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };
  fetchColums = () => {
    const columns = [
      {
        title: '流程名称',
        dataIndex: 'wfName',
        key: 'wfName',
        textAlign: 'left',
        width: '10%',
      },
      {
        title: '版本',
        dataIndex: 'version',
        key: 'version',
        textAlign: 'left',
        width: '10%',
      },
      {
        title: '总耗时（分钟）',
        dataIndex: 'elapsed',
        key: 'elapsed',
        textAlign: 'left',
        width: '15%',
      },
      {
        title: '平均耗时（分钟）',
        dataIndex: 'avgElapsed',
        key: 'avgElapsed',
        textAlign: 'left',
        width: '20%',
      },
      {
        title: '最大耗时（分钟）',
        dataIndex: 'maxElapsed',
        key: 'maxElapsed',
        textAlign: 'left',
        width: '20%',
        className:'colum-color',
      },
      {
        title: '最小耗时（分钟）',
        dataIndex: 'minElapsed',
        key: 'minElapsed',
        textAlign: 'left',
        width: '10%',
      },
      {
        title: '开始浏览时间',
        dataIndex: 'startTime',
        key: 'startTime',
        textAlign: 'left',
        width: '10%',
      },
      {
        title: '最近浏览IP',
        dataIndex: 'lastIP',
        key: 'lastIP',
        textAlign: 'left',
        width: '10%',
      },
      {
        title: '最近浏览用户',
        dataIndex: 'lastUID',
        key: 'lastUID',
        textAlign: 'left',
        width: '10%',
      },
      {
        title: '最近执行时间',
        dataIndex: 'lastTime',
        key: 'lastTime',
        textAlign: 'left',
        width: '10%',
      },
      {
        title: '实例',
        dataIndex: 'instances',
        key: 'instances',
        textAlign: 'left',
        width: '10%',
      },
      {
        title: '创建',
        dataIndex: 'createds',
        key: 'createds',
        textAlign: 'left',
        width: '10%',
      },
      {
        title: '挂起',
        dataIndex: 'suspendeds',
        key: 'suspendeds',
        textAlign: 'left',
        width: '10%',
      },
      {
        title: '停止',
        dataIndex: 'killeds',
        key: 'killeds',
        textAlign: 'left',
        width: '10%',
      },
      {
        title: '结束',
        dataIndex: 'completeds',
        key: 'completeds',
        textAlign: 'left',
        width: '10%',
      },
      {
        title: '活动',
        dataIndex: 'activateds',
        key: 'activateds',
        textAlign: 'left',
        width: '10%',
      },
      {
        title: '未知',
        dataIndex: 'unknowns',
        key: 'unknowns',
        textAlign: 'left',
        width: '10%',
      },
    ];
    return columns;
  }

  fetchProColums = () => {
    const columns = [
      {
        title: '步骤',
        dataIndex: 'stepName',
        key: 'wfName',
        textAlign: 'left',
        width: '10%',
      },
      {
        title: '操作',
        dataIndex: 'actionName',
        key: 'version',
        textAlign: 'left',
        width: '10%',
      },
      {
        title: '总耗时（分钟）',
        dataIndex: 'elapsed',
        key: 'elapsed',
        textAlign: 'left',
        width: '15%',
      },
      {
        title: '平均耗时（分钟）',
        dataIndex: 'avgElapsed',
        key: 'avgElapsed',
        textAlign: 'left',
        width: '20%',
      },
      {
        title: '最大耗时（分钟）',
        dataIndex: 'maxElapsed',
        key: 'maxElapsed',
        textAlign: 'left',
        width: '20%',
        className:'colum-color',
      },
      {
        title: '最小耗时（分钟）',
        dataIndex: 'minElapsed',
        key: 'minElapsed',
        textAlign: 'left',
        width: '10%',
      },
    ];
    return columns;
  }

  render() {
    const {maxElaAnalysis= [], showProcess=false} = this.props;
    const colums = showProcess?this.fetchProColums():this.fetchColums();
    let xAxisName = showProcess?maxElaAnalysis.map(m => `${m.stepName}`):maxElaAnalysis.map(m => `${m.wfName}`);
    let xAxisData = maxElaAnalysis.map(m => `${m.maxElapsed}`);
    const option = {
      yAxis: {
        type: 'category',
        inverse: true,//倒叙
        data: xAxisName.length>10?xAxisName.slice(0,10):xAxisName,
        axisLabel:{
          // interval:0,
          // rotate:30,//倾斜度 -90 至 90 默认为0
          margin:2,
          textStyle:{
            color:"rgba(0, 0, 0, 0.45)"
          }
        },
        axisTick: {
          show: false
        },
        axisLine:{
          lineStyle: {
            type: 'solid',
            color:'rgba(0, 0, 0, 0.15)',
          }
        },
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        axisLine:{
          show:false
        },
        axisTick: {
          show: false
        }
      },
      series: [
        {
          data: xAxisData.length>10?xAxisData.slice(0,10):xAxisData,
          type: 'bar',
          barCategoryGap:'50%',
          itemStyle: {
            normal: {
              label: {
                show: true, //开启显示
                position: 'right', //在上方显示
                textStyle: { //数值样式
                  color: 'black',
                  fontSize: 10
                }
              }
            }
          },
        }
      ],
      color:"#54A9DF",
      grid:{//直角坐标系内绘图网格
        left:"18%",//grid 组件离容器左侧的距离。
        right:"30px",
        bottom:"20%" //
      },
    };
    return (
      <Fragment>
        <Row style={{ paddingBottom: 20 }}>
          <div className="factor-content-title"><div className="tip"></div>最大耗时分析</div>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div className="factor-item">
              <Table
                className="factor-table"
                //rowSelection={type ? '' : rowSelection}
                style={{ minWidth: '300px', marginRight: '2.6rem' }}
                columns={colums}
                dataSource={maxElaAnalysis}
                //pagination={false}
                size="middle "
                bordered={false}
              />
            </div>
          </Col>
        </Row>

        <ReactEchartsCore
            echarts={echarts}
            option={option}
            notMerge
            lazyUpdate
            style={{ height: '100%' }}
            theme=""
        />
      </Fragment>
    );
  }
}
export default Form.create()(SecondBlock);
