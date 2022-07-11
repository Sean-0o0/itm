import React from 'react';
import { message } from 'antd';
import { FetchQueryChartIndexData } from '../../../../../services/largescreen';
import InfoItem from './InfoItem';

class Investment extends React.Component {
    state = {
        investmentData: [], // 兴证投资
    };

    componentDidMount() {
        const refreshWebPage = localStorage.getItem('refreshWebPage');
        this.fetchData();
        this.fetchInterval = setInterval(() => {
            const loginStatus = localStorage.getItem('loginStatus');
            if (loginStatus !== '1') {
                this.props.dispatch({
                    type: 'global/logout',
                });
            }
            this.fetchData();
        }, Number.parseInt(refreshWebPage, 10) * 1000);
    }

    componentWillUnmount() {
        if (this.fetchInterval) {
            clearInterval(this.fetchInterval);
        }
    }

    // 兴证投资查询
    fetchData = () => {
        FetchQueryChartIndexData({
            chartCode: "XZTZ"
        }).then((ret = {}) => {
            const { code = 0, data = [] } = ret;
            if (code > 0) {
                this.setState({ investmentData: data });
            }
        }).catch(error => {
            message.error(!error.success ? error.message : error.note);
        });
    };

    render() {
        const { investmentData = [] } = this.state;
        const { investmentErrCounts = "", sumOfLine = 0, chartTitle = '--' } = this.props;

        let obj1 = {};
        let obj2 = {};
        let obj3 = {};
        let obj4 = {};
        let obj5 = {};
        let obj6 = {};
        let obj7 = {};
        let obj8 = {};

        investmentData.forEach(item => {
            if (item.IDX_CODE === "XZTZ0401") {
                obj1 = item;
            } else if (item.IDX_CODE === "XZTZ0402") {
                obj2 = item;
            } else if (item.IDX_CODE === "XZTZ0101") {
                obj3 = item;
            } else if (item.IDX_CODE === "XZTZ0102") {
                obj4 = item;
            } else if (item.IDX_CODE === "XZTZ0201") {
                obj5 = item;
            } else if (item.IDX_CODE === "XZTZ0202") {
                obj6 = item;
            } else if (item.IDX_CODE === "XZTZ0301") {
                obj7 = item;
            } else if (item.IDX_CODE === "XZTZ0302") {
                obj8 = item;
            }
        });

        return (
            <div className="flex1 pd6">
                <div className="ax-card flex-c">
                    <div className="pos-r">
                        <div className={"card-title " + (sumOfLine < 4 ? "title-c" : "title-c2")}>{chartTitle}</div>
                        <div className="card-top-shuom">异常或重大事项报告&nbsp;<span className="red fs18">{investmentErrCounts}</span>&nbsp;项</div>
                    </div>
                    <div className="flex1 flex-r xztz-cont">
                        <div className="xztz-divider h100" style={{ width: '23%' }}>
                            <ul className="tc flex-c h100">
                                <li className="pt10 pb10 flex1">
                                    <div className=" blue xztz-num">{obj1.RESULT ? obj1.RESULT : ""}</div>
                                    <div className="fs14 lh24">{obj1.NAME ? obj1.NAME : ""}</div>
                                </li>
                                <li className="pt10 pb10 flex1">
                                    <div className=" red xztz-num">{obj2.RESULT ? obj2.RESULT : ""}</div>
                                    <div className="fs14 lh24">{obj2.NAME ? obj2.NAME : ""}</div>
                                </li>
                            </ul>
                        </div>
                        <div className="pl20" style={{ width: '76%', height: '100%' }}>
                            <ul className="clearfix flex-c h100">
                                <div className="flex1">
                                    <InfoItem infoItem={obj3} unit="项" />
                                    <InfoItem infoItem={obj5} unit="项" />
                                    <InfoItem infoItem={obj7} unit="项" />
                                </div>
                                <div className="flex1">
                                    <InfoItem infoItem={obj4} unit="万元" />
                                    <InfoItem infoItem={obj6} unit="万元" />
                                    <InfoItem infoItem={obj8} unit="万元" />
                                </div>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Investment;