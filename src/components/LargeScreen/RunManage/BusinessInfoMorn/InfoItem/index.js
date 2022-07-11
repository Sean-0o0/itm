import React from 'react';

class InfoItem extends React.Component {
    render() {
        const { infoItem = {} } = this.props;
        let name = '';
        let optState = '';
        let icon = "icon_nostart.png";
        let pClass = "flex1 pClass";
        if (infoItem) {
            optState = infoItem.STATE;
            name = infoItem.IDX_NM || '';
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
            <React.Fragment>
                <div className={pClass}>
                    {name === '' ? '' :
                        (<React.Fragment><img className="jk-side-img" src={[require("../../../../../image/" + icon)]} alt="" />{name}</React.Fragment>)
                    }

                </div>
            </React.Fragment>
        );
    }
}
export default InfoItem;
