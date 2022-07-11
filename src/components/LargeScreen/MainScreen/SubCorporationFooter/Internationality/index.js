import React from 'react';
import { message } from 'antd';
import { FetchQueryChartIndexData } from '../../../../../services/largescreen';
import InfoItem from './InfoItem';

class Internationality extends React.Component {
    state = {
        internationalityData: [], // 兴证国际
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

    //数据查询
    fetchData = () => {
        FetchQueryChartIndexData({
            chartCode: "XZGJ"
        }).then((ret = {}) => {
            const { code = 0, data = [] } = ret;
            if (code > 0) {
                this.setState({ internationalityData: data });
            }
        }).catch(error => {
            message.error(!error.success ? error.message : error.note);
        });
    };

    render() {
        const { internationalityData = [] } = this.state;
        const { intErrCounts = "", sumOfLine = 0, chartTitle = '--' } = this.props;

        let obj1 = {};
        let obj2 = {};
        let obj3 = {};
        let obj4 = {};

        internationalityData.forEach(item => {
            if (item.IDX_CODE === "XZGJ010401") {
                obj1 = item;
            } else if (item.IDX_CODE === "XZGJ0101") {
                obj2 = item;
            } else if (item.IDX_CODE === "XZGJ0102") {
                obj3 = item;
            } else if (item.IDX_CODE === "XZGJ0103") {
                obj4 = item;
            }
        });

        return (
            <div className="flex1 pd6">
                <div className="ax-card flex-c">
                    <div className="pos-r">
                        <div className={"card-title " + (sumOfLine < 4 ? "title-c" : "title-c2")}>{chartTitle}</div>
                        <div className="card-top-shuom">异常或重大事项报告&nbsp;<span className="red fs18">{intErrCounts}</span>&nbsp;项</div>
                    </div>
                    <div className={"flex1 tc flex-c " + (sumOfLine === 2 ? "xzgj-cont1" : "xzgj-cont2")}>
                        <div className="flex1 flex-c">
                            <div className="flex1 fs16">{obj1.IDX_NAME ? obj1.IDX_NAME : "-"}</div>
                            <div className={"flex2 " + (sumOfLine === 2 ? "xzgj-num1" : "xzgj-num2")} style={{ display: "table" }}>
                                <div style={{ display: "table-cell", verticalAlign: "middle" }}>{obj1.STATE ? Number.parseInt(obj1.STATE) : "-"}&nbsp;<span className="fs16 fwn">户</span></div>
                            </div>
                        </div>
                        <ul className="flex1 flex-r">
                            <InfoItem infoItem={obj2} sumOfLine={sumOfLine} />
                            <InfoItem infoItem={obj3} sumOfLine={sumOfLine} />
                            <InfoItem infoItem={obj4} sumOfLine={sumOfLine} />
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default Internationality;