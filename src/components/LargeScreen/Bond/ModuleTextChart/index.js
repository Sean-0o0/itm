import React from 'react';
import { Tooltip } from 'antd';
import BarAndLine from './BarAndLine';

class ModuleTextChart extends React.Component {
    state = {
        currentIndex: 0, // 展示图表的index，可能一个模块多个图表
    };

    //内容
    getBoxContent = () => {
        const { currentIndex = 0 } = this.state;
        const { records = [], tClass = '', headData = []} = this.props;
        const titleClass = `card-title ${tClass}`;
        let sum = '';
        let money = '';
        let sumText = '';
        let moneyText = '';
        if (records[0]) {
            switch (records[0].chartCode) {
                case 'CDCFuTrans':
                    sum = headData[0] && headData[0].ZBYH05? headData[0].ZBYH05: '-';
                    money = headData[0] && headData[0].ZBYH06? Number.parseFloat(headData[0].ZBYH06).toLocaleString() : '-';
                    sumText = '中债登平台资金汇划笔数';
                    moneyText = '中债登平台资金汇划金额';
                    break;
                case 'CDCOrSet':
                    sum = headData[0] && headData[0].ZBYH01 ? headData[0].ZBYH01: '-';
                    money = headData[0] && headData[0].ZBYH02 ? Number.parseFloat(headData[0].ZBYH02).toLocaleString() : '-';
                    sumText = '中债登指令结算笔数';
                    moneyText = '中债登结算资金总额';
                    break;
                case 'eBankFuTrans':
                    sum = headData[0] && headData[0].ZBYH09 ? headData[0].ZBYH09: '-';
                    money = headData[0] && headData[0].ZBYH10 ? Number.parseFloat(headData[0].ZBYH10).toLocaleString() : '-';
                    sumText = '网银资金汇划笔数';
                    moneyText = '网银资金汇划金额';
                    break;
                case 'SHClearingHouseFuTrans':
                    sum = headData[0] && headData[0].ZBYH07 ? headData[0].ZBYH07: '-';
                    money = headData[0] && headData[0].ZBYH08 ? Number.parseFloat(headData[0].ZBYH08).toLocaleString() : '-';
                    sumText = '上清所平台资金汇划笔数';
                    moneyText = '上清所平台资金汇划金额';
                    break;
                case 'SHClearingHouseOrSet':
                    sum = headData[0] && headData[0].ZBYH03 ? headData[0].ZBYH03: '-';
                    money = headData[0] && headData[0].ZBYH04 ? Number.parseFloat(headData[0].ZBYH04).toLocaleString() : '-';
                    sumText = '上清所指令结算笔数';
                    moneyText = '上清所指令结算金额';
                    break;
                default:
                    break;
            }
        }
        return (
            <React.Fragment>
                {records.map((data, index) => (
                    <React.Fragment key={index}>
                        <div className="box-title" style={{ display: index !== currentIndex && 'none' }}>
                            <div className={titleClass}>{data.chartTitle || '--'}
                                {data.chartNote ?
                                    (<Tooltip placement="top" title={<div>{data.chartNote.split('\n').map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
                                        <img className="title-tip" src={[require("../../../../image/icon_tip.png")]} alt="" />
                                    </Tooltip>) : ''
                                }
                            </div>
                        </div>
                        <div className="chart-box">
                            <div className="flex-r h25">
                                <div className="flex1 flex-c bd-center">
                                    <div className="bd-index-title">{sumText}</div>
                                    <div className="bd-index-cont">
                                        {sum}<span className="bd-index-unit">&nbsp;{data.leftVerticalUnit&&data.leftVerticalUnit.split('/')[1]?data.leftVerticalUnit.split('/')[1]: ''}</span>
                                    </div>
                                </div>
                                <div className="flex1 flex-c bd-center">
                                    <div className="bd-index-title">{moneyText}</div>
                                    <div className="bd-index-cont">
                                        {money}<span className="bd-index-unit">&nbsp;{data.leftVerticalUnit&&data.rightVerticalUnit.split('/')[1]?data.rightVerticalUnit.split('/')[1]: ''}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="h75" style={{ display: index !== currentIndex && 'none' }}>
                                <div style={{ height: '100%' }}>{this.getChartComponent(data)}</div>
                            </div>
                        </div>

                    </React.Fragment>
                ))}
            </React.Fragment>
        );
    };

    // 获取图表组件
    getChartComponent = data => {
        const { chartType } = data;
        const { indexConfig = [], dispatch } = this.props;
        let com = null;
        switch (chartType) {
            case '1':
                com = '定制类（不支持个性化配置）';
                break;
            case '2':
                com = (
                    <BarAndLine
                        configData={data}
                        indexConfig={indexConfig}
                        dispatch={dispatch}
                    />
                ); // 直方图
                break;
            // case '3':
            //     com = (
            //         <LineShadowType
            //             configData={data}
            //             indexConfig={indexConfig}
            //         />
            //     ); // 折线图渐变
            //     break;
            // case '4':
            //     com = (
            //         <LineType
            //             configData={data}
            //             indexConfig={indexConfig}
            //         />
            //     ); // 折线图
            //     break;
            // case '5':
            //     com = (
            //         <Bar
            //             configData={data}
            //             indexConfig={indexConfig}
            //         />
            //     ); // 直方图和平均线
            //     break;
            // case '6':
            //     com = (
            //         <PieType
            //             configData={data}
            //             indexConfig={indexConfig}
            //         />
            //     ); // 饼图
            //     break;
            default:
                com = null;
                break;
        }
        return com;
    };

    // 多图表滑动
    handleSlide = flag => {
        const { currentIndex = 0 } = this.state;
        const { records = [] } = this.props;
        let temp = currentIndex + records.length;
        if (flag > 0) {
            temp = temp + 1;
        } else {
            temp = temp - 1;
        }
        temp = temp % records.length;
        this.setState({ currentIndex: temp });
    };

    render() {
        const { currentIndex = 0 } = this.state;
        const { records = [] } = this.props;
        return (
            <div className="ax-card flex-c">
                {records.length > 1 ? (
                    <React.Fragment>
                        <a
                            className="btn-left"
                            onClick={() => {
                                this.handleSlide(-1);
                            }}
                        >
                            <i className="iconfont icon-jiantou-left" />
                        </a>
                        <a
                            className="btn-right"
                            onClick={() => {
                                this.handleSlide(1);
                            }}
                        >
                            <i className="iconfont icon-jiantou-right" />
                        </a>
                        {this.getBoxContent()}
                        <div className="slide-bottom">
                            {records.map((_, index) => (
                                <a
                                    key={index}
                                    className={`slide-dot ${currentIndex === index && 'current'}`}
                                />
                            ))}
                        </div>
                    </React.Fragment>) : (this.getBoxContent())}
            </div>

        )
    }
}
export default ModuleTextChart;
