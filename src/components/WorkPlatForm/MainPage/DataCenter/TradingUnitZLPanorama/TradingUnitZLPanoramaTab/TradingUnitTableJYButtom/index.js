import React, { Fragment } from 'react';
import { Row, Col, Tag, Divider, Table } from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/legendScroll';
import ReactEchartsCore from 'echarts-for-react/lib/core';

class TradingUnitTableJYButttom extends React.Component {
    state = {
        loading: false,
        pageParam: {
            pageSize: 10,
            current: 1,
            total: 100,
            selectedRow: {},
            selectedRowKeys: ''
        }
    }

    render() {
        const { loading, pageParam } = this.state;
        const { } = this.props;
        let columns = [
            {
                title: '月份',
                dataIndex: 1,
                key: 1,
                width: '15rem',
            },
            {
                title: '部门',
                dataIndex: 2,
                key: 2,
                width: '15rem',
            },
            {
                title: '承担比例（%）',
                dataIndex: 3,
                key: 3,
                width: '15rem',
            },
            {
                title: '承担金额',
                dataIndex: 4,
                key: 4,
                width: '15rem',
            },
        ];
        const datas = [
            {
                "key": 1,
                "1": "2022-04-29",
                "2": "信托一部",
                "3": "66",
                "4": "10",
            },
            {
                "key": 4,
                "1": "2022-04-29",
                "2": "信托一部",
                "3": "66",
                "4": "10",
            },
            {
                "key": 3,
                "1": "2022-04-29",
                "2": "信托一部",
                "3": "66",
                "4": "10",
            },
            {
                "key": 5,
                "1": "2022-04-29",
                "2": "信托一部",
                "3": "66",
                "4": "10",
            },
            {
                "key": 7,
                "1": "2022-04-29",
                "2": "信托一部",
                "3": "66",
                "4": "10",
            },
            {
                "key": 6,
                "1": "2022-04-29",
                "2": "信托一部",
                "3": "66",
                "4": "10",
            },
            {
                "key": 9,
                "1": "2022-04-29",
                "2": "信托一部",
                "3": "66",
                "4": "10",
            },
            {
                "key": 9,
                "1": "2022-04-29",
                "2": "信托一部",
                "3": "66",
                "4": "10",
            },
            {
                "key": 9,
                "1": "2022-04-29",
                "2": "信托一部",
                "3": "66",
                "4": "10",
            },
            {
                "key": 9,
                "1": "2022-04-29",
                "2": "信托一部",
                "3": "66",
                "4": "10",
            },
            {
                "key": 9,
                "1": "2022-04-29",
                "2": "信托一部",
                "3": "66",
                "4": "10",
            },
        ]

        let option = {
            tooltip: {
                trigger: 'item'
            },
            color: ['rgba(91, 143, 249, 0.85)', 'rgba(103, 210, 243, 1)', 'rgba(240, 109, 88, 1)','rgba(246, 189, 22, 0.85)'],
            legend: {
                bottom: '6%',
                left: 'center',
                orient:'vertical',
                // formatter: function (name) {
                //     // 获取legend显示内容
                //     let optionValueArray = option.series[0].data
                //     let rate = 0
                //     let num = 0
                //     optionValueArray.forEach((item) => {
                //       if (item.name === name) {
                //         // console.log("item.value",item.value)
                //         rate = item.value !== '--'?(item.value / total) * 100 + '':'--'
                //         rate = item.value!== '--'?rate.slice(0, 5):'--'
                //         num = item.value
                //       }
                //     })
                //     return `{a|${name} |} {b| ${num}/${rate}%}`;
                //     //return <span style={{ color: '#000' }}>{name} | <span style={{ color: '#333' }}></span>100/{rate}%</span>;
                //   },
            },
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: [`50%`, `35%`],//height /2.667=多的行数 每行对应2%
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '16',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        { value: 1048, name: '信托一部' },
                        { value: 735, name: '资格产品部' },
                        { value: 580, name: '销售业务一部' },
                        { value: 484, name: '销售业务三部' },
                    ]
                }
            ]
        };
        return (
            <div>
                <Row>
                    <Col span={16}>
                        <div className='tradingunitlist-table' style={{ margin: '2rem 0',height:'80rem' }}>
                            <div className='tradingunitlist-table-opt'>
                                交易单元成本分摊明细
                            </div>
                            {/* <Divider style={{ marginTop: '2rem' }}></Divider> */}
                            <div className='tradingunitlist-table-cont'>
                                <Table
                                    scroll={{
                                        y:320,
                                    }}
                                    columns={columns}
                                    dataSource={datas}
                                    loading={loading}
                                    // bordered
                                    pagination={{
                                        showQuickJumper: true,
                                        // hideOnSinglePage: true,
                                        defaultCurrent: 1,
                                        pageSize: pageParam.pageSize,
                                        current: pageParam.current,
                                        total: pageParam.total,
                                        showTotal: () => `共${pageParam.total}条`,
                                        // onChange: this.onPagerChange,
                                    }}
                                />
                            </div>
                        </div>
                    </Col>


                    <Col span={8} style={{ paddingLeft: '2rem' }}>
                        <div className='tradingunitlist-table' style={{height:'80rem' }}>
                            <div className='tradingunitlist-table-opt'>
                                分摊比例明细
                            </div>
                            <Divider style={{ marginTop: '2rem' }}></Divider>
                            <div>
                                <ReactEchartsCore
                                    style={{height: '70rem'}}
                                    echarts={echarts}
                                    // style={{ height, width }}
                                    option={option}
                                    notMerge
                                    lazyUpdate
                                    theme="theme_name"
                                />
                            </div>
                        </div>
                    </Col>

                </Row>
            </div>
        );
    }
}

export default TradingUnitTableJYButttom;