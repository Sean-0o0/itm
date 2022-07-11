import React from 'react';
import { Form, Card, Table, Descriptions } from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import ReactEchartsCore from 'echarts-for-react/lib/core';
class TradingUnitAssetManage extends React.Component {
  state = {
    data: [{jydy: 'JY34231', jydymc: '创富1号',xgcps: 14, xggdhs: 23}, {jydy: 'JY34231', jydymc: '创富1号',xgcps: 15, xggdhs: 23}],
    jjdydata: [{org: '销售交易部', xzjydys: 2, cb: 221}, {org: '财管部', xzjydys: 2, cb: 221}],
    paginationProps: {
      current: 1, //当前页码
      pageSize: 1, // 每页数据条数
      showQuickJumper: true,
      showSizeChanger: true,
      size: 'small',
      pageSizeOptions: ['10', '20', '30'],
      showTotal: function(total) {
        return `总共有 ${total} 条数据`;
      },
      total: 2, // 总条数
      onChange: current => this.handlePageChange(current),
      onShowSizeChange: (current, pageSize) => this.handleSizeChange(current, pageSize)
    }
  };

  handlePageChange(current, pageSize) {
  }

  // 每页条数变化
  handleSizeChange(current, pageSize) {
  }

  //闲置交易单元弹窗
  handelChangeIdleTradingUnitModelVisable = () => {
    const {changeIdleTradingUnitModelVisable} = this.props;
    changeIdleTradingUnitModelVisable(true);
  }

  //产品列表弹窗
  handelChangeProductListModelVisable = () => {
    const {changeProductListModelVisable} = this.props;
    changeProductListModelVisable(true);
  }



