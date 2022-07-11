import React from 'react';
import { Tooltip } from 'antd';
import LineType from './LineType';
import LineShadowType from './LineShadowType';
import PieType from './PieType';
import LableLinePieType from './LableLinePieType';
import Bar from './Bar';
import BarAndLine from '../../Bond/ModuleTextChart/BarAndLine';

class MouduleChart extends React.Component {
    state = {
        currentIndex: 0, // 展示图表的index，可能一个模块多个图表
    };

    componentDidMount() {
        // const refreshWebPage = localStorage.getItem('refreshWebPage');
        this.fetchInterval = setInterval(() => {
            //定时刷新
            this.handleSlide();
        }, 10000);
    }

    componentWillUnmount() {
        if (this.fetchInterval) {
            clearInterval(this.fetchInterval);
        }
    }

    //内容
    getBoxContent = () => {
        const { currentIndex = 0 } = this.state;
        const { records = [], tClass = '' } = this.props;
        const titleClass = `card-title ${tClass}`;
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
                        <div className="chart-box" style={{ display: index !== currentIndex && 'none', padding: records.length === 1 ? '.5rem 0 0' : '.5rem 2.333rem 0' }}>
                            <div style={{ height: '100%' }}>{this.getChartComponent(data)}</div>
                        </div>
                    </React.Fragment>
                ))}
            </React.Fragment>
        );
    };

    // 获取图表组件
    getChartComponent = data => {
        const { chartType } = data;
        const { indexConfig = {}, dispatch } = this.props;
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
            case '3':
                com = (
                    <LineShadowType
                        configData={data}
                        indexConfig={indexConfig}
                        dispatch={dispatch}
                    />
                ); // 折线图渐变
                break;
            case '4':
                com = (
                    <LineType
                        configData={data}
                        indexConfig={indexConfig}
                        dispatch={dispatch}
                    />
                ); // 折线图
                break;
            case '5':
                com = (
                    <Bar
                        configData={data}
                        indexConfig={indexConfig}
                        dispatch={dispatch}
                    />
                ); // 直方图和平均线
                break;
            case '6':
                com = (
                    <PieType
                        configData={data}
                        indexConfig={indexConfig}
                        dispatch={dispatch}
                    />
                ); // 饼图
                break;
            case '9':
                com = (
                    <LableLinePieType
                        configData={data}
                        indexConfig={indexConfig}
                        dispatch={dispatch}
                    />
                ); // 饼图
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

    startAutoplay = () => {
        this.fetchInterval = setInterval(() => {
            //定时刷新
            this.handleSlide();
        }, 10000);
    };

    stopAutoplay = () => {
        if (this.fetchInterval) {
            clearInterval(this.fetchInterval);
        }
    };

    render() {
        const { currentIndex = 0 } = this.state;
        const { records = [] } = this.props;
        return (
            <div className="ax-card flex-c" onMouseEnter={this.stopAutoplay} onMouseLeave={this.startAutoplay}>
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
export default MouduleChart;
