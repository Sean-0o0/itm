import React from 'react';
import { Tooltip } from 'antd';
import BarAndLine from '../../Bond/ModuleTextChart/BarAndLine';

class TextChart extends React.Component {
    state = {
        currentIndex: 0, // 展示图表的index，可能一个模块多个图表
    };

    //内容
    getBoxContent = () => {
        const { currentIndex = 0 } = this.state;
        const { records = [], tClass = '', futursTrdRiskControl = [] } = this.props;
        const titleClass = `card-title ${tClass}`;
        let data = {};
        if(futursTrdRiskControl.length){
            data = futursTrdRiskControl[futursTrdRiskControl.length-1];
        }
        const { XZQH0601 = '-', XZQH0602 = '', XZQH0603 = '-', XZQH0604 = '' } = data;

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
                                    <div className="bd-index-title">穿仓客户数量 / 金额</div>
                                    <div className="bd-index-cont">
                                        {XZQH0601}<span className="bd-index-unit">&nbsp;户&nbsp;</span>
                                        / {XZQH0602? Number.parseFloat(XZQH0602):'-'}<span className="bd-index-unit">&nbsp;万元</span>
                                    </div>
                                </div>
                                <div className="flex1 flex-c bd-center">
                                    <div className="bd-index-title">达到强平状态客户数量 / 金额</div>
                                    <div className="bd-index-cont">
                                        {XZQH0603}<span className="bd-index-unit">&nbsp;户&nbsp;</span>
                                        / {XZQH0604? Number.parseFloat(XZQH0604):'-'}<span className="bd-index-unit">&nbsp;万元</span>
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
export default TextChart;
