import React from 'react';
import { Form, Card, Table, Icon, Row, Col, Input, Button } from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import ReactEchartsCore from 'echarts-for-react/lib/core';
class TradingUnitEconomy extends React.Component {
  state = {
    data: [{jydyh: 28511, jysc: "上交所", jydysx: "普通一对一", jydyzt: "已启用", zjzh:2300034, khmc: "林**", fgsmc: "福州分公司", yybmc: "湖东路营业部", xyksrq: "2014-03-18"}],
    qjgData: [{gmjjglrmc: '博导基金管理有限公司', ybbcps: '2'}],
    xzxxData: [{org: '销售交易部', xzjydys: 2, cb: 221}, {org: '财管部', xzjydys: 2, cb: 221}],
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
  //创赢修改弹窗
  handelChangeModifyTradingModelVisable = () => {
    const {changeModifyTradingModelVisable} = this.props;
    changeModifyTradingModelVisable(true);
  }



  render() {
    const { data, paginationProps, qjgData, xzxxData } = this.state;
    const  columns= [
      {
        title: '',
        align: 'left',
        key: 'edit',
        width: '30px',
        render: (text, record) => {
          return (<Icon type="form" style={{color: '#4AAFED'}} onClick={this.handelChangeModifyTradingModelVisable}/>);
        }
      },
      {
        title: '交易单元号',
        align: 'left',
        dataIndex: 'jydyh',
        key: 'jydyh'
      },
      {
        title: '交易市场',
        align: 'left',
        dataIndex: 'jysc',
        key: 'jysc'
      },
      {
        title: '交易单元属性',
        align: 'left',
        dataIndex: 'jydysx',
        key: 'jydysx'
      },
      {
        title: '交易单元状态',
        align: 'left',
        dataIndex: 'jydyzt',
        key: 'jydyzt'
      },
      {
        title: '资金账户',
        align: 'left',
        dataIndex: 'zjzh',
        key: 'zjzh'
      },
      {
        title: '客户名称',
        align: 'left',
        dataIndex: 'khmc',
        key: 'khmc'
      },
      {
        title: '分公司名称',
        align: 'left',
        dataIndex: 'fgsmc',
        key: 'fgsmc'
      },
      {
        title: '营业部名称',
        align: 'left',
        dataIndex: 'yybmc',
        key: 'yybmc'
      },{
        title: '协议开始日期',
        align: 'left',
        dataIndex: 'xyksrq',
        key: 'xyksrq'
      }];
    const qjgCoulumns= [
      {
        title: '公募基金管理人名称',
        align: 'left',
        width: '30%',
        dataIndex: 'gmjjglrmc',
        key: 'gmjjglrmc'
      },
      {
        title: '已报备产品数',
        align: 'right',
        width: '25%',
        dataIndex: 'ybbcps',
        key: 'ybbcps',
        render: ybbcps => {
          return (<span style={{color: '#4AAFED'}} onClick={this.handelChangeProductListModelVisable}>{ybbcps}</span>)
        }
      }, {
        title: '',
        align: 'left',
        width: '45%',
      }];
    const xzxxColumns= [
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
      color: ['#6197F2', '#F9C852', '#E0755F', '#83D0EF'],
      // legend: [{
      //   orient: 'horizontal',
      //   top: 'bottom',
      //   icon: 'circle',
      //   formatter(name) {
      //     return name + "：100";
      //   }
      // }],
      legend: [{
        orient: 'vertical',
        top: 'bottom',
        left: '0%',
        data: ['集中交易/创赢VIP', 'QFII'],
        icon: 'circle',
        formatter(name) {
          return name + "：100";
        }
      },{
        orient: 'vertical',
        left: '50%',
        top: 'bottom',
        data: ['融资融券', '公募基金券商结算模式'],
        icon: 'circle',
        formatter(name) {
          return name + "：100";
        }
      }],
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
            { value: 1048, name: '集中交易/创赢VIP' },
            { value: 735, name: '融资融券' },
            { value: 235, name: 'QFII' },
            { value: 435, name: '公募基金券商结算模式' },
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
          <Card title="创赢VIP交易单元" style={{ width: '100%' }}>
            <Table dataSource={data} columns={columns} pagination={paginationProps}/>
          </Card>
        </div>

        <div className="tradingunitanylyze-card">
          <Card title="券结机构报备信息查询结果" style={{ width: '100%' }}>
            <Form className="ant-advanced-search-form">
              <Row gutter={24}>
                <Col span={6}>
                  <Form.Item label="已报备机构">
                    <Input placeholder="请输入" />
                  </Form.Item>
                </Col>
                <Col span={18}>
                  <Button style={{ float: 'right', marginTop: '1.5rem', marginLeft: '1rem' }}  >
                    重置
                  </Button>
                  <Button className='m-btn-radius m-btn-headColor' style={{ float: 'right', marginTop: '1.5rem' }} type="primary" >
                    查询
                  </Button>
                </Col>
              </Row>
            </Form>

            <Table dataSource={qjgData} columns={qjgCoulumns} pagination={false} />

          </Card>
        </div>


        <div className="self-run-table">
          <Card title="交易单元闲置信息统计" style={{ width: '100%' }}>
            <Table dataSource={xzxxData} columns={xzxxColumns} pagination={paginationProps}/>
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
                <div className="jydysy" style={{height: '14%'}}>
                  <div className="jydysy-row" style={{padding:'1rem 0 0 1rem', width: '40%', background: '#FAFAFA'}}>
                    总佣金（万元）
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'1rem', textAlign: 'center', width: '20%'}}>
                    2019年
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'1rem', textAlign: 'center', width: '20%'}}>
                    2020年
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'1rem', textAlign: 'center', width: '20%'}}>
                    2021年
                  </div>
                </div>
                <div className="jydysy" style={{height: '14%'}}>
                  <div className="jydysy-row" style={{padding:'1rem 0 0 1rem', width: '40%', background: '#FAFAFA'}}>
                    交易单元数
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'1rem', textAlign: 'center', width: '20%'}}>
                    500
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'1rem', textAlign: 'center', width: '20%'}}>
                    500
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'1rem', textAlign: 'center', width: '20%'}}>
                    500
                  </div>
                </div>
                <div className="jydysy" style={{height: '14%'}}>
                  <div className="jydysy-row" style={{padding:'1rem 0 0 1rem', width: '40%', background: '#FAFAFA'}}>
                    佣金总额
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'1rem', textAlign: 'center', width: '20%'}}>
                    30000000
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'1rem', textAlign: 'center', width: '20%'}}>
                    30000000
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'1rem', textAlign: 'center', width: '20%'}}>
                    30000000
                  </div>
                </div>
                <div className="jydysy" style={{height: '14%'}}>
                  <div className="jydysy-row" style={{padding:'1rem 0 0 1rem', width: '40%', background: '#FAFAFA'}}>
                    平均交易单元佣金
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'1rem', textAlign: 'center', width: '20%'}}>
                    500
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'1rem', textAlign: 'center', width: '20%'}}>
                    500
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'1rem', textAlign: 'center', width: '20%'}}>
                    500
                  </div>
                </div>
                <div className="jydysy" style={{height: '14%'}}>
                  <div className="jydysy-row" style={{padding:'1rem 0 0 1rem', width: '40%', background: '#FAFAFA'}}>
                    平均交易单元佣金增长率
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'1rem',color: 'red', textAlign: 'center', width: '20%'}}>
                    +13.2%
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'1rem',color: 'green', textAlign: 'center', width: '20%'}}>
                    -12.3%
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'1rem',color:'red', textAlign: 'center', width: '20%'}}>
                    +5%
                  </div>
                </div>
                <div className="jydysy" style={{height: '14%'}}>
                  <div className="jydysy-row" style={{padding:'1rem 0 0 1rem', width: '40%', background: '#FAFAFA'}}>
                    成本总额
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'1rem', textAlign: 'center', width: '20%'}}>
                    30000000
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'1rem', textAlign: 'center', width: '20%'}}>
                    30000000
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'1rem', textAlign: 'center', width: '20%'}}>
                    30000000
                  </div>
                </div>
                <div className="jydysy" style={{height: '14%'}}>
                  <div className="jydysy-row" style={{padding:'1rem 0 0 1rem', width: '40%', background: '#FAFAFA'}}>
                    平均交易成本
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'1rem', textAlign: 'center', width: '20%'}}>
                    30000000
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'1rem', textAlign: 'center', width: '20%'}}>
                    30000000
                  </div>
                  <div className="jydysy-row" style={{paddingTop:'1rem', textAlign: 'center', width: '20%'}}>
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

export default Form.create()(TradingUnitEconomy);
