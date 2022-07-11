import React from 'react';

class CompletionStatus extends React.Component {

    render() {
        const { moudleInfo = {}, weizhi = "" } = this.props;
        let text = "";
        let moudleClass = "";
        let backClass = "item-normal";
        let timeClass = "";
        let stateText = "未开始";
        let stateClass = "";
        let icon = "icon_nostart.png";
        let state = ""
        if (moudleInfo !== {}) {
            state = moudleInfo.STATE;
            switch (state) {
                case '0':
                    backClass = "item-normal";
                    icon = "icon_nostart.png";
                    stateText = "未开始";
                    break;
                case '1':
                    backClass = "item-normal";
                    icon = "icon_underway.png";
                    stateClass = "orange nwp"
                    stateText = "进行中";
                    break;
                case '2':
                    backClass = "item-normal";
                    icon = "icon_completed.png";
                    stateClass = "blue nwp"
                    stateText = "已完成";
                    break;
                case '3':
                    backClass = "item-abnormal";
                    icon = "icon_abnormal.png";
                    stateClass = "red nwp"
                    stateText = "异常";
                    text = "超时"
                    timeClass = "yellow"
                    break;
                default:
                    break;
            }
        }
        moudleClass = `tree-item ${weizhi} ${backClass}`;
        timeClass = `pt4 ${timeClass}`
        return (
            <div className={moudleClass}>
                <div className="flex-r">
                    <div className="flex1 tree-item-name">{moudleInfo.IDX_NM ? moudleInfo.IDX_NM : ""}</div>
                    {
                        icon === "" ? "" :
                            (<div className={stateClass}><img className="zjyw-img" src={[require("../../../../../image/" + icon)]} alt="" />{stateText}</div>)
                    }
                </div>
                <div className={timeClass}>{text} {moudleInfo.STARTDATE ? moudleInfo.STARTDATE.slice(11, 19) : "--:--:--"} — {moudleInfo.ENDDATE ? moudleInfo.ENDDATE.slice(11, 19) : "--:--:--"}</div>
            </div>
        );
    }
}

export default CompletionStatus;
