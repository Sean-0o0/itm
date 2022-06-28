import React, { Component } from 'react'
import { Row, Col, Radio, tooltip,Card } from "antd";
import echarts from 'echarts/lib/echarts';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/chart/pie';
import moment from 'moment'


// import downSrc from "../../../../../../../src/assets/go-down.svg";
// import upSrc from "../../../../../../../src/assets/go-up.svg";
import BasicDataTable from '../../../../../Common/BasicDataTable'
import { FetchQueryBusAnalFinanceSecondDril } from '../../../../../../services/planning/planning'
import BussinessIncomeStructureChart from '../BussinessIncomeStructureChart'
import BussinessIncomeChainComparison from '../BussinessIncomeChainComparison'
/*
* @Author: cyp
* @Date:  2021年5月11日09:27:50
* @Description: 财务类钻取页面
*/
export class BusinessIncomeSelected extends Component {
    constructor(props) {
        super(props)

        this.state = {
            option: {},
            upData: [],
            downData: [],
            columns: [],
            result1: [],
            result2: []
        }
    }

    componentDidMount() {
        const { indiId } = this.props
        const month = +moment().format("YYYYMM")
        FetchQueryBusAnalFinanceSecondDril({
            indiId,
            month,
            orgId: 1,
            type: 1
        }).then(res => {
            if (res.code === 1) {
                const { result } = res
                const { result1, result2 } = JSON.parse(result)
                let data = []
                result1.forEach((item, index) => {
                    data.push({
                        name: item.ORGNAME,
                        value: item.MON_RATE
                    })
                })
                const option = {
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        right: 0,
                        top: '5%',
                        itemWidth: 13,
                        icon: 'circle',
                        data,
                        tooltip: {
                            show: true
                        },
                        formatter: function (name) {
                            if (!name) return '';
                            //超出几个字符隐藏，鼠标悬浮时显示
                            if (name.length > 8) {
                                name = name.slice(0, 8) + '...';
                            }
                            return `{a|${name}  }`;
                        },
                        // formatter: function (name) {
                        //     return `{a|${name}  }`;

                        // },
                        textStyle: {
                            fontSize: 17,
                            rich: {
                                a: {
                                    color: '#999',
                                }

                            },
                        }
                    },
                    series: [
                        {
                            type: 'pie',
                            radius: ['40%', '60%'],
                            center: ['32%', '40%'],
                            color: ['#83D0EF', '#A285D2', '#46A9A8', '#FFAB67', '#C7D9FD',
                                '#5B8FF9', '#5AD8A6', '#5D7092', '#F6BD16', '#6DC8EC', '#E8684A', '#FFA8CC',
                            ],
                            name: '访问来源',
                            avoidLabelOverlap: false,
                            label: {
                                show: false,
                                position: 'center'
                            },

                            labelLine: {
                                show: false
                            },
                            icon: 'circle',
                            data,
                            itemStyle: {
                                // borderRadius: 10,
                                borderColor: '#fff',
                                borderWidth: 1
                            },
                        }
                    ]
                };
                let columns = [
                    {
                        title: '业务条线',
                        dataIndex: 'ORGNAME',
                        width: '15%',
                        align: 'center',
                    },
                    {
                        title: '当前营业收入',
                        dataIndex: 'INDI_VAL',
                        width: '15%',
                        align: 'center',

                    },
                    {
                        title: '累计营业收入',
                        dataIndex: 'TOTL_VAL',
                        width: '15%',
                        align: 'center',
                        render: (value, row, index) => {
                            return <div>{value}%</div>
                        }
                    },
                    {
                        title: '营收同比',
                        dataIndex: 'YOY_MON',
                        width: '15%',
                        align: 'center',
                        render: (value, row, index) => {
                            return (
                                <div style={{ color: +value === 0 ? '#999' : (+value > 0 ? '#EC6057' : '#45C900'), fontSize: '14px', display: 'flex', justifyContent: 'center', lineHeight: '1.333333rem', textAlign: 'center' }}>
                                    <div>{value}%</div>&nbsp;
                                    <div className={+value === 0 ? '' : (+value > 0 ? 'go-up-icon' : 'go-down-icon')}></div>
                                </div>

                            )
                        }
                    },
                ]

                //将数据的当期同比排序 获取到前五的数据 暂时没有第二级比较字段
                result1.sort((a, b) => {
                    return b.YOY_MON - a.YOY_MON
                })
                const upData = result1.slice(0, 5)
                const downData = result1.slice(-5)
                this.setState({
                    result1,
                    result2,
                    option,
                    columns,
                    upData,
                    downData
                })
            }
        })
    }


    render() {
        const { option, columns, upData, downData ,result1,result2} = this.state
        return (
            <>
                <div className='ba-body' style={{ margin: '.8rem', }}>
                    <div span={24} className='bg_whith mgb1 ' >
                        <Row className='nucleus-Index' style={{ height: '58.8rem' }}>
                            <Row className="selectedIndex">
                                <Col span={24}>
                                    <div className='basic-index-outline title'>
                                        {<div className='dp-table-title' style={{ display: 'flex', alignItems: "center", paddingLeft: '1rem' }}>
                                            <Radio.Group defaultValue="large" onChange={this.handleSizeChange}>
                                                <Radio.Button value="large">业务线</Radio.Button>
                                                <Radio.Button value="default">子公司</Radio.Button>
                                            </Radio.Group>
                                        </div>
                                        }
                                    </div>
                                </Col>

                            </Row>
                            <Row style={{height:'90%'}}>
                                <Col span={8} style={{padding:'2rem',height:'100%'}}>
                                  <Card style={{height:'100%'}} bodyStyle={{width:'100%',height:'100%',padding:'1rem'}} hoverable={true} className="grad-content3">
                                  <ReactEchartsCore
                                          echarts={echarts}
                                          style={{ height: "47rem", width: "100%" }}
                                          option={option}
                                          notMerge
                                          lazyUpdate
                                          theme="theme_name"
                                      />
                                  </Card>
                                  </Col>
                                <Col span={16} style={{padding:'2rem',height:'100%'}}>
                                  <Card style={{height:'100%'}} bodyStyle={{width:'100%',height:'100%',padding:'1rem'}} hoverable={true} className="grad-content3">
                                    <Row type='flex' justify='space-around'>
                                        <Col span={11} style={{ marginTop: '4rem' }}>
                                            <Row>
                                                <div style={{ margin: '1rem 0rem 1rem ', fontSize: '16px', color: '#333333', fontWeight: '700' }}>
                                                    同比增长前五
                                            </div>
                                            </Row>
                                            <BasicDataTable
                                                columns={columns}
                                                dataSource={upData}
                                                rowKey={item => item.id}
                                                bordered
                                                pagination={false}
                                            />
                                        </Col>
                                        <Col span={11} style={{ marginTop: '4rem' }}>
                                            <Row>
                                                <div style={{ margin: '1rem 0rem 1rem ', fontSize: '16px', color: '#333333', fontWeight: '700' }}>
                                                    同比下降前五
                                            </div>
                                            </Row>
                                            <BasicDataTable
                                                columns={columns}
                                                dataSource={downData}
                                                rowKey={item => item.id}
                                                bordered
                                                pagination={false}
                                            />
                                        </Col>
                                    </Row>
                                  </Card>
                                </Col>
                            </Row>
                        </Row>
                    </div>
                </div>

                <BussinessIncomeStructureChart  result1={result1}/>
                <BussinessIncomeChainComparison result2={result2}/>
            </>
        )
    }
}

export default BusinessIncomeSelected
