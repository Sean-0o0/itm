import React from 'react';
import InfoItem from '../BusinessInfoMorn/InfoItem';

class BusinessInfoNoon extends React.Component {
    render() {
        const { optIdxNoon = [] } = this.props;
        let indexArr = [];
        optIdxNoon.forEach(element => {
            indexArr.push([]);
        })
        optIdxNoon.forEach(element => {
            if (element.length) {
                if (element[0].code === 'QS0201') {
                    indexArr[0] = element;
                } else if (element[0].code === 'QS0202') {
                    indexArr[1] = element;
                } else if (element[0].code === 'QS0203') {
                    indexArr[2] = element;
                } else if (element[0].code === 'QS0204') {
                    indexArr[3] = element;
                }else if (element[0].code === 'QS0205') {
                    indexArr[4] = element;
                }else if (element[0].code === 'QS0206') {
                    indexArr[5] = element;
                }else if (element[0].code === 'QS0207') {
                    indexArr[6] = element;
                }else if (element[0].code === 'QS0208') {
                    indexArr[7] = element;
                }else if (element[0].code === 'QS0209') {
                    indexArr[8] = element;
                }else if (element[0].code === 'QS0210') {
                    indexArr[9] = element;
                }
            }
        });
        
        return (
            <div className="fl wid50 h100 pd10">
                <div className="ax-card">
                    <div className="card-title title-l">下午</div>
                    <div className="flex-r">
                        <div className="wid50 jk-side">
                            <InfoItem info={indexArr[0]} />
                            <InfoItem info={indexArr[1]} />
                            <InfoItem info={indexArr[2]} />
                            <InfoItem info={indexArr[3]} />
                            <InfoItem info={indexArr[4]} />
                        </div>
                        <div className="wid50 jk-side">
                            <InfoItem info={indexArr[5]} />
                            <InfoItem info={indexArr[6]} />
                            <InfoItem info={indexArr[7]} />
                            <InfoItem info={indexArr[8]} />
                            <InfoItem info={indexArr[9]} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default BusinessInfoNoon;
