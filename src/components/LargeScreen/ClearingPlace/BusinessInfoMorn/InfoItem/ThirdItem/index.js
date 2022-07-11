import React from 'react';

class ThirdItem extends React.Component {
    render() {
        const { infoItem = {} } = this.props;
        let name = '';
        let optState = '';
        let icon = "icon_nostart.png";
        let pClass = "";
        if (infoItem) {
            optState = infoItem.state;
            name = infoItem.name;
        }
        switch (optState) {
            case '0':
                icon = "icon_nostart.png";
                break;
            case '1':
                icon = "icon_underway.png";
                break;
            case '2':
                icon = "icon_completed.png";
                break;
            case '3':
                icon = "icon_abnormal.png";
                pClass = "red";
                break;
            default:
                break;
        }
        return (
            <p className={pClass} style={{fontSize:"1.725rem", fontWeight:"600",padding:"0.8rem 0"}}><img className="jk-side-img" src={[require("../../../../../../image/"+icon)]} alt="" />{name}</p>
        );
    }
}
export default ThirdItem;
