import React from 'react';
import { Link } from 'dva/router';
// import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import 'echarts/lib/component/tooltip';
import 'echarts-liquidfill/src/liquidFill.js';  // eslint-disable-line
import { Row, Col, Card } from 'antd';
// import { FetchQueryBaseDblcs } from '../../../services/largescreen';

class Liquidfill extends React.Component {
    state = {
        typeToShowLiquidFillDesc: '',
    }
    componentDidMount() {
        this.props.dispatch({
            type: 'homePage/getLiquidfillDatas',
        });
        // this.fetchQuerySyTzgg();
    }
    // fetchQuerySyTzgg = () => {
    //     FetchQueryBaseDblcs({
    //         current: 1,
    //         keyword: "",
    //         pageSize: 10,
    //         paging: 1,
    //         sort: "",
    //         total: -1
    //     }).then((result = {}) => {
    //         const { code = 0, records = [] } = result;
    //         if (code > 0) {
    //             // this.setState({
    //             //     userNoticeList: records,
    //             // });
    //         }
    //     }).catch((error) => {
    //         message.error(!error.success ? error.message : error.note);
    //     });
    // }

    getCharts = (datas, key) => {
        const { zs, wcs, type, name, data } = datas;
        const wcbl = Number.parseInt(wcs)<=0?0:((Number.parseInt(zs)/Number.parseInt(wcs))*100).toFixed(2);
        // tooltip提示语
        let tooltipText;
        // 链接url
        let linkUrl;
        switch (type) {
            case 'MOT': tooltipText = `待办事项/总事项数 ${zs || 0}/${wcs || 0}`; linkUrl = '/UIProcessor?Table=WORKFLOW_TOTASKS&hideTitlebar=true';
                break;
            /* case 'qzyw': tooltipText = `待开发/总客户数 ${barwcs || 0}/${zs || 0}`; linkUrl = '/customerDevelop/addOn';
              break; */
            case 'dbrw': tooltipText = `待办任务/总任务数 ${zs || 0}/${wcs || 0}`; linkUrl = '';
                break;
            default: tooltipText = ''; linkUrl = '';
                break;
        }
        const colors = {
            MOT: 'rgb(45, 170, 228)',
            dbrw: 'rgb(253, 129, 131)',
        };
        const colorsBack = {
            MOT: 'rgba(45, 170, 228, 0.5)',
            dbrw: 'rgba(253, 129, 131, 0.5)',
        };
        // 构造echarts水球图
        const option = {
            series: [{
                type: 'liquidFill',
                backgroundStyle: {
                    color: '#eeeeee',
                    shadowColor: 'rgba(0, 0, 0, 0)',
                    shadowBlur: 0,
                },
                data: [{
                    value: Number.parseFloat(wcbl) / 100,
                    itemStyle: {
                        shadowColor: 'rgba(0, 0, 0, 0)',
                        shadowBlur: 0,
                    },
                }, {
                    value: Number.parseFloat(wcbl) / 100,
                    direction: 'left',
                    itemStyle: {
                        shadowColor: 'rgba(0, 0, 0, 0)',
                        shadowBlur: 0,
                        color: colorsBack[type],
                    },
                }],
                radius: '80%',
                color: [colors[type]],
                outline: {
                    show: false,
                },
                label: {
                    show: false,
                },
            },
            {
                type: 'pie',
                radius: ['90%', '100%'],
                avoidLabelOverlap: false,
                clockwise: false,
                hoverOffset: 0,
                label: {
                    normal: {
                        show: false,
                        position: 'center',
                    },
                    emphasis: {
                        show: false,
                    },
                },
                labelLine: {
                    normal: {
                        show: false,
                    },
                },
                data: [
                    {
                        value: wcbl,
                        name: '已完成',
                        itemStyle: {
                            color: colors[type],
                        },
                    },
                    {
                        value: 100 - wcbl,
                        name: '未完成',
                        itemStyle: {
                            color: '#e5e8eb',
                        },
                    },
                ],
            },
            ],
        };
        // 构造进度条
        const barData = [];
        if (data) {
            data.forEach((element) => {
                const tempData = {};
                tempData.name = element.name;
                tempData.data = [element.data];
                tempData.type = 'bar';
                tempData.stack = '总量';
                barData.push(tempData);
            });
        }
        const progressBarOption = {
            color: [[colors[type]], '#e5e8eb'],
            // color: (type === 'MOT' || type === 'wfwkh') ? [[colors[type]], '#e5e8eb'] : ['#29a9e6', '#ffc36d', '#ff6976', '#e5e8eb'],
            grid: {
                left: 0,
                right: 0,
                bottom: 0,
                containLabel: false,
                width: '100%',
                height: '100%',
            },
            xAxis: {
                type: 'value',
                show: false,
            },
            yAxis: {
                show: false,
                type: 'category',
                data: ['百分比'],
            },
            series: barData.length > 0 ? barData : [{
                name: '当日完成',
                type: 'bar',
                stack: '总量',
                data: [Number.parseFloat(wcbl)],
                legendHoverLink: false,
                itemStyle: {
                    shadowBlur: 0,
                    shadowColor: 'rgba(0,0,0,0)',
                },
            },
            {
                name: '当日总数',
                type: 'bar',
                legendHoverLink: false,
                stack: '总量',
                data: [100 - Number.parseFloat(wcbl)],
                emphasis: {
                    itemStyle: {
                        color: '#e5e8eb',
                    },
                },
                itemStyle: {
                    shadowBlur: 0,
                    shadowColor: 'rgba(0,0,0,0)',
                },
            }],
        };
        const { typeToShowLiquidFillDesc } = this.state;
        return (
            <Col xs={24} sm={24} lg={24} xl={24} key={key}>
                <Link to={linkUrl}>
                    <Card className="m-card" >
                        <div
                            className="m-chartCard"
                            style={{ borderRight: type === 'MOT' ? 0 : '', marginRight: '1rem', cursor: 'default' }}
                            tabIndex="-1"
                            typetoshow={type}
                            onMouseEnter={this.handleLiquidFillDivMouseEnter}
                            onMouseLeave={this.handleLiquidFillDivMouseLeave}
                        >
                            <div className="m-chartLeft" style={{ background: '#fff' }}>
                                <ReactEchartsCore
                                    echarts={echarts}
                                    style={{ height: '10rem', width: '10rem' }}
                                    option={option}
                                    notMerge
                                    lazyUpdate
                                    theme="theme_name"
                                />
                            </div>
                            <div className="m-chartRight" style={{ paddingTop: '1.5rem', width: '10rem' }}>
                                <span style={{ fontSize: '4rem' }}>{this.handleRightNum(wcs)}</span>
                            </div>
                            <div className="m-chartCenter">
                                <span>{name}</span>
                                <div className="m-contentFixed">
                                    <ReactEchartsCore
                                        echarts={echarts}
                                        style={{ height: '0.75rem', width: '100%' }}
                                        option={progressBarOption}
                                        notMerge
                                        lazyUpdate
                                        theme="theme_name"
                                    />
                                </div>
                            </div>
                            <div className="m-chartCard-rose" style={{ display: typeToShowLiquidFillDesc === type ? 'block' : 'none', marginLeft: '-15rem' }}>
                                <div className="m-chartCard-roseMain">
                                    <span>{tooltipText}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Link>
            </Col>
        );
    };
    handleLiquidFillDivMouseEnter = (e) => {
        const typeToShow = e.currentTarget.getAttribute('typetoshow');
        this.setState({
            typeToShowLiquidFillDesc: typeToShow,
        });
    }
    handleLiquidFillDivMouseLeave = () => {
        this.setState({
            typeToShowLiquidFillDesc: '',
        });
    }

    handleRightNum = (text) => {
        let value = Number.parseInt(text, 10);
        if (value > 10000) {
            value = `${Number.parseFloat(value / 10000).toFixed(1)}万`;
        }
        return value;
    }

    render() {
        const { liquidfillDatas} = this.props;
        const { data} = liquidfillDatas;

        return (
            <Row className="m-row-noPadding">
                {data.map((item) => {
                    return this.getCharts(item, item.type);
                })}
            </Row>
        );
    }
}

export default Liquidfill;
