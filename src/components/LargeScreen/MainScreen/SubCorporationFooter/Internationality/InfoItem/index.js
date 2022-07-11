import React from 'react';

class InfoItem extends React.Component {
    render() {
        const { infoItem = {}, sumOfLine=0 } = this.props;
        let name = "";
        let infoClass = "";
        let stateText = "未开始";
        let stateClass = "";
        let icon = "icon_nostart.png";
        let state = ""
        if (infoItem !== {}) {
            name = infoItem.IDX_NAME;
            state = infoItem.STATE ? Number.parseInt(infoItem.STATE) : "";
            switch (state) {
                case 0:
                    icon = "icon_nostart.png";
                    stateText = "未开始";
                    break;
                case 1:
                    icon = "icon_underway.png";
                    stateClass = "orange"
                    stateText = "进行中";
                    break;
                case 2:
                    icon = "icon_completed.png";
                    stateClass = "blue"
                    stateText = "已完成";
                    break;
                case 3:
                    icon = "icon_abnormal.png";
                    stateClass = "red"
                    stateText = "异常";
                    break;
                default:
                    break;
            }
        }
        infoClass = `fs20 lh24 mt10 ${stateClass}`
        return (
            <li className="flex1" style={{padding: sumOfLine===2?'1rem 2rem':'1rem .833rem'}}>
                <div className="xy-info-bg pt10 pb10">
                    <div className="fs18 lh22">{name?name:'-'}</div>
                    <div className={infoClass}>
                        {
                            icon === "" ? "" :
                                (<img className="xzgj-work-img" src={[require("../../../../../../image/" + icon)]} alt="" />)
                        }
                        {stateText}
                    </div>
                </div>
            </li>
        );
    }
}
export default InfoItem;
