import React from 'react';
import { Tooltip } from 'antd';
import TreeChild from './TreeChild';

class RunState extends React.Component {
    render() {
        const { indAssMgt = [], chartConfig = [] } = this.props;
        let firstMoudle = {};
        let secondMoudle = {};
        let thirdMoudle = {};
        let lastMoudle = {};
        indAssMgt.forEach(item => {
            if (item.IDX_CODE === "XZZG0103") {
                firstMoudle = item;
            } else if (item.IDX_CODE === "XZZG0101") {
                secondMoudle = item;
            } else if (item.IDX_CODE === "XZZG0102") {
                thirdMoudle = item;
            } else if (item.IDX_CODE === "XZZG0104") {
                lastMoudle = item;
            }
        });

        return (
            <div className="ax-card pos-r flex-c">
                <div className="pos-r">
                    <div className="card-title title-l">{chartConfig.length && chartConfig[0].chartTitle ?chartConfig[0].chartTitle: ''}
                    {chartConfig.length && chartConfig[0].chartNote ?
                            (<Tooltip placement="top" title={<div>{chartConfig[0].chartNote.split("\n").map((item,index) => { return <span key={index}>{item}<br /></span> })}</div>}>
                                <img className="title-tip" src={[require("../../../../image/icon_tip.png")]} alt="" />
                            </Tooltip>) : ''
                        }</div>
                </div>
                <div className="flex1 pos-r" style={{ minheight: "13rem" }}>
                    <div className="or-tree-bg or-tree-bgimg">
                        <TreeChild moudleInfo={firstMoudle} weizhi="or-item-weizhi1" />
                        <TreeChild moudleInfo={secondMoudle} weizhi="or-item-weizhi2" />
                        <TreeChild moudleInfo={thirdMoudle} weizhi="or-item-weizhi3" />
                        <TreeChild moudleInfo={lastMoudle} weizhi="or-item-weizhi4" />
                    </div>
                </div>
            </div>
        );
    }
}
export default RunState;
