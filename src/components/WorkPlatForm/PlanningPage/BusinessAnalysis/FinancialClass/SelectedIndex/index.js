import React, { Component } from 'react';
import { Row, Col, Select,Card } from 'antd';
import echarts from 'echarts/lib/echarts';
import { Link } from "dva/router";
import ReactEchartsCore from 'echarts-for-react/lib/core';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/chart/pie';
import { EncryptBase64 } from "../../../../../../components/Common/Encrypt";
import moment from 'moment'

import BasicDataTable from '../../../../../Common/BasicDataTable'
import downSrc from "../../../../../../../src/assets/go-down.svg";
import upSrc from "../../../../../../../src/assets/go-up.svg";
import { IncomeCard } from "./IncomeCard";
import { FetchQueryBusAnalFinanceSecond, FetchQueryFinanceIndexAnalysis } from '../../../../../../services/planning/planning'
class SelectedIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            indexOptionArr: ['营业收入', '指标分析'],
            incomeOption: {},
            columns: [],
            data: [],
            showExpense: true,
            current: 1,
            indexDetailArray: [],//指标详情下拉框
            chartData: [],
            cardData: [],
            month: moment().format('YYYYMM'),
            indiId: 0
        };
    }

    toggleContent = (e) => {
        let { changeExpenseArray, showExpenseArray } = this.props;
        changeExpenseArray(1, !showExpenseArray[1])
    }

    fetch = (indiId, month) => {
        FetchQueryBusAnalFinanceSecond(
            {
                indiId,
                month,
                orgId: 1
            }
        ).then(res => {
            if (res.code === 1) {
                const { result } = res
                const { result1, result2 } = JSON.parse(result)
                let data = []
                result2.forEach(ele => {
                    data.push({ name: ele.CLASSNAME, value: ele.NOW_RATE })
                });
                let incomeOption = {
                    tooltip: {
                        trigger: 'item'
                    },
                    series: [
                        {
                            type: 'pie',
                            radius: '55%',
                            center: ['25%', '50%'],
                            color: ['#5B8FF9', '#5AD8A6', '#5D7092', '#F6BD16', '#E8684A', '#6DC8EC'],
                            data,
                            itemStyle: {
                                // borderRadius: 10,
                                borderColor: '#fff',
                                borderWidth: 1
                            },
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            },
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },

                        }

                    ],
                    legend: {
                        orient: 'vertical',
                        right: 0,
                        top: '20%',
                        itemWidth: 13,
                        icon: 'circle',
                        data,
                        formatter: function (name) {
                            // 获取legend显示内容
                            let optionValueArray = incomeOption.series[0].data
                            let rate = 0
                            optionValueArray.forEach((item) => {
                                if (item.name === name) {
                                    rate = item.value
                                }
                            })
                            if (Number(rate) < 0) {
                                return `{a|${name} |} {b| ${rate}%}{c|}`;
                            } else if (Number(rate) > 0) {
                                return `{a|${name} |} {b| ${rate}%}{d|}`;
                            }

                            //return <span style={{ color: '#000' }}>{name} | <span style={{ color: '#333' }}></span>100/{rate}%</span>;
                        },
                        textStyle: {
                            fontSize: 17,
                            rich: {
                                a: {
                                    color: '#999',
                                },
                                b: {
                                    color: '#333',
                                },
                                c: {
                                    backgroundColor: {
                                        image: downSrc
                                        // 这里可以是图片的 URL，
                                        // 或者图片的 dataURI，
                                        // 或者 HTMLImageElement 对象，
                                        // 或者 HTMLCanvasElement 对象。
                                    }
                                },
                                d: {
                                    backgroundColor: {
                                        image: upSrc
                                        // 这里可以是图片的 URL，
                                        // 或者图片的 dataURI，
                                        // 或者 HTMLImageElement 对象，
                                        // 或者 HTMLCanvasElement 对象。
                                    }
                                }
                            },

                        }
                    }
                };

                this.setState({
                    cardData: result1,
                    chartData: result2,
                    incomeOption,
                    indiId
                })
            }
        })
    }
    componentDidMount() {
        const { month } = this.state
        FetchQueryFinanceIndexAnalysis({
            type: 1
        }).then(res => {
            if (res.code === 1) {
                const { result } = res
                const indexOptionArr = JSON.parse(result)['data']
                if (indexOptionArr.length > 0) {
                    this.setState({
                        indexOptionArr
                    }, this.fetch(+indexOptionArr[0].INDIID, month))
                }
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

        this.setState({ columns })
    }

    handlePagerChange = (current) => {
        this.setState({
            current,
        });
    }

    handleChange = (indiId) => {
        const { month } = this.state
        this.fetch(indiId, month)
    }
    render() {
        const { showExpenseArray } = this.props
        const { indexOptionArr, incomeOption, columns, current, total = 2, cardData = [], indiId, chartData } = this.state
        const showExpense = showExpenseArray[1]
        return (
            <Row className="selectedIndex">
                <Col span={24}>
                    <div className='basic-index-outline title'>
                        {<div className='dp-table-title' style={{ display: 'flex', alignItems: "center"}}>
                            指标分析
                            <div onClick={() => { this.toggleContent() }}>
                                {showExpense ?
                                    <i className="iconfont iconfont icon-down-solid-arrow" style={{ cursor: 'pointer', fontSize: '1.3rem' }} /> :
                                    <i className="iconfont icon-right-solid-arrow" style={{ cursor: 'pointer', fontSize: '1.3rem' }} />
                                }
                            </div>
                        </div>}
                    </div>
                </Col>
                <Col span={24} style={{ display: showExpense ? 'block' : 'none' }}>
                    <div className="title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '1.3rem'}}>指标：
                            <Select style={{ width: '15rem', fontSize: '1.3rem'}} defaultValue={indexOptionArr[0]} onChange={this.handleChange}>
                                {/* <Select.Option value="0">**部门</Select.Option> */}
                                {indexOptionArr && indexOptionArr.map((item, index) => {
                                    return <Select.Option key={index.INDIID} value={item.INDIID} style={{fontSize: '1.2rem'}} >{item.INDINAME}</Select.Option>;
                                })}
                            </Select>
                        </span>
                        <Link to={`/esa/planning/businessIncome/${EncryptBase64(JSON.stringify(showExpenseArray))}&&${EncryptBase64(JSON.stringify(cardData))}&&${EncryptBase64(JSON.stringify(incomeOption))}&&${EncryptBase64(JSON.stringify(chartData))}&&${EncryptBase64(indiId)}&&${EncryptBase64(JSON.stringify(indexOptionArr))}`
                        }><span className="showDetail" style={{fontSize: '1.3rem'}}>查看明细</span></Link>
                    </div>
                </Col>
                <Col span={24} style={{ height: '38rem', borderBottom: '2px solid  #F2F2F2', display: showExpense ? 'block' : 'none' }}>
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
        );
    }
}

export default SelectedIndex;
