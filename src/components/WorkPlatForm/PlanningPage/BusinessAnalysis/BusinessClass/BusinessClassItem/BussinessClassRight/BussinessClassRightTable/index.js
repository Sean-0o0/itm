import React, { Component } from 'react'
import { Table, Skeleton } from "antd";
import { Link } from 'dva/router';
import { EncryptBase64 } from "../../../../../../../../components/Common/Encrypt";

export class BussinessClassRightTable extends Component {

    constructor(props) {
        super(props)

        this.state = {
            columns: [],
            data: [],
            colors: ['#83D0EF', '#A285D2', '#46A9A8', '#FFAB67', '#C7D9FD',
                '#5B8FF9', '#5AD8A6', '#5D7092', '#F6BD16', '#6DC8EC', '#E8684A', '#FFA8CC',
            ],
            brokerArray: [],
            tableData: [],
        }
    }

    componentDidMount() {
        this.fetch()
    }

    // componentWillUnmount(){
    //     clearTimeout()
    // }

    //获取数据 定义column
    static getDerivedStateFromProps(props, state) {
        if (JSON.stringify(props.brokerArray) !== JSON.stringify(state.brokerArray) ||
            (props.monData !== state.monData) || JSON.stringify(props.tableData) !== JSON.stringify(props.tableData)
        ) {
            //处理表格标题信息
            let titleArr = props.monData.length > 0 ? props.monData.split(',') : []
            titleArr.length > 0 && titleArr.forEach((item, index) => {
                titleArr[index] = item.substring(4)+'月'
            })
            //处理表格内容信息
            let data = []
            Object.keys(props.result3).length > 0 && props.result3.forEach((item, index) => {
                data[index] = {}
                Object.keys(item).forEach((key, num) => {
                    if (Number(key)) {
                        data[index][`num${num}`] = item[key]
                    } else {
                        data[index][key] = item[key]
                    }
                })
            })
            let tem = []
            let handleLinkClick = () => {
                let htmlContent = document.getElementById("htmlContent")
                let scrollTop = htmlContent.scrollTop
                sessionStorage.setItem("scrollTop", scrollTop);
            }
            const columns = [
                {
                    title: '',
                    dataIndex: 'ORGNAME',
                    key: 'ORGNAME',
                    width: '9%',
                    render: (text, row, index) => {
                        // color: state.colors[index], zIndex: 0
                        // orderResultObj
                        if (tem.indexOf(text) === -1) {
                            tem.push(text)
                            return {
                                children: <div style={{fontSize:'1.3rem'}}>{text}</div>,
                                props: {

                                    rowSpan: props.orderResultObj[text] ? props.orderResultObj[text].length : 1
                                },
                            }
                        } else {
                            return {
                                // children: <div style={{}}>{text}</div>,
                                props: {
                                    rowSpan: 0
                                },
                            }
                        }
                    }
                },
                {
                    title: '',
                    dataIndex: 'CLASSNAME',
                    key: 'CLASSNAME',
                    width: '10%',
                    render: (text, row, index) => {
                        return <div style={{ color: state.colors[index], zIndex: 0,fontSize:'1.3rem' }}>{text}</div>
                    }
                },
                {
                    title: titleArr[0],
                    dataIndex: 'num0',
                    key: 'num0',
                    width: '5%',
                },
                {
                    title: titleArr[1],
                    dataIndex: 'num1',
                    key: 'num1',
                    width: '6%'
                },
                {
                    title: titleArr[2],
                    dataIndex: 'num2',
                    key: 'num2',
                    width: '6%'
                },
                {
                    title: titleArr[3],
                    dataIndex: 'num3',
                    key: 'num3',
                    width: '6%'
                },
                {
                    title: titleArr[4],
                    dataIndex: 'num4',
                    key: 'num4',
                    width: '6%'
                },
                {
                    title: titleArr[5],
                    dataIndex: 'num5',
                    key: 'num5',
                    width: '6%'
                },
                {
                    title: titleArr[6],
                    dataIndex: 'num6',
                    key: 'num6',
                    width: '6%'
                },
                {
                    title: titleArr[7],
                    dataIndex: 'num7',
                    key: 'num7',
                    width: '6%',
                },
                {
                    title: titleArr[8],
                    dataIndex: 'num8',
                    key: 'num8',
                    width: '6%',
                },
                {
                    title: titleArr[9],
                    dataIndex: 'num9',
                    key: 'num9',
                    width: '6%',
                },
                {
                    title: titleArr[10],
                    dataIndex: 'num10',
                    key: 'num10',
                    width: '6%',
                },
                {
                    title: titleArr[11],
                    dataIndex: 'num11',
                    key: 'num11',
                    width: '6%',
                },
                {
                    title: titleArr[12],
                    dataIndex: 'num12',
                    key: 'num12',
                    width: '6%',
                },
                {
                    title: '公式',
                    dataIndex: 'num13',
                    key: 'num13',
                    render: (text, row, index) => {
                        if (row.ISRUNIN && row.ISRUNIN === "0") {
                            return "——"
                        } else if (row.ISRUNIN && row.ISRUNIN === "1") {
                            return <Link onClick={handleLinkClick}
                                //{`/esa/planning/WealthManagement/${EncryptBase64(props.brokerArray)}&&${EncryptBase64(row.CLASSID)}&&${EncryptBase64(JSON.stringify(props.series[index]))}`}
                                to={`/esa/planning/WealthManagement/${EncryptBase64(props.brokerArray)}&&${EncryptBase64(row.CLASSID)}
                                &&${EncryptBase64(JSON.stringify(props.series[index]))}||${EncryptBase64(titleArr)}||${EncryptBase64(row.ORGNAME+'-'+row.CLASSNAME)}`
                                    //state: {titleArr}
                                }>
                                <span style={{ color: '#54A9DF',fontSize:'1.3rem'}}>查看</span>
                            </Link>
                        }

                    }
                },
            ]
            if (data.length > 0) {
                return {
                    brokerArray: [...props.brokerArray],
                    columns,
                    data,
                }
            }
            return {
                columns
            }
        }
        return null
    }


