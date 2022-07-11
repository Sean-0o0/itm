import React from 'react';
import TradingUnitSelfRun from '../TradingUnitSelfRun';
import TradingUnitAssetManage from '../TradingUnitAssetManage';
import TradingUnitRental from '../TradingUnitRental';
import TradingUnitEconomy from '../TradingUnitEconomy';
import { Form, Row, Col, Button, Icon, Select, DatePicker, Card, Table, Tabs } from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import CooperateInstitutions from '../CooperateInstitutions/index';
import IdleTradingUnit from '../IdleTradingUnit/index';
import ProductList from '../ProductList/index';
import ModifyTradingUnit from '../ModifyTradingUnit/index';
import ReactEchartsCore from 'echarts-for-react/lib/core';
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
class TradingUnitStatus extends React.Component {
  state = {
    //合作机构数弹窗
    institutionsVisable: false,
    //闲置交易单元弹窗
    idleTradingUnitVisable: false,
    //产品列表弹窗
    productListVisable: false,
    //创赢vip交易单元弹窗
    modifyTradingUnitVisable: false,
    jytjData: [{ org: '信托一部', jydys: 12, jyj: 5000, jyjtbl: 13.31, cb: 5000, cbzzl: -25 }],
    zttjData: [{ type: '自营类', jydys: 12, jyj: 5000, jyjtbl: 13.31, cb: 5000, cbzzl: -25 }],
    jysData: [{ jys: '上海', jydys: 12, jyj: 5000, jyjtbl: 13.31, cb: 5000, cbzzl: -25 }],
    columns: [
      {
        title: '交易单元数',
        align: 'right',
        dataIndex: 'jydys',
        key: 'jydys'
      },
      {
        title: '净佣金',
        align: 'right',
        dataIndex: 'jyj',
        key: 'jyj',
      },
      {
        title: '净佣金同比例',
        align: 'right',
        dataIndex: 'jyjtbl',
        key: 'jyjtbl',
        render: jyjtbl => {
          if (jyjtbl > 0) {
            return (<span style={{ color: 'red' }}>+{jyjtbl}%</span>)
          } else if (jyjtbl < 0) {
            return (<span style={{ color: 'green' }}>-{jyjtbl}%</span>)
          } else {
            return (<span>{jyjtbl}%</span>)
          }
        }
      },
      {
        title: '成本',
        align: 'right',
        dataIndex: 'cb',
        key: 'cb',
      },
      {
        title: '成本增长率',
        align: 'right',
        dataIndex: 'cbzzl',
        key: 'cbzzl',
        render: cbzzl => {
          if (cbzzl > 0) {
            return (<span style={{ color: 'red', paddingRight: '3rem' }}>+{cbzzl}%</span>)
          } else if (cbzzl < 0) {
            return (<span style={{ color: 'green', paddingRight: '3rem' }}>{cbzzl}%</span>)
          } else {
            return (<span style={{ paddingRight: '3rem' }}>{cbzzl}%</span>)
          }
        }
      }
    ],
    tabKey: "1"
  };

  changeTab(e) {
    this.setState({ tabKey: e });
  }

  changeInstitutionsModelVisable = (e) =>{
    this.setState({
      institutionsVisable: e,
    })
  }

  changeIdleTradingUnitModelVisable = (e) =>{
    this.setState({
      idleTradingUnitVisable: e,
    })
  }

  changeProductListModelVisable = (e) =>{
    this.setState({
      productListVisable: e,
    })
  }


  changeModifyTradingModelVisable = (e) =>{
    this.setState({
      modifyTradingUnitVisable: e,
    })
  }