  render() {
    const { data,jjdydata, paginationProps } = this.state;
    const columns =[
      {
        title: '交易单元',
        align: 'left',
        width: '30%',
        dataIndex: 'jydy',
        key: 'jydy'
      },
      {
        title: '交易单元名称',
        align: 'left',
        width: '20%',
        dataIndex: 'jydymc',
        key: 'jydymc'
      },
      {
        title: '下挂产品数',
        align: 'right',
        width: '20%',
        dataIndex: 'xgcps',
        key: 'xgcps',
        render: xgcps => {
          return (<span style={{color: '#4AAFED'}} onClick={this.handelChangeProductListModelVisable}>{xgcps}</span>)
        }
      },
      {
        title: '下挂股东号数',
        align: 'right',
        width: '30%',
        dataIndex: 'xggdhs',
        key: 'xggdhs',
      }];
    const  jjdycolumns= [
      {
        title: '部门',
        align: 'left',
        width: '30%',
        dataIndex: 'org',
        key: 'org'
      },
      {
        title: '闲置交易单元数',
        align: 'right',
        width: '25%',
        dataIndex: 'xzjydys',
        key: 'xzjydys',
        render: xzjydys => {
          return (<span style={{color: '#4AAFED'}} onClick={this.handelChangeIdleTradingUnitModelVisable}>{xzjydys}</span>)
        }
      },
      {
        title: '成本',
        align: 'right',
        width: '55%',
        dataIndex: 'cb',
        key: 'cb',
      }];
    const BarOption = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        icon: 'circle',
        data: ['成本']
      },
      grid: {
        top: '15%',
        left: '0%',
        right: '0%',
        bottom: '5%',
        containLabel: true
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          data: ['第一季度', '第二季度', '第三季度', '第四季度']
        }
      ],
      color: ['#6197F2'],
      yAxis: [
        {
          type: 'value',
          name: '单位:(元)',
        }
      ],
      series: [
        {
          name: '成本',
          type: 'bar',
          barWidth : 35,
          data: [
            52.0, 34.9, 67.0, 83.2
          ]
        }
      ]
    };
    const PieOption = {
      tooltip: {
        trigger: 'item',
        position: 'right'
      },
      color: ['#6197F2', '#F9C852'],
      legend: {
        orient: 'vertical',
        top: 'bottom',
        icon: 'circle',
        formatter(name) {
          return name + "：100";
        }
      },
      series: [
        {
          center: ['50%', '40%'],
          label: {
            normal: {
              show: false,
            },
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          name: '季度成本占比',
          type: 'pie',
          radius: '65%',
          data: [
            { value: 1048, name: '定向资产管理' },
            { value: 735, name: '集合资产管理' },
          ]
        }
      ]
    };

    const LineBarOption = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        icon: 'circle',
        data: ['交易单元数', '分摊成本']
      },
      grid: {
        top: '15%',
        left: '0%',
        right: '0%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['销售一部', '私募托管部','自营分公司','销售二部','信托托管部', '销售三部曲']
        }
      ],
      color: ['#6197F2', '#F9C852'],
      yAxis: [
        {
          type: 'value',
          name: '单位:(元)',
        }
      ],
      series: [
        {
          name: '交易单元数',
          type: 'bar',
          barWidth : 35,
          data: [
            52.0, 34.9, 67.0, 52.0, 34.9, 67.0
          ]
        },
        {
          name: '分摊成本',
          type: 'line',
          data: [
            32.0, 54.9, 27.0,32.0, 54.9, 27.0
          ]
        }
      ]
    };


    const LineOption = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        icon: 'circle',
        data: ['上交所', '深交所', '北交所'],
        left: '30%'
      },
      grid: {
        top: '15%',
        left: '0%',
        right: '0%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['第一季度', '第二季度', '第三季度', '第四季度']
        }
      ],
      color: ['#6197F2', '#F9C852', '#E0755F'],
      yAxis: [
        {
          type: 'value',
          name: '单位:(元)',
        }
      ],
      series: [
        {
          name: '上交所',
          type: 'line',
          data: [
            52.0, 34.9, 67.0, 83.2
          ]
        },
        {
          name: '深交所',
          type: 'line',
          data: [
            32.0, 54.9, 27.0, 43.2
          ]
        },
        {
          name: '北交所',
          type: 'line',
          data: [
            12.0, 74.9, 47.0, 43.2
          ]
        }
      ]
    };


    const jdcscbqsLineOption = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        icon: 'circle',
        data: ['单个交易单元平均创收', '平均成本'],
        left: '20%'
      },
      grid: {
        top: '15%',
        left: '0%',
        right: '0%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['第一季度', '第二季度', '第三季度', '第四季度']
        }
      ],
      color: ['#6197F2', '#F9C852'],
      yAxis: [
        {
          type: 'value',
          name: '单位:(元)',
        }
      ],
      series: [
        {
          name: '单个交易单元平均创收',
          type: 'line',
          data: [
            52.0, 34.9, 67.0, 83.2
          ]
        },
        {
          name: '平均成本',
          type: 'line',
          data: [
            32.0, 54.9, 27.0, 43.2
          ]
        }
      ]
    };



    return (
      <React.Fragment>
        <div className="asset-manage-table">
          <Card title="下挂产品统计" style={{ width: '100%' }}>
            <Table dataSource={data} columns={columns} pagination={paginationProps}/>
          </Card>
        </div>

        <div className="self-run-table">
          <Card title="交易单元闲置信息统计" style={{ width: '100%' }}>
            <Table dataSource={jjdydata} columns={jjdycolumns} pagination={paginationProps}/>
          </Card>
        </div>

        <div className="asset-manage-chart">
          <div style={{ marginRight: '2rem', width: '94%'}}>
            <Card title="季度成本占比" style={{ width: '100%' }}>
              <div style={{height: '40rem'}}>
                <React.Fragment>
                  <ReactEchartsCore
                    echarts={echarts}
                    option={PieOption}
                    notMerge
                    lazyUpdate
                    style={{ height: '100%', width: '100%' }}
                    theme=""
                  />
                </React.Fragment>
              </div>

            </Card>
          </div>
          <div style={{ marginRight: '2rem', width: '94%'}}>
            <Card title="最近一年季度趋势" style={{ width: '100%' }}>
              <div style={{height: '40rem'}}>
                <React.Fragment>
                  <ReactEchartsCore
                    echarts={echarts}
                    option={BarOption}
                    notMerge
                    lazyUpdate
                    style={{ height: '100%', width: '100%' }}
                    theme=""
                  />
                </React.Fragment>
              </div>

            </Card>
          </div>
          <div className="chart-right" style={{ width: '94%'}}>
            <Card title="交易成本趋势" style={{ width: '100%' }}>
              <div style={{height: '40rem'}}>
                <React.Fragment>
                  <ReactEchartsCore
                    echarts={echarts}
                    option={LineOption}
                    notMerge
                    lazyUpdate
                    style={{ height: '100%', width: '100%' }}
                    theme=""
                  />
                </React.Fragment>
              </div>

            </Card>
          </div>
        </div>


        <div className="asset-manage-chart">
          <div style={{ marginRight: '2rem', width: '67%'}}>
            <Card title="最近三年交易单元收益统计" style={{ width: '100%' }}>
              <div style={{height: '40rem', width: '100%'}}>
                <div className="jydysy">
                  <div className="jydysy-row" style={{padding:'3rem 0 0 1rem', width: '40%', background: '#FAFAFA'}}>
                   总佣金（万元）
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'3rem', textAlign: 'center', width: '20%'}}>
                    2019年
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'3rem', textAlign: 'center', width: '20%'}}>
                    2020年
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'3rem', textAlign: 'center', width: '20%'}}>
                    2021年
                  </div>
                </div>
                <div className="jydysy">
                  <div className="jydysy-row" style={{padding:'3rem 0 0 1rem', width: '40%', background: '#FAFAFA'}}>
                    交易单元数
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'3rem', textAlign: 'center', width: '20%'}}>
                    500
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'3rem', textAlign: 'center', width: '20%'}}>
                    500
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'3rem', textAlign: 'center', width: '20%'}}>
                    500
                  </div>
                </div>
                <div className="jydysy">
                  <div className="jydysy-row" style={{padding:'3rem 0 0 1rem', width: '40%', background: '#FAFAFA'}}>
                    平均交易成本
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'3rem', textAlign: 'center', width: '20%'}}>
                    30000000
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'3rem', textAlign: 'center', width: '20%'}}>
                    30000000
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'3rem', textAlign: 'center', width: '20%'}}>
                    30000000
                  </div>
                </div>
                <div className="jydysy">
                  <div className="jydysy-row" style={{padding:'3rem 0 0 1rem', width: '40%', background: '#FAFAFA'}}>
                    成本总额
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'3rem', textAlign: 'center', width: '20%'}}>
                    30000000
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'3rem', textAlign: 'center', width: '20%'}}>
                    30000000
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'3rem', textAlign: 'center', width: '20%'}}>
                    30000000
                  </div>
                </div>
              </div>

            </Card>
          </div>
          <div style={{width: '33%'}}>
            <Card title="单一交易单元季度创收成本趋势" style={{ width: '100%' }}>
              <div style={{height: '40rem'}}>
                <React.Fragment>
                  <ReactEchartsCore
                    echarts={echarts}
                    option={jdcscbqsLineOption}
                    notMerge
                    lazyUpdate
                    style={{ height: '100%', width: '100%' }}
                    theme=""
                  />
                </React.Fragment>
              </div>

            </Card>
          </div>
        </div>


        <div className="asset-manage-chart">
          <div style={{ marginRight: '2rem', width: '100%'}}>
            <Card title="前10成本分摊部门（202112-2022）" style={{ width: '100%' }}>
              <div style={{height: '40rem'}}>
                <React.Fragment>
                  <ReactEchartsCore
                    echarts={echarts}
                    option={LineBarOption}
                    notMerge
                    lazyUpdate
                    style={{ height: '100%', width: '100%' }}
                    theme=""
                  />
                </React.Fragment>
              </div>

            </Card>
          </div>
        </div>

      </React.Fragment>

    );
  }
}

export default Form.create()(TradingUnitAssetManage);
