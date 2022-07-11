import React from 'react';
import { message } from 'antd';
import Bar from '../../../ClearingPlace/ModuleChart/Bar';
import LineType from '../../../ClearingPlace/ModuleChart/LineType';
import LineShadowType from '../../../ClearingPlace/ModuleChart/LineShadowType';
import PieType from '../../../ClearingPlace/ModuleChart/PieType';
import {
    FetchQueryModuleChartConfig,
    FetchQueryChartIndexConfig,
    FetchQueryChartIndexData,
} from '../../../../../services/largescreen';

class Capital extends React.Component {
    state = {
        capitalData: {}, // 兴证资本数据
        chartConfig: {}, // 图表配置
        indexConfig: [], // 指标配置
    };

    componentDidMount() {
        const refreshWebPage = localStorage.getItem('refreshWebPage');
        this.fetchAllInterface();
        this.fetchInterval = setInterval(() => {
            const loginStatus = localStorage.getItem('loginStatus');
            if (loginStatus !== '1') {
                this.props.dispatch({
                    type: 'global/logout',
                });
            }
            this.fetchAllInterface();
        }, Number.parseInt(refreshWebPage, 10) * 1000);
    }

    componentWillUnmount() {
        if (this.fetchInterval) {
            clearInterval(this.fetchInterval);
        }
    }

    fetchAllInterface = () => {
        this.fetchData();
        this.fetchChartConfigData();
        this.fetchIndexConfigData();
    }

    // 兴证资本数据查询
    fetchData = () => {
        FetchQueryChartIndexData({
            chartCode: "XZZB"
        }).then((ret = {}) => {
            const { code = 0, data = [] } = ret;
            if (code > 0 && data[0]) {
                this.setState({ capitalData: data[0] });
            }
        }).catch(error => {
            message.error(!error.success ? error.message : error.note);
        });
    };

    // 图表配置数据
    fetchChartConfigData = () => {
        FetchQueryModuleChartConfig({
            screenPage: 12,
        }).then((ret = {}) => {
            const { code = 0, records = [] } = ret;
            if (code > 0) {
                this.handleChartConfigData(records);
            }
        }).catch(error => {
            message.error(!error.success ? error.message : error.note);
        });
    };

    // 指标配置数据
    fetchIndexConfigData = () => {
        FetchQueryChartIndexConfig({
            screenPage: 12,
        }).then((ret = {}) => {
            const { code = 0, records = [] } = ret;
            if (code > 0) {
                this.handleIndexConfigData(records);
            }
        }).catch(error => {
            message.error(!error.success ? error.message : error.note);
        });
    };

    handleChartConfigData = records => {
        records.forEach(item => {
            const { chartCode = "" } = item;
            if (chartCode === "IndCapProAmt") {
                this.setState({ chartConfig: item });
            }
        });
    };

    handleIndexConfigData = records => {
        const codeArr = records.map(m => m.chartCode);
        const tmpl = {};
        codeArr.forEach(item => {
            tmpl[item] = [];
        });
        records.forEach(item => {
            const { chartCode = "" } = item;
            if (chartCode === "IndCapProAmt") {
                tmpl[item.chartCode].push(item);
            }
        });
        this.setState({ indexConfig: tmpl });
    };

    // 获取图表组件
    getChartComponent = () => {
        const { chartConfig, indexConfig = [] } = this.state;
        const { chartType } = chartConfig;
        let com = null;
        switch (chartType) {
            case '1':
                com = '定制类（不支持个性化配置）';
                break;
            // case '2':
            //     com = (
            //         <Bar
            //             configData={data}
            //             indexConfig={indexConfig}
            //         />
            //     ); // 直方图
            //     break;
            case '3':
                com = (
                    <LineShadowType
                        configData={chartConfig}
                        indexConfig={indexConfig}
                    />
                ); // 折线图渐变
                break;
            case '4':
                com = (
                    <LineType
                        configData={chartConfig}
                        indexConfig={indexConfig}
                    />
                ); // 折线图
                break;
            case '5':
                com = (
                    <Bar
                        configData={chartConfig}
                        indexConfig={indexConfig}
                    />
                ); // 直方图和平均线
                break;
            case '6':
                com = (
                    <PieType
                        configData={chartConfig}
                        indexConfig={indexConfig}
                    />
                ); // 饼图
                break;
            default:
                com = null;
                break;
        }
        return com;
    };

    render() {
        const { capitalData = {} } = this.state;
        const { capitalErrCounts = "", sumOfLine = 0, chartTitle = '--' } = this.props;
        let customerCounts = ""; // 本季度客户总数
        if (capitalData !== {}) {
            customerCounts = capitalData.RESULT ? Number.parseInt(capitalData.RESULT) : "-";
        }
        // console.log(capitalData)

        return (
            <div className="flex1 pd6">
                <div className="ax-card">
                    <div className="pos-r">
                        <div className={"card-title " + (sumOfLine < 4 ? "title-c" : "title-c2")}>{chartTitle}</div>
                        <div className="card-top-shuom">异常或重大事项报告&nbsp;<span className="red fs18">{capitalErrCounts}</span>&nbsp;项</div>
                    </div>
                    <div className="flex-r xztz-cont">
                        <div className={"tc flex-c " + (sumOfLine < 4 ? "wid33" : "wid40")}>
                            <div className="fs16 lh20">本季度客户总数</div>
                            <div className="user-box flex1 h85">
                                {/* <img src={[require("../../../../../image/user.png")]} alt="" /> */}
                                <span className="user-num">{customerCounts}&nbsp;<span className="fs14 fwn">人</span></span>
                            </div>
                        </div>
                        <div className={"tc flex-c " + (sumOfLine < 4 ? "wid67" : "wid60")}>
                            <div className="fs16 lh20">本季度各产品数占比</div>
                            <div className="pt5 h85 flex1">
                                {this.getChartComponent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Capital;
