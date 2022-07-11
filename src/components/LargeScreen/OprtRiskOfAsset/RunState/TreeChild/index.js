import React from 'react';

class TreeChild extends React.Component {
    render() {
        const { moudleInfo = {}, weizhi = "" } = this.props;
        let text = "";
        let moudleClass = "";
        let backClass = "fs-item-normal";
        let timeClass = "";
        let stateText = "";
        let stateClass = "";
        let icon = "";
        let state = ""
        if (moudleInfo !== {}) {
            state = moudleInfo.STATE;
            switch (state) {
                case '0':
                    icon = "icon_nostart.png";
                    stateText = "未开始";
                    break;
                case '1':
                    icon = "icon_underway.png";
                    stateClass = "orange"
                    stateText = "进行中";
                    break;
                case '2':
                    icon = "icon_completed.png";
                    stateClass = "blue"
                    stateText = "已完成";
                    break;
                case '3':
                    backClass = "fs-item-abnormal";
                    icon = "icon_abnormal.png";
                    stateClass = "red"
                    stateText = "异常";
                    text = "超时"
                    timeClass = "yellow"
                    break;
                default:
                    break;
            }
        }
        moudleClass = `or-tree-item ${weizhi} ${backClass}`;
        timeClass = `pt20 fs-data-time ${timeClass}`
        return (
            <div className={moudleClass}>
                <div className="flex-r">
                    <div className="flex1 or-data-name">{moudleInfo.IDX_NM ? moudleInfo.IDX_NM : ""}</div>
                    {
                        icon === "" ? "" :
                            (<div className={stateClass}><img className="or-zjyw-img" src={[require("../../../../../image/" + icon)]} alt="" />{stateText}</div>)
                    }
                </div>
                <div className={timeClass}>{text} {moudleInfo.STARTDATE ? moudleInfo.STARTDATE.slice(11, 19) : "--:--:--"} — {moudleInfo.ENDDATE ? moudleInfo.ENDDATE.slice(11, 19) : "--:--:--"}</div>
            </div>
        );
    }
}
export default TreeChild;
