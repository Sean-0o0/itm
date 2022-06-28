import React from 'react';
import moment from 'moment';
import { Card, DatePicker, Col, Row, Select, Table } from 'antd'
import { parseNumbers } from 'xml2js/lib/processors';

import AssessmentTrackingChart from '../AssessmentTrackingChart'
import { FetchQueryTrackIndiOrg, FetchQueryOrgList, FetchQueryTrackIndiFirst, FetchQueryTrackIndiSecond, FetchQueryTrackIndiThird } from '../../../../../services/planning/planning'

const { MonthPicker } = DatePicker;
class AssessmentTracking extends React.Component {
    state = {
        orgList: [],//下拉框数据
        orgName: '',
        orgId: 1,
        column: [],
        data: [],
        option1: [],    //折线图1数据
        option2: [],    //折线图2数据
        option3: [],    //折线图3数据
        headParam1: {},   //折线图1头数据
        headParam2: {},   //折线图2头数据
        headParam3: {},   //折线图3头数据
        headName1: '',
        headName2: '',
        headName3: '',
        mom: 202101,          //当前页面数据月份

    };
    componentDidMount() {

        //创建当前月份信息
        const date = new Date()
        let month = 0;
        if (Number(date.getMonth === 0)) {
            month = "0" + (Number(date.getMonth()) + 1)
        }
        if (Number(date.getMonth()) < 10) {
            month = "0" + (Number(date.getMonth()))
        } else {
            month = (Number(date.getMonth()))
        }
        this.setState({
            mom: '' + date.getFullYear() + month
        }, () => {
            this.fetch()
        })
    }
    fetchTableData = (orgId, mom) => {
        FetchQueryTrackIndiOrg(
            {
                "orgid": orgId,
                "mon": mom
            }
        ).then((ret) => {

            this.setState({
                data: ret.records,
            })
        })
    }

