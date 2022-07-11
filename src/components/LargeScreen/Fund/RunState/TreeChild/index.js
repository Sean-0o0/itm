import React from 'react';
import TaskItem from './TaskItem';

class TreeChild extends React.Component {
    
    render() {
        const { business = {}, moudleInfo = [], weizhi = "" } = this.props;
        let text = "";
        let moudleClass = "";
        let backClass = "fs-item-normal";
        let timeClass = "";
        let stateText = "未开始";
        let stateClass = "";
        let icon = "icon_nostart.png";
        let state = ""
        // let tmpl = [];
        let current = -1;
        if (business !== {}) {
            state = business.STATE;
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
        
        moudleClass = `fd-tree-item ${weizhi} ${backClass}`;
        timeClass = `pt24 fs-data-time ${timeClass}`
        // for (let i = 0; i < moudleInfo.length; i++) {
        //     tmpl.push(i);
        // }
        //当前流程
        for (let i = 0; i < moudleInfo.length; i++) {
            if(moudleInfo[0].STATE === '0'){
                current = -1;
                break;
            }else if(moudleInfo[i].STATE === '0'){
                current = i-1;
                break; 
            }else if(moudleInfo[moudleInfo.length-1].STATE === '1' || moudleInfo[moudleInfo.length-1].STATE === '2' ){
                current = i;
            }
        }

        return (
            <React.Fragment>
                <div className={moudleClass}>
                    <div className="flex-r">
                        <div className="flex1 fs-data-name">{business.IDX_NM ? business.IDX_NM : ""}</div>
                        {
                            icon === "" ? "" :
                                (<div className={stateClass}><img className="fs-zjyw-img" src={[require(`../../../../../image/${icon}`)]} alt="" />{stateText}</div>)
                        }
                    </div>
                    <div className={timeClass}>{text} {business.STARTDATE ? business.STARTDATE.slice(11, 19) : "--:--:--"} — {business.ENDDATE ? business.ENDDATE.slice(11, 19) : "--:--:--"}</div>
                    <ul className="fd-timeline-wrapper mt20">
                        {moudleInfo.map((item,index)=>
                            (<TaskItem infoItem={item} current={current} order={index} key={index}/>))}
                    </ul>
                </div>

            </React.Fragment >
        );
    }
}
export default TreeChild;
