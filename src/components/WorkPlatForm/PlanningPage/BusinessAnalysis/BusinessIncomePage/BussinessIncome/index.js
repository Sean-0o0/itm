import React, { Component } from 'react'
import { Row, Col, Card } from 'antd';
import echarts from 'echarts/lib/echarts';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/chart/pie';
import { Link, withRouter } from "dva/router";


import BasicDataTable from '../../../../../Common/BasicDataTable'
import IncomeCard from '../../FinancialClass/SelectedIndex/IncomeCard'
/*
    经营分析-财务类-营业收入-查看明细页面
*/
export class BussinessIncomeSelected extends Component {
    constructor(props) {
        super(props)

        this.state = {
            option: {},
            columns: [],
            data: [],
            current: 1,
            title: ''
        }
    }

    componentDidMount() {
        this.fetch()
    }

    //获取数据
    fetch = () => {
        const { indiId, indexOptionArr } = this.props
        let title = '经营指标'
        indexOptionArr && indexOptionArr.forEach((item, index) => {
            if (item.INDIID === "" + indiId) {
                title = item.INDINAME
            }
        })
        let columns = [
            {
                title: '分类',
                dataIndex: 'CLASSNAME',
                width: '15%',
                align: 'center',
            },
            {
                title: '上年同期',
                dataIndex: 'LASTINDI_VAL',
                width: '15%',
                align: 'center',

            },
            {
                title: '上年同期占比',
                dataIndex: 'LAST_RATE',
                width: '15%',
                align: 'center',
                render: (value, row, index) => {
                    return <div>{value}%</div>
                }
            },
            {
                title: '当期',
                dataIndex: 'INDIVAL',
                width: '15%',
                align: 'center',

            },
            {
                title: '当期占比',
                dataIndex: 'NOW_RATE',
                width: '15%',
                align: 'center',
                render: (value, row, index) => {
                    return <div>{value}%</div>
                }
            },
            {
                title: '与上年同比增长',
                dataIndex: 'RATE_CHANGE',
                width: '15%',
                align: 'center',
                render: (value, row, index) => {
                    return (

                        <div style={{ color: Number(value) > 0 ? '#EC6057' : '#45C900', fontSize: '14px', display: 'flex', justifyContent: 'center', lineHeight: '1.333333rem', textAlign: 'center' }}>
                            <div>{value}%</div>&nbsp;
                            <div className={Number(value) > 0 ? 'go-up-icon' : 'go-down-icon'}></div>
                        </div>

                    )
                }
            },
        ]

        this.setState({ columns, title })
    }

    //表格分页切换
    handlePagerChange = (current) => {
        this.setState({
            current,
        });
    }

    // back = () => {
    //     this.props.history.goBack()
    // }

    render() {
        const { columns, current, total = 2, title } = this.state
        const { showExpenseArray = [], cardData, incomeOption, chartData } = this.props

        //console.log(showExpenseArray)
        return (
            <div className='ba-body' style={{ margin: '.8rem', }}>
                <div span={24} className='bg_whith mgb1 '>
                    <Row className='nucleus-Index'>
                        <Row className="selectedIndex">
                            <Col span={24}>
                                <div className='title'>{title}
                                    {/* 这里用的state传参   */}
                                    <Link to={{ pathname: `/esa/planning/businessAnalysis`, state: { showExpenseArray: showExpenseArray } }}><span className="showDetail">返回</span></Link>
                                </div>
                            </Col>
                            <Col span={24} style={{ height: '38rem',borderBottom: '2px solid  #F2F2F2', }}>
                                <Col span={12} style={{height: '100%'}}>
                                    <Row style={{height: '40%'}}>
                                        <Col span={24} className='bussinessAnalysis' style={{height: '100%'}}>
                                            <IncomeCard cardData={cardData} />
                                        </Col>
                                    </Row>
                                    <Row style={{height: '60%'}}>
                                      <Col span={24} style={{ padding: '0rem 2rem 2rem 2rem',height: '100%'}}>
                                        <div style={{height:'100%'}}>
                                          <Card style={{height:'100%'}} bodyStyle={{width:'100%',height:'100%',padding:'1rem'}} hoverable={true} className="grad-content3">
                                            <div style={{ fontSize: '1.5rem', color: '#333333', float: 'left' }}>{cardData.length > 0 ? cardData[0].INDINAME : ''}构成</div>
                                            {Object.keys(incomeOption).length > 0 && <ReactEchartsCore
                                              echarts={echarts}
                                              style={{ height: "25.5rem", width: "100%" }}
                                              option={incomeOption}
                                              notMerge
                                              lazyUpdate
                                              theme="theme_name"
                                            />}
                                          </Card>
                                        </div>
                                      </Col>
                                    </Row>
                                </Col>
                                <Col span={12} style={{ padding: '2rem',height: '100%'}}>
                                  {/*<Card bodyStyle={{height: '28rem',padding: '0.8rem'}} hoverable={true}>*/}
                                    <BasicDataTable
                                      columns={columns}
                                      dataSource={chartData}
                                      rowKey="name6"
                                      pagination={{
                                        paging: 1,
                                        current: current,
                                        pageSize: 5,
                                        total: total,
                                        onChange: this.handlePagerChange,
                                      }}
                                      bordered
                                      // rowClassName={this.setRowClassName}
                                      // onRow={this.onClickRow}

                                    />
                                  {/*</Card>*/}
                                </Col>
                            </Col>
                        </Row>
                    </Row>
                </div>
            </div >
        )
    }
}

export default withRouter(BussinessIncomeSelected)
