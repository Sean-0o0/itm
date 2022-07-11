import React from 'react';

class InfoItem extends React.Component {
    render() {
        const { infoItem = {}, unit = "" } = this.props;
        return (
            <li className="fl wid33 pd6">
                <div className="h100 xy-info-bg tr pd6" style={{height: '7rem'}}>
                    <div className="fs16 lh36 nwp" style={{overflow: 'hidden'}}>{infoItem.NAME ? infoItem.NAME : "-"}</div>
                    <div className="fs16 lh22 pt10 blue"><span className="fs16 fwb">{infoItem.RESULT ? infoItem.RESULT : "-"}</span>&nbsp;{unit}</div>
                </div>
            </li>
        );
    }
}
export default InfoItem;