    fetch = () => {
        let { orgId = 1 } = this.state
        const { mom, } = this.state
        const params = {
            "orgid": 1,
            "mon": mom
        }
        //获取下拉框数据
        FetchQueryOrgList({
            "current": 1,
            "pageSize": 1000,
            "paging": 1,
            "planType": 2,//业务条线
            "sort": "",
            "total": -1
        }).then((res) => {
            if (res.code === 1) {
                this.setState({
                    orgList: res.records,
                    orgId: res.records[0].orgId,
                }, () => {
                    orgId = res.records[0].orgId
                    //获取表数据
                    this.fetchTableData(orgId, mom)
                })
            }
        })

        //获取图1数据
        FetchQueryTrackIndiFirst(
            params
        ).then(ret => {
            let titleArray = [];
            let firstSeries = [];
            let secondSeries = [];
            //处理图表数据
            ret.records.forEach((ele, index) => {
                for (let item in ele) {
                    if (item === 'mon') {
                        titleArray.push(ele[item].substring(4))
                    }
                    if (item === 'indval') {
                        firstSeries.push(ele[item])
                    }
                    if (item === 'totlVal') {
                        secondSeries.push(ele[item])
                    }
                }
            });
            const option1 = {
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    //X轴坐标不一定是12个月 到时候根据接口返回值确定X轴坐标
                    data: titleArray,
                    axisLabel: {
                        interval: 0
                    },
                },
                yAxis: {
                    type: 'value',
                    axisTick: { //y轴刻度线
                        show: true
                    },
                    axisLine: { //y轴
                        //show: false,
                        lineStyle: {
                            type: 'dashed' //设置网格线类型 dotted：虚线 solid:实线

                        },
                    },

                },
                series: [
                    {
                        name: '累计完成',
                        type: 'line',
                        //stack: '总量',
                        data: secondSeries,
                        itemStyle: {
                            normal: {
                                color: '#00B2EE', //改变折线点的颜色
                                lineStyle: {
                                    color: '#00B2EE' //改变折线颜色
                                }
                            }
                        },
                        smooth: true
                    },
                    {
                        name: '当月完成',
                        type: 'line',
                        //stack: '总量',
                        data: firstSeries,
                        itemStyle: {
                            normal: {
                                color: 'red', //改变折线点的颜色
                                lineStyle: {
                                    color: 'red' //改变折线颜色
                                }
                            }
                        },
                        smooth: true
                    },
                ]
            }

            const str = ret.note.replace(/\"/g, "")
            const temArray = str.split(',')
            let headParam1 = {};
            let headName1 = '';
            temArray.forEach((item, index) => {
                const temObj = item.split(':')
                const tit = temObj[0]
                if (tit === 'IDX_NAME') {
                    headName1 = temObj[1]
                } else {
                    const val = temObj[1]

                    headParam1[tit] = val
                }
            })

            this.setState({
                option1: option1,
                headName1: headName1,
                headParam1: headParam1,
            })
        })
        //获取图2数据
        FetchQueryTrackIndiSecond(params).then(ret => {
            let titleArray = [];
            let firstSeries = [];
            let secondSeries = [];
            ret.records.forEach((ele, index) => {
                for (let item in ele) {
                    if (item === 'mon') {
                        titleArray.push(ele[item].substring(4))
                    }
                    if (item === 'indval') {
                        firstSeries.push(ele[item])
                    }
                    if (item === 'totlVal') {
                        secondSeries.push(ele[item])
                    }
                }
            });
            const option2 = {
                // title: {
                //     text: '投资银行目标完成进度',
                //     align: 'left',
                //     // // textStyle: {
                //     // //     fontWeight: 'normal',
                //     // //     color: '#fff',
                //     // // }
                //     textStyle: {
                //         // color: '#0DB9F2', //颜色
                //         // fontStyle: 'normal', //风格
                //         // fontWeight: 'normal', //粗细
                //         // fontFamily: 'Microsoft yahei', //字体
                //         //fontSize: 14, //大小
                //     }
                //     // },
                // },
                tooltip: {
                    trigger: 'axis'
                },
                // legend: {
                //     data: ['净收入', '净利率'],
                //     //align: 'center', //水平方向位置
                //     orient: 'vertical',  //垂直显示
                //     y: 'top',    //延Y轴居中
                //     x: 'right', //居右显示
                //     padding: [10, 10, 0, 0] //[（上），（右）、（下）、（左）]

                // },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    // feature: {
                    //     saveAsImage: {}
                    // }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    //X轴坐标不一定是12个月 到时候根据接口返回值确定X轴坐标
                    data: titleArray,
                    axisLabel: {
                        interval: 0
                    },
                },
                yAxis: {
                    type: 'value',
                    // axisLabel: {
                    //     formatter: function () {
                    //         return "";
                    //     }
                    // },
                    axisTick: { //y轴刻度线
                        show: true
                    },
                    axisLine: { //y轴
                        //show: false,
                        lineStyle: {
                            type: 'dashed' //设置网格线类型 dotted：虚线 solid:实线

                        },
                    },

                },
                series: [
                    {
                        name: '累计完成',
                        type: 'line',
                        //stack: '总量',
                        data: secondSeries,
                        itemStyle: {
                            normal: {
                                color: '#00B2EE', //改变折线点的颜色
                                lineStyle: {
                                    color: '#00B2EE' //改变折线颜色
                                }
                            }
                        },
                        smooth: true,
                    },
                    {
                        name: '当月完成',
                        type: 'line',
                        //stack: '总量',
                        data: firstSeries,
                        itemStyle: {
                            normal: {
                                color: 'red', //改变折线点的颜色
                                lineStyle: {
                                    color: 'red' //改变折线颜色
                                }
                            }
                        },
                        smooth: true,
                    },
                ]
            }

            const str = ret.note.replace(/\"/g, "")
            const temArray = str.split(',')
            let headParam2 = {};
            let headName2 = '';
            temArray.forEach((item, index) => {
                const temObj = item.split(':')
                const tit = temObj[0]
                if (tit === 'IDX_NAME') {
                    headName2 = temObj[1]
                } else {
                    const val = temObj[1]

                    headParam2[tit] = val
                }
            })
            this.setState({
                option2: option2,
                headName2: headName2,
                headParam2: headParam2,
            })
        })
        //获取图3数据
        FetchQueryTrackIndiThird(params).then(ret => {
            let titleArray = [];
            let firstSeries = [];
            let secondSeries = [];
            ret.records.forEach((ele, index) => {
                for (let item in ele) {
                    if (item === 'mon') {
                        titleArray.push(ele[item].substring(4))
                    }
                    if (item === 'indval') {
                        firstSeries.push(ele[item])
                    }
                    if (item === 'totlVal') {
                        secondSeries.push(ele[item])
                    }
                }
            });
            const option3 = {
                // title: {
                //     text: '投资银行目标完成进度',
                //     align: 'left',
                //     // // textStyle: {
                //     // //     fontWeight: 'normal',
                //     // //     color: '#fff',
                //     // // }
                //     textStyle: {
                //         // color: '#0DB9F2', //颜色
                //         // fontStyle: 'normal', //风格
                //         // fontWeight: 'normal', //粗细
                //         // fontFamily: 'Microsoft yahei', //字体
                //         //fontSize: 14, //大小
                //     }
                //     // },
                // },
                tooltip: {
                    trigger: 'axis'
                },
                // legend: {
                //     data: ['净收入', '净利率'],
                //     //align: 'center', //水平方向位置
                //     orient: 'vertical',  //垂直显示
                //     y: 'top',    //延Y轴居中
                //     x: 'right', //居右显示
                //     padding: [10, 10, 0, 0] //[（上），（右）、（下）、（左）]

                // },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    // feature: {
                    //     saveAsImage: {}
                    // }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    //X轴坐标不一定是12个月 到时候根据接口返回值确定X轴坐标
                    data: titleArray,
                    axisLabel: {
                        interval: 0
                    },
                },
                yAxis: {
                    type: 'value',
                    // axisLabel: {
                    //     formatter: function () {
                    //         return "";
                    //     }
                    // },
                    axisTick: { //y轴刻度线
                        show: true
                    },
                    axisLine: { //y轴
                        //show: false,
                        lineStyle: {
                            type: 'dashed' //设置网格线类型 dotted：虚线 solid:实线

                        },
                    },

                },
                series: [
                    {
                        name: '累计完成',
                        type: 'line',
                        // stack: '总量',
                        data: secondSeries,
                        itemStyle: {
                            normal: {
                                color: '#00B2EE', //改变折线点的颜色
                                lineStyle: {
                                    color: '#00B2EE' //改变折线颜色
                                }
                            }
                        },
                        smooth: true,
                    },
                    {
                        name: '当月完成',
                        type: 'line',
                        //stack: '总量',
                        data: firstSeries,
                        itemStyle: {
                            normal: {
                                color: 'red', //改变折线点的颜色
                                lineStyle: {
                                    color: 'red' //改变折线颜色
                                }
                            }
                        },
                        smooth: true,
                    },
                ]
            }

            const str = ret.note.replace(/\"/g, "")
            const temArray = str.split(',')
            let headParam3 = {};
            let headName3 = '';
            temArray.forEach((item, index) => {
                const temObj = item.split(':')
                const tit = temObj[0]
                if (tit === 'IDX_NAME') {
                    headName3 = temObj[1]
                } else {
                    const val = temObj[1]

                    headParam3[tit] = val
                }
            })
            this.setState({
                option3: option3,
                headName3: headName3,
                headParam3: headParam3,
            })
        })

    }
    handleSelectChange = (value) => {
        const { mom } = this.state
        this.setState({
            orgId: value,
            //orgDefaultValue:value
        }, () => {
            this.fetchTableData(value, mom)
        })
    }