    fetch = () => {
        const data = [
            {
                CLASSID: "42",
                CLASSNAME: "手续费",
                ISRUNIN: "0",
                ORGID: "41",
                ORGNAME: "传统经纪",
                num0: "0",
                num1: "0",
                num2: "0",
                num3: "0",
                num4: "0",
                num5: "0",
                num6: "0",
                num7: "0",
                num8: "0",
                num9: "0.3",
                num10: "0.2",
                num11: "0.2",
                num12: "0.35",
            }, {
                CLASSID: "49",
                CLASSNAME: "两融利息",
                ISRUNIN: "0",
                ORGID: "48",
                ORGNAME: "信用业务",
                num0: "0",
                num1: "0",
                num2: "0",
                num3: "0",
                num4: "0",
                num5: "0",
                num6: "0",
                num7: "0",
                num8: "0",
                num9: "0.2",
                num10: "0.15",
                num11: "0.15",
                num12: "0.25",
            }, {
                CLASSID: "55",
                CLASSNAME: "场外衍生品",
                ISRUNIN: "0",
                ORGID: "51",
                ORGNAME: "衍生品经纪",
                num0: "0",
                num1: "0",
                num2: "0",
                num3: "0",
                num4: "0",
                num5: "0",
                num6: "0",
                num7: "0",
                num8: "0",
                num9: "0.01",
                num10: "0.06",
                num11: "0.06",
                num12: "0.1"
            }, {
                CLASSID: "45",
                CLASSNAME: "管理费",
                ISRUNIN: "0",
                ORGID: "44",
                ORGNAME: "财富管理",
                num0: "0",
                num1: "0",
                num2: "0",
                num3: "0",
                num4: "0",
                num5: "0",
                num6: "0",
                num7: "0",
                num8: "0",
                num9: "0.15",
                num10: "0.12",
                num11: "0.15",
                num12: "0.12",
            }

        ];
        this.setState({
            //columns: columns,
            //  data: data,//不要默认值
            loading: false,
            //brokerArray: brokerArray
        })
    }

    render() {
        const { columns, data, loading } = this.state
        return (
            <div className={data.length === 0 ? "BussinessClassRightTableDefault" : "BussinessClassRightTable"} style={{ backgroundColor: 'white'}}>
                {/* .ant-table-thead > tr > th, .ant-table-tbody > tr > td */}
                <Skeleton loading={loading} active>
                    <Table columns={columns} dataSource={data} pagination={false} bordered={true}
                        rowKey={record => record.CLASSID}
                    />
                </Skeleton>
            </div>
        )
    }
}

export default BussinessClassRightTable
