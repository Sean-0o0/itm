import React from 'react';
import { Tooltip } from 'antd';
import PieType from './PieType';
import BarStack from './BarStack';
import BarType from './BarType';
import BarAndLine from './BarAndLine';
import Overview from './Overview';
import TodoBussiness from './TodoBussiness';
import DigitalHandle from './DigitalHandle';
import TOP5BusinessAuditCentralTime from './TOP5BusinessAuditCentralTime';
import { Record } from 'immutable';

class MouduleChart extends React.Component {
    state = {
        data: [],
        xAxisData: []
    }

    componentWillReceiveProps(nextprops) {
        const { record = {},
            top5NetChanSuc = [],               //网开成功渠道TOP5客户
            top5NetChanSucXAxisData = [],
            top10NetTodoBus = [],              //网开业务TOP10待办业务量
            top10NetTodoBusXAxisData = [],
            NetAllCheckBusNum = "",             //网开复核总业务量
            NetDealBusNum = "",                 //网开复核处理数
            NetPassBusNum = "",
        } = nextprops;
        const { chartCode = '' } = record;
        if (chartCode === 'BranTop10Trend') {
            this.setState({
                data: [
                    { value: 43, name: '存管账户开户' },
                    { value: 43, name: '个人客户职业信息' },
                    { value: 35, name: '港股通账户开户' },
                    { value: 13, name: '客户密码重置' },
                    { value: 5, name: '客户信息修改' },
                    { value: 3, name: '网上销户' },
                    { value: 65, name: '存管银行变更' },
                    { value: 78, name: '客户风险评测' },
                    { value: 25, name: '电子签名约定书签' },
                    { value: 10, name: '证券账户开户等级' }
                ]
            })
        } else if (chartCode === 'BranAllBusiness') {
            this.setState({
                data: top5NetChanSuc,
                xAxisData: top5NetChanSucXAxisData,
            })
        } else if (chartCode === 'BranTop5CustSuccOnlChnl') {
            this.setState({
                data: top5NetChanSuc,
                xAxisData: top5NetChanSucXAxisData,
            })
        } else if (chartCode === 'BranTop10TodoBsnVolCntT') {
            this.setState({
                data: [
                    [2000, 223, 1213, 344, 544, 6212, 117, 122, 334, 23],
                    [400, 213, 1213, 344, 244, 62, 117, 12, 3]
                ],
                xAxisData: ['存管', '网销', '港通', '开户', '信息修改', '书签', '风测', '密码重置', '信息登记', '登记'],
                legend: ['总部待审核', '分公司待审核']
            })
        } else if (chartCode === 'BranTodoBusiness') {

        } else if (chartCode === 'BranTop10TodoBusinDeptNet') {
            this.setState({
                data: top10NetTodoBus,
                xAxisData: top10NetTodoBusXAxisData,
            })
        } else if (chartCode === 'BranTop10TodoBusinDeptCntT') {
            this.setState({
                data: [
                    [2000, 223, 1213, 344, 544, 6212, 117, 122, 334, 203],
                    [400, 213, 1213, 344, 244, 62, 117, 12, 35]
                ],
                xAxisData: ['五一北', '朝阳路', '乌山西', '南平东', '通湖路', '五四路', '文山北', '湖东路', '西洋中', '横屿路'],
                legend: ['总部待审核', '分公司待审核']
            })
        } else if (chartCode === 'BranTimePeriodDgrm') {
            this.setState({
                data: [
                    [24, 4, 24, 8, 15, 4, 18, 4, 7, 25, 22, 10, 10, 14, 22],
                    [2, 2, 12, 4, 14, 6, 1, 2, 3, 3, 2, 5, 7, 9, 1],
                    [22, 2, 12, 4, 1, 2, 17, 2, 4, 23, 22, 3, 1, 5, 21],
                    [12, 2, 12, 4, 11, 4, 9, 2, 3.5, 12.5, 5, 3, 5, 7, 11]
                ],
                xAxisData: ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'],
                legend: ['总量', '最小值', '最大值', '平均值']
            })
        } else if (chartCode === 'BranDigtSupervs') {

        } else if (chartCode === 'BranTop5BusnAccptnTimeout') {
            this.setState({
                data: [
                ],
            })
        }
    }

    // 获取图表组件
    getChartComponent = (type) => {
        const { data, xAxisData, legend } = this.state;
        let com = null;
        switch (type) {
            case '6':
                com = (
                    <PieType
                        data={data}
                    />
                ); // 饼图
                break;
            case '3':
                com = (
                    <BarType
                        data={data}
                        xAxisData={xAxisData}
                    />
                ); // 柱状图
                break;
            case '8':
                com = (
                    <BarAndLine
                        data={data}
                        xAxisData={xAxisData}
                        legend={legend}
                    />
                ); // 折线图（总量柱状图）
                break;
            case '10':
                com = (
                    <BarStack
                        data={data}
                        xAxisData={xAxisData}
                        legend={legend}
                    />
                ); // 堆叠条形图
                break;
            default:
                com = null;
                break;
        }
        return com;
    };

    render() {

        const { record = {}, tClass = '', NetAllCheckBusNum = "", NetDealBusNum = "", NetPassBusNum = "", } = this.props;
        const { data = [] } = this.state;
        const titleClass = `card-title ${tClass}`;

        return (
            <div className="ax-card flex-c">
                <div className="box-title">
                    <div className={titleClass}>{record.chartTitle || '--'}
                        {record.chartNote ?
                            (<Tooltip placement="top" title={<div>{record.chartNote.split('\n').map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
                                <img className="title-tip" src={[require("../../../../image/icon_tip.png")]} alt="" />
                            </Tooltip>) : ''
                        }

                    </div>
                </div>
                <div className="chart-box" style={{ padding: 0 }}>
                    {/* {data.length === 0 ?
                        <React.Fragment>
                            <div className="evrt-bg evrt-bgimg"></div>
                            <div className="tc blue" style={{ fontSize: '1.633rem' }}>暂无数据</div>
                        </React.Fragment> : */}
                    <div style={{ height: '100%' }}>
                        {record.chartCode === 'BranTop10Trend' &&
                            this.getChartComponent(record.chartType)
                        }
                        {record.chartCode === 'BranAllBusiness' &&
                            <Overview NetAllCheckBusNum={NetAllCheckBusNum} NetDealBusNum={NetDealBusNum} />
                        }
                        {record.chartCode === 'BranTop5CustSuccOnlChnl' &&
                            this.getChartComponent(record.chartType)
                        }
                        {record.chartCode === 'BranTop10TodoBsnVolCntT' &&
                            this.getChartComponent(record.chartType)
                        }
                        {record.chartCode === 'BranTodoBusiness' &&
                            <TodoBussiness />
                        }
                        {record.chartCode === 'BranTop10TodoBusinDeptNet' &&
                            this.getChartComponent(record.chartType)
                        }
                        {record.chartCode === 'BranTop10TodoBusinDeptCntT' &&
                            this.getChartComponent(record.chartType)
                        }
                        {record.chartCode === 'BranTimePeriodDgrm' &&
                            this.getChartComponent(record.chartType)
                        }
                        {record.chartCode === 'BranDigtSupervs' &&
                            <DigitalHandle data={data} />
                        }
                        {record.chartCode === 'BranTop5BusnAccptnTimeout' &&
                            <TOP5BusinessAuditCentralTime />
                        }
                    </div>
                    {/* } */}
                </div>
            </div>

        )
    }
}
export default MouduleChart;
