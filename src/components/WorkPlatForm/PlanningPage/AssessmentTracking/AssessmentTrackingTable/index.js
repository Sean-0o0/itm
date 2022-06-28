import React from 'react';
import Head from '../head'
import BasicIndexTable from '../../Common/BasicIndexTable'
import AssessmentTrackingChart from '../AssessmentTrackingChart'
import { FetchQueryAssessTrackPlanDetail, FetchQueryAssessTrackPlanIndiSched, FetchQueryAssessTrackPlanIndiVal } from '../../../../../services/planning/planning'
import { Col, Row } from 'antd';
class AssessmentTracking extends React.Component {
    state = {
        BussinessArray: [],
        column: [],
        data: [],
        investmentOption: {},
        managementOption: {},
        lineColor: ['', '#F7C739', '#83D0EF', '#73A0FA', '#EB7E65'],
        headParam: {},
    };

    fetchData = () => {
        const { param } = this.props
        //获取表格数据
        FetchQueryAssessTrackPlanDetail(
            param
        ).then((ret) => {
            let note = ret.note.split(",")
            let headParam = {}
            note.forEach(element => {
                const tempNote = element.split(":")
                headParam[tempNote[0]] = tempNote[1]

            });
            this.setState({
                data: ret.records,
                headParam: headParam,
            })
        })

        //获取图表数据
        FetchQueryAssessTrackPlanIndiSched(
            param
        ).then((ret) => {
            const title = (ret.note.substring(1) + " ").replace(/\"/g, "");
            const titleArray = title.split('; ')

            const array = JSON.parse(ret.result).data
            const option = this.handleArray(array)

            const investmentOption = this.handleSeries('经营指标完成进度变化情况', titleArray, option)

            this.setState({
                investmentOption: investmentOption
            })
        })

        FetchQueryAssessTrackPlanIndiVal(param).then((ret) => {
            const title = (ret.note.substring(1) + " ").replace(/\"/g, "");
            const titleArray = title.split('; ')

            const array = JSON.parse(ret.result).data
            const option = this.handleArray(array)

            const managementOption = this.handleSeries('经营指标变化情况', titleArray, option)

            this.setState({
                managementOption: managementOption
            })
        })



        const column = [
            {
                columnName: '指标类别',
                colSpan: 1,
                dataIndex: 'IDXCLASSNAME',
                key: 'IDXCLASSNAME',
                type: '1',
                width: '9%',
                align: 'center'
            },
            {
                columnName: '指标名称',
                colSpan: 2,
                dataIndex: 'IDXTYPENAME',
                key: 'IDXTYPENAME',
                type: '1',
                width: '9.5%',
                align: 'center'
            },
            {
                columnName: '指标名称2',
                colSpan: 0,
                dataIndex: 'IDXNAME',
                type: '1',
                width: '9.5%',
                align: 'center'
            },
            {
                columnName: '基础目标',
                colSpan: 1,
                dataIndex: 'BASEGOAL',
                type: '1',
                width: '9%',
                align: 'center'
            },
            {
                columnName: '分解目标',
                colSpan: 1,
                dataIndex: 'BREAKGOAL',
                type: '1',
                width: '9%',
                align: 'center'
            },
            {
                columnName: '挑战目标',
                colSpan: 1,
                dataIndex: 'CHALLENGE',
                type: '1',
                width: '9%',
                align: 'center'
            },
            {
                columnName: '权重',
                colSpan: 1,
                dataIndex: 'WEIGHT',
                type: '1',
                width: '9%',
                align: 'center'
            },
            {
              columnName: '当前指标值',
              colSpan: 1,
              dataIndex: 'INDIVAL',
              type: '1',
              width: '9%',
              align: 'center'
            },
            {
                columnName: '进度',
                colSpan: 1,
                dataIndex: 'COMPSCHED',
                type: '1',
                width: '9%',
                align: 'center'
            },
            {
                columnName: '指标分数',
                colSpan: 1,
                dataIndex: 'INDISCORE',
                type: '1',
                width: '9%',
                align: 'center'
            },
            {
                columnName: 'KPI分数',
                colSpan: 1,
                dataIndex: 'KPISCORE',
                type: '1',
                width: '9%',
                align: 'center'
            },

        ]
        this.setState({
            column: column,
        })
    }

    handleArray(array) {
        let option = {};//创建option用来存储结果集对象
        for (let item in array) {
            for (let it in array[item]) {
                //看option是否已经有这个属性了
                let flag = true
                for (let obj in option) {
                    if (obj == it) {
                        option[obj].push(array[item][it])
                        flag = false
                    }
                }
                if (flag) {
                    //说明属性不存在 则插入该属性
                    option[it] = [array[item][it]]
                }

            }
        }
        return option
    }
    handleSeries(text, titleArray, option) {
        let series = []
        //循环生产构建表格的series
        let index = 0;
        for (let ser in option) {
            if (index > 0) {
                series.push({
                    name: ser,
                    type: 'line',
                    //stack: '总量',
                    data: option[ser],
                    itemStyle: {
                        normal: {
                            color: this.state.lineColor[index], //改变折线点的颜色
                            lineStyle: {
                                color: this.state.lineColor[index] //改变折线颜色
                            }
                        }
                    },
                    smooth: true
                })
            }
            index += 1;
        }
        const investmentOption = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: titleArray,
                //orient: 'vertical',
                //left: 'center',
                bottom: 'bottom',
                //origin:'horizontal',
                //verticalAlign: 'top', //垂直方向位置
                //x: -140, //距离x轴的距离
                //y: 320 //距离Y轴的距离
                //padding: [30, 0, 0, 0], //[（上），（右）、（下）、（左）]
                // textStyle: {
                //     color: 'red'          // 图例文字颜色
                // }

            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '14%',
                top: '2%',
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
                data: option.MON,
                axisLabel: {
                    interval: 0
                },
            },
            yAxis: {
                type: 'value',
                interval: 10,
                min: 0,
            },
            series: series
        }
        return investmentOption;
    }
    componentWillMount() {
        this.fetchData()
    }

    render() {
        const { data = [], column = [], investmentOption, managementOption, headParam } = this.state

        return (
            <div style={{ backgroundColor: 'white', padding: '0 20px 0 20px' }}>
                <Row>
                    <Col span={24}>
                        <Head headParam={headParam} />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <BasicIndexTable
                            title={'基础信息'}
                            data={data}
                            column={column}
                            operation={0} //操作类型 0：查看||1: 修改/新增
                            sortColumn={2}
                            bordered={true}
                            onRef={(ref) => this.child1 = ref}
                        /></Col>
                </Row>
                <Row type='flex' justify='space-between'>
                    <Col span={12}>
                        <Row>
                            <div style={{ fontSize: '1.444rem', fontWeight: 'bold', marginTop: '1rem', marginBottom: '1rem' }}>
                                经营指标完成进度变化情况</div>
                        </Row>
                        <AssessmentTrackingChart
                            option={investmentOption}
                            divId={'div1'}
                            width={'100%'}
                            height={'40rem'}
                            span={24}
                        />
                    </Col>
                    <Col span={12}>
                        <Row>
                            <div style={{ fontSize: '1.444rem', fontWeight: 'bold', marginTop: '1rem', marginBottom: '1rem' }}>
                                经营指标变化情况</div>
                        </Row>
                        <AssessmentTrackingChart
                            option={managementOption}
                            divId={'div2'}
                            width={'100%'}
                            height={'40rem'}
                            span={24} />
                    </Col>
                </Row>

            </div>
        );
    }
}
export default AssessmentTracking;
