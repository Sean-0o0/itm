import React, { Component } from 'react';
import { Row, Col, Table, message, Modal } from 'antd';
import echarts from 'echarts';
import moment from 'moment';
import { withRouter, Link } from "dva/router";
import ReactEchartsCore from 'echarts-for-react/lib/core';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/chart/pie';
import { EncryptBase64 } from "../../../../../components/Common/Encrypt";
import config from '../../../../../utils/config'
import { FetchQueryBusAnalBusinessDril, FetchQueryBusAnalBusinessDetail } from '../../../../../services/planning/planning.js'

const { api } = config
const { planning: { exportWealthDetail } } = api;
/*
* @Author: cyp
* @Date:  2021年7月6日10:30:19
* @Description: 经营分析 - 业务类 钻取页面
*/
class WealthDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lineOption: {},
            barOption: {},
            showBroker: true,
            data: [],
            columns: [],
            note: [],
            result: [],
            flag: true
        };
    }

    componentDidMount() {
        this.fetch();
    }

    //接口获取数据
    fetch = () => {
        const { type = 0, classId = 42 } = this.props;
        const mon = Number(moment().format('YYYYMM'))
        FetchQueryBusAnalBusinessDril({
            mon,
            classId,
            type: type
        }).then(res => {
            const { code = 0, result = '', note = '' } = res;
            if (code > 0) {
                this.setState({
                    result: result && JSON.parse(result),
                    note: note && JSON.parse(note)
                })
            }
        })
        FetchQueryBusAnalBusinessDetail({
            classId,
            mon,
            type: type
        }).then(res => {
            const { code = 0, result = '', note = '' } = res;
            if (code === 1) {
                let data = JSON.parse(result).data //表格数据
                const noteObj = JSON.parse(note.substring(0, note.lastIndexOf(',')) + '}')//表格列信息
                //固定存在的前三列
                const columns = [
                    {
                        title: '序号',
                        dataIndex: '',
                        render: (text, row, index) => {
                            return data.indexOf(row) + 1
                        },
                    },
                    {
                        title: '行业',
                        dataIndex: 'INDUSTRYNAME',
                    },
                    {
                        title: '标的名称',
                        dataIndex: 'OBJECTNAME',
                    }
                ]
                //根据note返回的值得到1~4列
                for (let key in noteObj) {
                    columns.push({
                        title: noteObj[key],
                        dataIndex: key
                    })
                }
                //最后添加收益额列
                columns.push({
                    title: '收益额',
                    dataIndex: 'INCOME',
                })
                this.setState({
                    data,
                    columns,
                    flag: true
                })
            }
        }).catch(
            this.setState({
                flag: false
            })
        )

    }

    //排序
    handleSort = (arr) => {
        const { note } = this.state

        let temArr = [];
        const temKeyArr = note.mon.split(',')
        temKeyArr.forEach((item, index) => {
            for (let key in arr) {
                if (key === item) {
                    temArr.push(arr[key])
                }
            }
        })
        return temArr
    }

    //用以获取双Y轴折线图取整最大值
    getNum = (flag, num, max) => {
        let temNum = '1'
        for (var i = 0; i < num - 1; i++) {
            temNum += 0
        }
        //fla为true的时候执行正数返回
        if (flag) {
            return Math.ceil(max / temNum) * temNum
        } else {
            return Math.ceil(temNum * max) / temNum
        }
    }

    //创建双Y轴图option
    getBarOption = () => {
        const { note, result: { result2 = '' } } = this.state
        let resultArr1 = [] //成交额
        let resultArr2 = [] //费率
        if (result2[0]) {
            resultArr1 = this.handleSort(result2[0])
            resultArr2 = this.handleSort(result2[1])
            // resultArr1 = this.handleSort(result2[0])
            // resultArr2 = this.handleSort(result2[1])
        }

        let temArr = note.mon ? note.mon.split(',') : []
        temArr.length > 0 && temArr.forEach((item, index) => {
            const temStr = (item.substring(0, 4) + '年' + item.substring(4, 6) + '月')
            temArr[index] = temStr
        })

        // //获取折线图的数据 大致分段
        // let temInterval, flag = 0
        // if (resultArr2.length > 0) {
        //     resultArr2.forEach((item, index) => {
        //         if (flag === 0 && item !== '0') {
        //             temInterval = (+item).toPrecision(1)
        //             flag = 1
        //         }
        //     })
        // }

        let maxY1 = '0', maxY2 = '0';
        if (resultArr1.length > 0) {
            resultArr1.forEach((item, index) => {
                if (maxY1 < +item) {
                    //获取到最大值
                    maxY1 = item
                }
            })
        }
        if (resultArr2.length > 0) {
            resultArr2.forEach((item, index) => {
                if (maxY2 < +item) {
                    //获取最大值小数 保留
                    maxY2 = (+item).toPrecision(3) + ''
                }
            })
        }

        //获取除数的位数 用来获取两位有效数据 进一步通过ceil方法化整
        let y1Num = 0
        if (maxY1.indexOf('.') !== -1) {
            //当数据含小数点的时候
            y1Num = (maxY1).substring(0, maxY1.indexOf('.')).length - 1
        } else {
            //当数据不含小数点的时候
            y1Num = (maxY1).length - 1
        }
        //获取化整之后的最大值
        maxY1 = this.getNum(true, y1Num, maxY1)


        //获取乘数 用来获取两位有效数据 进一步通过ceil方法化整
        let y2Num = 0
        if (maxY2.indexOf('.') !== -1) {
            //当数据含小数点的时候 获取小数点后数字
            y2Num = (maxY2).substring(maxY2.indexOf('.') + 1).length - 1
        } else {
            //当数据不含小数点的时候
            y1Num = (maxY1).length - 1
        }
        maxY2 = this.getNum(false, y2Num, maxY2)

        const barOption = {
            title: {
                text: note.calfmla ? note.calfmla : '计算公式：交易量*佣金费率',
                left: '50%',
                padding: [20, 10],
                textStyle: {
                    color: '#54A9DF',
                    fontWeight: 'normal',
                    fontSize: 15
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                textStyle: {
                    color: '#aaa',
                    fontWeight: 'normal',
                    fontSize: 15
                },
                padding: [20, 10],
                itemGap: 40,
                left: '10%',
                icon: 'circle',
                data: [
                    {
                        name: result2[0] && result2[0].INDINAME,
                        itemStyle: {
                            color: '#E51339'
                        }
                    },
                    {
                        name: result2[1] && result2[1].INDINAME,
                        itemStyle: {
                            color: '#F47676'
                        }
                    }
                ]
            },

            grid: {
                left: '3%',
                right: '4%',
                bottom: '10%',
                containLabel: true
            },

            xAxis: {
                type: 'category',
                boundaryGap: true,
                min: 0,
                data: temArr,
                offset: 10,
                axisLabel: {
                    color: '#A5A7AF',
                    fontSize:15,
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#A5A7AF'
                    }
                },
            },
            yAxis: [{
                type: 'value',
                min: 0,
                max: maxY1, // 右侧y轴最大值
                interval: maxY1 / 5, // 间距等分为10等分
                //max: max,
                //interval: 1000000000000,
                position: 'left',
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    color: '#A5A7AF',
                    fontSize:15,
                }

            },
            {
                type: 'value',
                min: 0,
                show: true,
                splitNumber: 5,
                // max: temInterval ? (temInterval / 5).toPrecision(2) * 6 : 0,
                //interval: (temInterval / 5).toPrecision(2),//不能写死
                max: maxY2, // 右侧y轴最大值
                interval: Math.ceil((maxY2 / 5).toPrecision(2)), // 间距等分为10等分
                position: 'right',
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    color: '#A5A7AF',
                    fontSize:15,
                }
            },
            ],
            series: [

                {
                    name: result2[0] && result2[0].INDINAME,
                    type: 'bar',
                    data: resultArr1,
                    symbol: 'circle', // 折线点设置为实心点
                    symbolSize: 6, // 折线点的大小
                    itemStyle: {
                        color: '#5B8FF9'
                    },
                    barWidth: '25%',

                },
                {
                    name: result2[1] && result2[1].INDINAME,
                    type: 'line',
                    yAxisIndex: 1,
                    data: resultArr2,
                    itemStyle: {
                        color: '#F47676'
                    },
                    lineStyle: {
                        color: '#F47676'
                    }
                }
            ]
        };
        return barOption;
    }

    //创建页面右侧折线图option
    getLineOption = () => {
        const { series, titleArr } = this.props
        const lineOption = {

            tooltip: {
                trigger: 'axis'
            },

            grid: {
                left: '3%',
                right: '4%',
                bottom: '10%',
                containLabel: true
            },

            xAxis: {
                type: 'category',
                boundaryGap: true,
                min: 0,
                data: titleArr.split(","),
                offset: 10,
                axisLabel: {
                    color: '#A5A7AF',
                    fontSize:15,
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#A5A7AF'
                    }
                },
                axisTick: {
                    show: false
                },
            },
            yAxis: {
                type: 'value',
                // name: "亿元",
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    color: '#A5A7AF',
                    fontSize:15,
                },
                min: 0,

            },
            series
        };
        return lineOption;
    }

    // back = () => {
    //     this.props.history.goBack()
    // }

    //折叠展开明细
    changeShowBroker = () => {
        this.setState({ showBroker: !this.state.showBroker })
    }

    // 导出Excel表数据
    export = () => {
        const { type = 0, classId = 0, title = '' } = this.props;
        const { data, columns } = this.state;

        const iframe = this.ifile; // iframe的dom
        if (data.length === 0) {
            Modal.info({ content: '暂无可导出数据!' });
            return;
        }
        Modal.confirm({
            title: '提示：',
            content: `是否导出数据？`,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                const tableHeaderNames = columns.map(item => item.title);
                tableHeaderNames.unshift();
                const tableHeaderCodes = columns.map(item => item.dataIndex);
                tableHeaderCodes.unshift();
                const exportPayload = JSON.stringify({
                    isAllSel: 1,
                    unSelectRowKey: '',
                    tableHeaderNames: tableHeaderNames.join(','),
                    tableHeaderCodes: tableHeaderCodes.join(','),
                    queryBusAnalBusinessDetailModel: {
                        mon: Number(moment().subtract(1, 'months').format('YYYYMM')),//月份参数
                        type,
                        classId
                    },
                    tableName: title,
                });
                const actionUrl = exportWealthDetail;
                // 创建一个表单
                const downloadForm = document.createElement('form');
                downloadForm.id = 'downloadForm';
                downloadForm.name = 'downloadForm';
                // 创建一个输入框
                const input = document.createElement('input');
                input.type = 'text';
                input.name = 'exportPayload';
                input.value = exportPayload;
                // 将该输入框插入到 form 中
                downloadForm.appendChild(input);
                // form 的提交方式
                downloadForm.method = 'POST';
                // form 提交路径
                downloadForm.action = actionUrl;
                // 添加到 body 中
                iframe.appendChild(downloadForm);
                // 对该 form 执行提交
                downloadForm.submit();
                // 删除该 form
                iframe.removeChild(downloadForm);
            },
        });
    }


    render() {
        const { brokerArray, title } = this.props
        const { showBroker, data, columns, result: { result1, result2 }, note, flag } = this.state
        const date = new Date()
        const deadTime = date.getFullYear() + '年' + (date.getMonth()) + '月'
        return (
            <>
                <Row className='wealth-detail'>
                    <Col span={24}>
                        <div className='title' style={{fontSize:'1.3rem'}}>{title ? title : ''}
                            <Link onClick={() => sessionStorage.setItem("detailPageBackFlag", 1)} to={{ pathname: `/esa/planning/businessAnalysis`, state: { brokerArray: `${EncryptBase64(brokerArray)}` } }}> <span className="showDetail" style={{fontSize:'1.3rem'}}>返回</span></Link>
                        </div>

                    </Col>
                    <Col span={24} style={{ borderTop: '2px solid  #F2F2F2' }}>
                        <Row>
                            <Col span={4} style={{ borderRight: '2px solid  #F2F2F2' }}>
                                <div className="target">
                                    <div style={{ fontSize: '1.266667rem' }}>本月收入</div>
                                    <div className="month-data" style={{ fontSize: '1.1666667rem' }}>{result1 ? result1[0].INDI_VAL : ''}</div>
                                    <div className="unit" style={{ fontSize: '1.1666667rem' }}>单位：亿元</div>
                                    <div style={{ fontSize: '1.1666667rem' }}>环比：<span style={{ fontSize: '1.1666667rem' }}>{result1 ? result1[0].GROWTH_MON : ''}%</span></div>
                                    <div style={{ fontSize: '1.1666667rem' }}>同比：<span style={{ fontSize: '1.1666667rem' }}>{result1 ? result1[0].YOY_MON : ''}%</span></div>
                                </div>
                            </Col>
                            <Col span={4} style={{ borderRight: '2px solid  #F2F2F2' }}>
                                <div className="target">
                                    <div style={{ fontSize: '1.166667rem' }} style={{ fontSize: '1.2666667rem' }}>本年收入</div>
                                    <div className="month-data" style={{ fontSize: '1.1666667rem' }}>{result1 ? result1[0].TOTL_VAL : ''}</div>
                                    <div className="unit" style={{ fontSize: '1.1666667rem' }}>单位：亿元</div>
                                    <div style={{ fontSize: '1.1666667rem' }}>环比：<span style={{ fontSize: '1.1666667rem' }}>{result1 ? result1[0].GROWTH_YEAR : ''}%</span></div>
                                </div>
                            </Col>
                            <Col span={16} style={{ borderBottom: '2px solid  #F2F2F2' }}>
                                <div className='coreIndex2'>
                                    <div className="line-title" style={{ fontSize: '1.2rem' }}>亿元</div>
                                    <ReactEchartsCore
                                        echarts={echarts}
                                        style={{ height: "22.416667rem", width: "100%" }}
                                        option={this.getLineOption()}
                                        notMerge
                                        lazyUpdate
                                        theme="theme_name"
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <div className='coreIndex2'>
                            <div className="line-title"></div>
                            <ReactEchartsCore
                                echarts={echarts}
                                style={{ height: "25.416667rem", width: "100%" }}
                                option={this.getBarOption()}
                                notMerge
                                lazyUpdate
                                theme="theme_name"
                            />
                        </div>
                    </Col>
                </Row >
                {flag && <Row className='nucleus-Index' style={{ borderTop: '2px solid  #F2F2F2' }}>
                    <Col span={24}>
                        <div className='basic-index-outline title'  >
                            {<div className='dp-table-title' style={{ display: 'flex', justifyContent: 'space-between', alignItems: "center", paddingLeft: '1rem', }}>
                                <div style={{ fontSize: '1.1666667rem' }}>
                                    指标明细
                                    <div onClick={() => { this.changeShowBroker() }} style={{ display: 'inline-block' }}>
                                        {showBroker ?
                                            <i className="iconfont iconfont icon-down-solid-arrow" style={{ cursor: 'pointer', fontSize: '1rem', display: 'inline-block' }} /> :
                                            <i className="iconfont icon-right-solid-arrow" style={{ cursor: 'pointer', fontSize: '1rem', display: 'inline-block' }} />
                                        }

                                    </div>
                                    <div style={{ display: 'inline-block', color: '#999', fontSize: '1.1667rem', marginLeft: '2rem' }}>
                                        时间：截止 {deadTime}
                                    </div>
                                </div>
                                <div style={{ float: 'right', right: '2rem' }}>
                                    <span onClick={this.export} style={{ cursor: 'pointer', color: '#54A9DF', fontSize: '1.1667rem' }} >导出</span>
                                </div>
                            </div>}
                        </div>
                    </Col>
                </Row >}
                {showBroker && flag && <Row style={{ margin: '1rem' }}>
                    <Table className='wealthDetail-table' columns={columns} dataSource={data}
                        rowKey={record => {
                            return record.OBJECTCODE
                        }}
                        bordered
                    />
                </Row>}
                <iframe title="下载" id="m_iframe" ref={(c) => { this.ifile = c; }} style={{ display: 'none' }} />
            </>
        );
    }
}
export default withRouter(WealthDetail);
