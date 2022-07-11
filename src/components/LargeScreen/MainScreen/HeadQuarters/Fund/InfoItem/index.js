import React from 'react';

class InfoItem extends React.Component {
    render() {
        const { infoItem = {} } = this.props;
        let name = '';
        let optState = '';
        let icon = "icon_nostart.png";
        let stateClass = "flex1 ";
        let stateText = "未开始";
        if (infoItem) {
            optState = parseInt(infoItem.STATE);
            name = infoItem.IDX_NM;
        }
        switch (optState) {
            case 0:
                icon = "icon_nostart.png";
                stateText = "未开始";
                stateClass = "";
                break;
            case 1:
                icon = "icon_underway.png";
                stateText = "进行中";
                stateClass = "orange";
                break;
            case 2:
                icon = "icon_completed.png";
                stateText = "已完成";
                stateClass = "blue";
                break;
            case 3:
                icon = "icon_abnormal.png";
                stateText = "异常";
                stateClass = "red";
                break;
            default:
        }
        return (
            <React.Fragment>
                <li className="fl wid50 h25">
                    <div className="xy-info-bg2 qs-yw-item2 flex-r fs16 lh20">
                        <div className="qs-yw-name">{name}</div>
                        {
                            icon === "" ? "" :
                                (<div className={stateClass}><img className="zjyw-img" src={[require("../../../../../../image/" + icon)]} alt="" />{stateText}</div>)
                        }
                    </div>
                </li>
            </React.Fragment>
        );
    }
}
export default InfoItem;
