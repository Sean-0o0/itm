import React from 'react';
import { connect } from 'dva';

class FundsOrAsset extends React.Component {
    state = {
    };

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div className="flex1 pd6">
                <div className="ax-card pos-r flex-c">
                    <div className="pos-r">
                        <div className="card-title title-c">兴证基金</div>
                        <div className="card-top-shuom">异常或重大事项报告&nbsp;<span className="red fs16">2</span>&nbsp;项</div>
                    </div>
                    <div className="flex1 pos-r" style={{minheight: '13rem'}}>
                        <div className="tree-bg tree-bg1">
                            <div className="tree-item item-weizhi1 item-abnormal">
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default FundsOrAsset;
