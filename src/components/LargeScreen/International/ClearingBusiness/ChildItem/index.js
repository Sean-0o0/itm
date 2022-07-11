import React from 'react';

class ChildItem extends React.Component {
    render() {
        const { itemInfo = {}, sfjyr = '1'} = this.props;
        let name = '';
        let optState = '';
        let icon = "icon_nostart.png";
        let pClass = "flex1 in-side-title";
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
        if( sfjyr === '0' ){
            icon = "icon_nostart.png";
            pClass = "flex1 in-side-title";
        }
        
        return (
            <div className={pClass}>
                {name === undefined ?
                    ('') :
                    (<React.Fragment>
                        <img className="in-side-img" src={[require("../../../../../image/" + icon)]} alt="" />
                        {name}
                    </React.Fragment>)}
            </div>
        );
    }
}
export default ChildItem;