    hangdleChangeDate = (date, dateString) => {
        let date1 = ("" + dateString).replace('-', '')
        this.setState({
            mom: parseNumbers(date1)
        }, () => {
            this.fetch()
        })
    }


    render() {
        const { orgId, data, orgList = [], option1, option2, option3, headParam1, headParam2, headParam3, headName1, headName2, headName3 } = this.state
        const column = [
            // breakGoal: "100"
            // compSeched: ""
            // idxId: "1"
            // idxName: "营业部收入(万元)"
            // indval: "40"
            // remark: ""
            // totlVal: "60"
            {
                title: '指标名称',
                colSpan: 1,
                dataIndex: 'idxName',
                key: 'idxName',
                type: '1',
                width: '10%',
                align: 'center'
            },
            {
                title:  '年度分解指标',
                colSpan: 1,
                dataIndex: 'breakGoal',
                key: 'breakGoal',
                type: '1',
                width: '15%',
                align: 'center'
            },
            {
                title:  '当月达成',
                colSpan: 1,
                dataIndex:  'indval',
                key: 'indval',
                type: '1',
                width: '15%',
                align: 'center'
            },
            {
                title:  '累计达成',
                colSpan: 1,
                dataIndex: 'totlVal',
                type: '1',
                width: '15%',
                align: 'center'
            },
            {
                title:  '达成进度',
                colSpan: 1,
                dataIndex: 'compSeched',
                type: '1',
                align: 'center'
            },
            {
                title:  '备注',
                colSpan: 1,
                dataIndex: 'remark',
                type: '1',
                align: 'center'
            },

        ]
        //["202101", "202102", "202103"] (3) ["30", "10", "10"] (3) ["30", "40", "10"]
        return (
            <div style={{ background: '#ECECEC', padding: '30px' }}>
                <Row style={{ marginBottom: '1rem' }}>
                    <div style={{ backgroundColor: 'white', marginTop: "1rem", lineHeight: '5rem', height: '5rem' }} >
                        <span style={{ fontWeight: 'bold', marginLeft: '1rem', marginRight: '1rem', fontSize: '1.666rem' }}>公司整体情况</span>
                        <MonthPicker defaultValue={moment(new Date()).subtract(1, 'months')} onChange={this.hangdleChangeDate} />
                        {/* <div style={{ display: 'inline' }}>年度:&nbsp;&nbsp;<span>2021</span></div> */}
                    </div>
                </Row>
                { option3.length !== 0 && headName2 !== '' &&
                    <Row gutter={16}>
                        <Col span={8}>
                            <Card title={<div style={{ fontWeight: 'bold', textAlign: 'center' }}>{headName1}</div>} bordered={false} >
                                <AssessmentTrackingChart
                                    haedParam={headParam1}
                                    option={option1}
                                    divId={'div2'}
                                    width={'100%'}
                                    height={300}
                                    span={24}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title={<div style={{ fontWeight: 'bold', textAlign: 'center' }}>{headName2}</div>}
                                bordered={false}>
                                <AssessmentTrackingChart
                                    haedParam={headParam2}
                                    option={option2}
                                    divId={'div2'}
                                    width={'100%'}
                                    height={300}
                                    span={24}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title={<div style={{ fontWeight: 'bold', textAlign: 'center' }}>{headName3}</div>} bordered={false}>
                                <AssessmentTrackingChart
                                    haedParam={headParam3}
                                    option={option3}
                                    divId={'div2'}
                                    width={'100%'}
                                    height={300}
                                    span={24}
                                />
                            </Card>
                        </Col>
                    </Row>}
                <Row style={{ marginBottom: '1rem' }}>
                    <div style={{ backgroundColor: 'white', marginTop: "1rem", lineHeight: '2rem', height: '5rem' }} >
                        <div style={{ display: 'inline-block', fontSize: '1.333rem', fontWeight: '700', marginLeft: '1rem' }}> 业务条线：</div>
                        <Select value={orgId}
                            style={{ width: '20rem', marginTop: '1rem', marginLeft: '1rem' }}
                            onChange={this.handleSelectChange}
                            showSearch
                            filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {orgList.map((item, index) => {
                                return <Select.Option key={item.orgId} value={item.orgId} >{item.orgName}</Select.Option>;
                            })}
                        </Select>
                        {/* <div style={{ display: 'inline' }}>年度:&nbsp;&nbsp;<span>2021</span></div> */}
                    </div>
                </Row>
                <Row >
                    <div style={{ padding: '25px 25px', backgroundColor: 'white' }}>
                        <Table
                            dataSource={data}
                            columns={column}
                            rowKey={record => record.idxId}
                            bordered={true}
                        />
                    </div>
                </Row>
            </div>
        );
    }
}
export default AssessmentTracking;