  render() {
    const { jytjData, columns, zttjData, jysData, tabKey,institutionsVisable,idleTradingUnitVisable,productListVisable,modifyTradingUnitVisable } = this.state;
    const option = {
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
      calculable: true,
      xAxis: [
        {
          type: 'category',
          // prettier-ignore
          data: ['销售一部', '信托托管部', '自营分公司', '私募托管部', '销售二部', '私募托管部', '销售三部曲']
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
          barGap: 0,
          barWidth: 35,
          data: [
            52.0, 34.9, 67.0, 83.2, 45.6, 76.7, 135.6
          ]
        },
        {
          name: '分摊成本',
          type: 'bar',
          barGap: 0.02,
          barWidth: 35,
          data: [
            62.6, 45.9, 79.0, 96.4, 58.7, 70.7, 175.6
          ]
        }
      ]
    };
    const jytjColumn = [{
      title: '部门',
      dataIndex: 'org',
      key: 'org',
    }, ...columns];
    const zttjColumn = [{
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    }, ...columns];
    const jysColumn = [{
      title: '交易所',
      dataIndex: 'jys',
      key: 'jys',
    }, ...columns];
    return (
      <React.Fragment>
        <div className='tradingunitanylyze-top'>
          <Row gutter={24} type="flex" justify="space-around">
            <Col span={5}>
              <div className="col">
                <div className="col-num" style={{ color: '#4AAFED' }}>200</div>
                <div className="col-name">交易单元分类总数</div>
              </div>
            </Col>
            <Col span={5}>
              <div className="col">
                <div className="col-num" style={{ color: '#333333' }}>100</div>
                <div className="col-name">自营类</div>
              </div>
            </Col>
            <Col span={5}>
              <div className="col">
                <div className="col-num" style={{ color: '#333333' }}>50</div>
                <div className="col-name">经济类</div>
              </div>
            </Col>
            <Col span={5}>
              <div className="col">
                <div className="col-num" style={{ color: '#333333' }}>100</div>
                <div className="col-name">资管类</div>
              </div>
            </Col>
            <Col span={4}>
              <div className="col" style={{ borderRight: '0px' }}>
                <div className="col-num" style={{ color: '#333333' }}>50</div>
                <div className="col-name">出租类</div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="tradingunitanylyze-card">
          <Card title="前10成本分摊部门（20211112-20220122）" style={{ width: '100%' }}>
            <div style={{ height: '50rem' }}>
              <React.Fragment>
                <ReactEchartsCore
                  echarts={echarts}
                  option={option}
                  notMerge
                  lazyUpdate
                  style={{ height: '100%', width: '100%' }}
                  theme=""
                />
              </React.Fragment>
            </div>

          </Card>
        </div>

        <div className="tradingunitanylyze-card">
          <Card title="交易单元交易统计" style={{ width: '100%' }}>
            <Form className="ant-advanced-search-form">
              <Row gutter={24}>
                <Col span={6}>
                  <Form.Item label="统计方式">
                    <Select defaultValue="按月" placeholder="请选择">
                      <Select.Option value="按月">按月</Select.Option>
                      <Select.Option value="按年">按年</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="月份">
                    <RangePicker />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Button style={{ float: 'right', marginTop: '1.5rem', marginLeft: '1rem' }}  >
                    重置
                  </Button>
                  <Button className='m-btn-radius m-btn-headColor' style={{ float: 'right', marginTop: '1.5rem' }} type="primary" >
                    查询
                  </Button>
                </Col>
              </Row>
            </Form>

            <Table dataSource={jytjData} columns={jytjColumn} pagination={false} />

          </Card>
        </div>

        <div className="tradingunitanylyze-card">
          <Card title="交易单元整体统计" style={{ width: '100%' }}>
            <Form className="ant-advanced-search-form">
              <Row gutter={24}>
                <Col span={6}>
                  <Form.Item label="统计方式">
                    <Select defaultValue="按月" placeholder="请选择">
                      <Select.Option value="按月">按月</Select.Option>
                      <Select.Option value="按年">按年</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="月份">
                    <RangePicker />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Button style={{ float: 'right', marginTop: '1.5rem', marginLeft: '1rem' }}  >
                    重置
                  </Button>
                  <Button className='m-btn-radius m-btn-headColor' style={{ float: 'right', marginTop: '1.5rem' }} type="primary" >
                    查询
                  </Button>
                </Col>
              </Row>
            </Form>

            <Table dataSource={zttjData} columns={zttjColumn} pagination={false} />

          </Card>
        </div>


        <div className="tradingunitanylyze-card">
          <Card title="交易所分布" style={{ width: '100%' }}>
            <Form className="ant-advanced-search-form">
              <Row gutter={24}>
                <Col span={6}>
                  <Form.Item label="统计方式">
                    <Select defaultValue="按月" placeholder="请选择">
                      <Select.Option value="按月">按月</Select.Option>
                      <Select.Option value="按年">按年</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="月份">
                    <RangePicker />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Button style={{ float: 'right', marginTop: '1.5rem', marginLeft: '1rem' }}  >
                    重置
                  </Button>
                  <Button className='m-btn-radius m-btn-headColor' style={{ float: 'right', marginTop: '1.5rem' }} type="primary" >
                    查询
                  </Button>
                </Col>
              </Row>
            </Form>

            <Table dataSource={jysData} columns={jysColumn} pagination={false} />

          </Card>
        </div>

        <div className="tradingunitanylyze-tab">
          <Tabs defaultActiveKey="1" onChange={this.changeTab.bind(this)}>
            <TabPane tab="经济类" key="1" />
            <TabPane tab="出租类" key="2" />
            <TabPane tab="资管类" key="3" />
            <TabPane tab="自营类" key="4" />
          </Tabs>
        </div>

        <div className='tradingunitanylyze-top'>
          <Row gutter={24} type="flex" justify="space-around">
            <Col span={8}>
              <div className="col">
                <div className="col-num" style={{ color: '#4AAFED' }}>600</div>
                <div className="col-name">交易单元数</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="col">
                <div className="col-num" style={{ color: '#333333' }}>456</div>
                <div className="col-name">低效使用数</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="col" style={{ borderRight: '0px' }}>
                <div className="col-num" style={{ color: '#333333' }}>145</div>
                <div className="col-name">无效使用数</div>
              </div>
            </Col>
          </Row>
        </div>
        {
          tabKey === "1" && <TradingUnitEconomy changeIdleTradingUnitModelVisable={this.changeIdleTradingUnitModelVisable} changeProductListModelVisable={this.changeProductListModelVisable} changeModifyTradingModelVisable={this.changeModifyTradingModelVisable}/>
        }
        {
          tabKey === "2" && <TradingUnitRental changeIdleTradingUnitModelVisable={this.changeIdleTradingUnitModelVisable}/>
        }
        {
          tabKey === "3" && <TradingUnitAssetManage changeIdleTradingUnitModelVisable={this.changeIdleTradingUnitModelVisable} changeProductListModelVisable={this.changeProductListModelVisable}/>
        }
        {
          tabKey === "4" && <TradingUnitSelfRun changeIdleTradingUnitModelVisable={this.changeIdleTradingUnitModelVisable}/>
        }

        {/* 合作机构数弹窗 */}
        <CooperateInstitutions visable={institutionsVisable} callBack = {this.changeInstitutionsModelVisable}/>
        {/* 闲置交易单元数弹窗 */}
        <IdleTradingUnit visable={idleTradingUnitVisable} callBack = {this.changeIdleTradingUnitModelVisable}/>
        {/* 产品列表弹窗 */}
        <ProductList visable={productListVisable} callBack = {this.changeProductListModelVisable}/>
        {/* 创赢VIP交易单元修改弹窗 */}
        <ModifyTradingUnit visable={modifyTradingUnitVisable} callBack = {this.changeModifyTradingModelVisable}/>


      </React.Fragment>

    );
  }
}

export default Form.create()(TradingUnitStatus);
