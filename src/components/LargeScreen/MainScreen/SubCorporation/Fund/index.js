import React from 'react';
import { message } from 'antd';
import CompletionStatus from '../CompletionStatus';
import { FetchQueryChartIndexData } from '../../../../../services/largescreen';

class Fund extends React.Component {
    state = {
        fundCompletionStatus: [], // 兴证基金-结算完成情况
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
            chartCode: "XzjjSettleCompletion"
        }).then((ret = {}) => {
            const { code = 0, data = [] } = ret;
            if (code > 0) {
                this.setState({ fundCompletionStatus: data });
            }
        }).catch(error => {
            message.error(!error.success ? error.message : error.note);
        });
    };
    render() {
        const { fundCompletionStatus = [] } = this.state;
        const { fundErrCounts = "", sumOfLine = 0, chartTitle = '--' } = this.props;

        let firstMoudle = {};
        let secondMoudle = {};
        let thirdMoudle = {};
        let fourMoudle = {};
        fundCompletionStatus.forEach(item => {
            if (item.IDX_CODE === "XQJJ004") { // 资金清算业务
                firstMoudle = item;
            } else if (item.IDX_CODE === "XQJJ001") { // 估值业务
                secondMoudle = item;
            } else if (item.IDX_CODE === "XQJJ003") { // 注册登记业务
                thirdMoudle = item;
            } else if (item.IDX_CODE === "XQJJ002") { // O32系统
                fourMoudle = item;
            }
        });

        return (
            <div className="flex1 pd6">
                <div className="ax-card pos-r flex-c">
                    <div className="pos-r">
                        <div className={"card-title " + (sumOfLine < 4 ? "title-c" : "title-c2")}>{chartTitle}</div>
                        <div className="card-top-shuom">异常或重大事项报告&nbsp;<span className="red fs18">{fundErrCounts}</span>&nbsp;项</div>
                    </div>
                    <div className="flex1 pos-r" style={{ minheight: '13rem' }}>
                        <div className={sumOfLine === 2 ? "tree-bg1 tree-bg11" : (sumOfLine === 3 ? "tree-bg2 tree-bg21" : 'tree-bg3 tree-bg31')}>
                            <CompletionStatus moudleInfo={firstMoudle} weizhi={sumOfLine === 2 ? "item-weizhi11" : (sumOfLine === 3 ? "item-weizhi21" : 'item-weizhi31')} />
                            <CompletionStatus moudleInfo={secondMoudle} weizhi={sumOfLine === 2 ? "item-weizhi12" : (sumOfLine === 3 ? "item-weizhi22" : 'item-weizhi32')} />
                            <CompletionStatus moudleInfo={thirdMoudle} weizhi={sumOfLine === 2 ? "item-weizhi13" : (sumOfLine === 3 ? "item-weizhi23" : 'item-weizhi33')} />
                            <CompletionStatus moudleInfo={fourMoudle} weizhi={sumOfLine === 2 ? "item-weizhi14" : (sumOfLine === 3 ? "item-weizhi24" : 'item-weizhi34')} />

                            {/* <div className="tree-item item-weizhi1 item-abnormal">
                                <div className="flex-r">
                                    <div className="flex1">资金清算业务</div>
                                    <div className="red"><img className="zjyw-img" src={[require("../../../../../image/icon_abnormal.png")]} alt="" />异常</div>
                                </div>
                                <div className="pt4 yellow">超时 08:00:00 — --:--:</div>
                            </div>
                            <div className="tree-item item-weizhi2 item-normal">
                                <div className="flex-r">
                                    <div className="flex1">估值业务</div>
                                    <div className="blue"><img className="zjyw-img" src={[require("../../../../../image/icon_completed.png")]} alt="" />已完成</div>
                                </div>
                                <div className="pt4">08:00:00 — 08:15:21</div>
                            </div>
                            <div className="tree-item item-weizhi3 item-normal">
                                <div className="flex-r">
                                    <div className="flex1">注册登记业务</div>
                                    <div className="orange"><img className="zjyw-img" src={[require("../../../../../image/icon_underway.png")]} alt="" />进行中</div>
                                </div>
                                <div className="pt4">08:00:00 — --:--:--</div>
                            </div>
                            <div className="tree-item item-weizhi4 item-normal">
                                <div className="flex-r">
                                    <div className="flex1">O32系统</div>
                                    <div className="lightgray"><img className="zjyw-img" src={[require("../../../../../image/icon_nostart.png")]} alt="" />未开始</div>
                                </div>
                                <div className="pt4">--:--:- — --:--:-</div>
                            </div> */}

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Fund;
