import React from 'react';

class FmItem extends React.Component {
    render() {
        const { itemInfo = {} } = this.props;
        let name = '';
        let optState = '';
        let icon = "icon_nostart.png";
        let pClass = "flex1 fm-side-title";
        if (itemInfo) {
            optState = itemInfo.STATE;
            name = itemInfo.IDX_NM;
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
                pClass = pClass+" red";
                break;
            default:
                break;
        }
        return (
            <div className={pClass}>
                {name === '' ? 
                    (''):
                    (<React.Fragment>
                    <img className="fm-side-img" src={[require("../../../../../image/" + icon)]} alt="" />
                    {name}
                    </React.Fragment>)}
            </div>
        );
    }
}
export default FmItem;
