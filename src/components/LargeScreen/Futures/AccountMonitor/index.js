import React from 'react';
import {Tooltip } from 'antd';

class AccountMonitor extends React.Component {
    render() {
        const { accountMonitoring = [], settleCompletion = [], chartConfig = [] } = this.props;
        let accMonitInfo = {};
        let icon = "icon_nostart.png";
        let text = "未开始";
        let pClass = "fs-data-value";
        if (accountMonitoring[0]) {
            accMonitInfo = accountMonitoring[0];
        }
        settleCompletion.forEach(item => {
            if (item.IDX_CODE === "XZQH0206") {
                switch (item.STATE) {
                    case '0':
                        icon = "icon_nostart.png";
                        text = "未开始";
                        break;
                    case '1':
                        icon = "icon_underway.png";
                        text = "进行中"
                        break;
                    case '2':
                        icon = "icon_completed.png";
                        text = "已完成"
                        break;
                    case '3':
                        icon = "icon_abnormal.png";
                        text = "异常"
                        pClass = pClass+" red";
                        break;
                    default:
                        break;
                }
            }
        });

        return (
            <div className="ax-card flex-c">
                <div className="card-title title-l">{chartConfig.length && chartConfig[0].chartTitle ?chartConfig[0].chartTitle: ''}
                {chartConfig.length && chartConfig[0].chartNote ?
                        (<Tooltip placement="top" title={<div>{chartConfig[0].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
                            <img className="title-tip" src={[require("../../../../image/icon_tip.png")]} alt="" />
                        </Tooltip>) : ''
                    }</div>
                <div className="flex1 flex-r fs-box">
                    <div className="wid60 flex-c">
                        <div className="flex1">
                            <div className="fs-data-label">穿仓客户数量 / 金额</div>
                            <div className="fs-data-value">{accMonitInfo.CCKHSL||'-'}<span className="fs-data-text">&nbsp;户</span>&nbsp;/&nbsp;{accMonitInfo.CCKHJE?Number.parseFloat(accMonitInfo.CCKHJE).toLocaleString() : '-'}<span className="fs-data-text">&nbsp;万元</span></div>
                        </div>
                        <div className="flex1">
                            <div className="fs-data-label">达到强平状态客户数量 / 金额</div>
                            <div className="fs-data-value">{accMonitInfo.DDQPZTKHSL||'-'}<span className="fs-data-text">&nbsp;户</span>&nbsp;/&nbsp;{accMonitInfo.DDQPZTKHJE?Number.parseFloat(accMonitInfo.DDQPZTKHJE).toLocaleString() : '-'}<span className="fs-data-text">&nbsp;万元</span></div>
                        </div>
                    </div>
                    <div className="wid40 flex-c ">
                        <div className="flex1">
                            <div className="fs-data-label">未规范客户数量</div>
                            {/* <div className="fs-data-value">{nonstandardCnt.length&&Object.keys(nonstandardCnt[0]).length?nonstandardCnt[0].NONSTANDARD_SUM:'-'}<span className="fs-data-text">&nbsp;户</span></div> */}
                            <div className="fs-data-value">{accMonitInfo.WGFKHSL||'-'}<span className="fs-data-text">&nbsp;户</span></div>
                        </div>
                        <div className="flex1">
                            <div className="fs-data-label">品种交易权限报备</div>
                            {
                                icon === "" ? "" :
                                    (<div className={pClass}><img className="fs-side-img" src={[require("../../../../image/" + icon)]} alt="" /><span className="fs-data-text">{text}</span></div>)
                            }
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}
export default AccountMonitor;
