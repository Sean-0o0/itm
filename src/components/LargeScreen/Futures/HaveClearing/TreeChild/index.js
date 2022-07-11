import React from 'react';
import TaskItem from '../TreeChild/TaskItem';

class TreeChild extends React.Component {

    render() {
        const { moudleInfo = {}, weizhi = "", itemCode = '0' } = this.props;
        let text = "";
        let moudleClass = "";
        let backClass = "fs-item-normal";
        let timeClass = "";
        let stateText = "未开始";
        let stateClass = "";
        let icon = "icon_nostart.png";
        let state = ""
        if (moudleInfo !== {}) {
            state = moudleInfo.STATE;
            switch (state) {
                case '0':
                    backClass = "fs-item-normal";
                    icon = "icon_nostart.png";
                    stateText = "未开始";
                    break;
                case '1':
                    backClass = "fs-item-normal";
                    icon = "icon_underway.png";
                    stateClass = "orange nwp"
                    stateText = "进行中";
                    break;
                case '2':
                    backClass = "fs-item-normal";
                    icon = "icon_completed.png";
                    stateClass = "blue nwp"
                    stateText = "已完成";
                    break;
                case '3':
                    backClass = "fs-item-abnormal";
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
        moudleClass = `fs-tree-item ${weizhi} ${backClass}`;
        timeClass = `pt24 fs-data-time ${timeClass}`
        return (
            <React.Fragment>
                <div className={moudleClass}>
                    <div className="flex-r">
                        <div className="flex1 fs-data-name">{moudleInfo.IDX_NM ? moudleInfo.IDX_NM : ""}</div>
                        {
                            icon === "" ? "" :
                                (<div className={stateClass}><img className="fs-zjyw-img" src={[require(`../../../../../image/${icon}`)]} alt="" />{stateText}</div>)
                        }
                    </div>
                    <div className={timeClass}>{text} {moudleInfo.STARTDATE ? moudleInfo.STARTDATE.slice(11, 19) : "--:--:--"} — {moudleInfo.ENDDATE ? moudleInfo.ENDDATE.slice(11, 19) : "--:--:--"}</div>
                    <ul className="timeline-wrapper mt20">
                        <TaskItem state={state} itemCode={itemCode}/>
                    </ul>
                </div>

            </React.Fragment >
        );
    }
}
export default TreeChild;
