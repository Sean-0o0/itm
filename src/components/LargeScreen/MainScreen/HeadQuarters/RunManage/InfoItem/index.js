import React from 'react';

class InfoItem extends React.Component {
    render() {
        const { infoItem = {} } = this.props;
        let name = '';
        let optState = '';
        let icon = "icon_nostart.png";
        let showClass = "";
        let stateClass = "";
        let stateText = "未开始";
        if (infoItem) {
            optState = infoItem.STATE;
            name = infoItem.IDX_NM;
        }
        switch (optState) {
            case '0':
                icon = "icon_nostart.png";
                stateText = "未开始";
                stateClass = "";
                break;
            case '1':
                icon = "icon_underway.png";
                stateText = "进行中";
                stateClass = "orange";
                break;
            case '2':
                icon = "icon_completed.png";
                stateText = "已完成";
                stateClass = "blue";
                break;
            case '3':
                icon = "icon_abnormal.png";
                stateText = "异常";
                stateClass = "red";
                break;
            default:
                break;
        }
        showClass = `fs16 lh20 pt2 ${stateClass} flex1`
        return (
            <React.Fragment>
                <div className="xy-info-bg qs-yw-item flex-c">
                    <div className="fs16 lh20 flex1">{name}</div>
                    <div className={showClass}><img className="qs-yw-img" src={[require("../../../../../../image/" + icon)]} alt="" />{stateText}</div>
                </div>
            </React.Fragment>
        );
    }
}
export default InfoItem;
