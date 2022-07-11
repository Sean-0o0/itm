import React from 'react';
import InfoItem from '../BusinessInfoMorn/InfoItem';

class BusinessInfoComp extends React.Component {

    render() {
        const { optIdxComp = [] } = this.props;
        let indexArr = [];
        optIdxComp.forEach(element => {
            indexArr.push([]);
        })
        optIdxComp.forEach(element => {
            if (element.length) {
                if (element[0].code === 'QS0301') {
                    indexArr[0] = element;
                } else if (element[0].code === 'QS0302') {
                    indexArr[1] = element;
                } else if (element[0].code === 'QS0303') {
                    indexArr[2] = element;
                } else if (element[0].code === 'QS0304') {
                    indexArr[3] = element;
                }else if (element[0].code === 'QS0305') {
                    indexArr[4] = element;
                }else if (element[0].code === 'QS0306') {
                    indexArr[5] = element;
                }
            }
        });
        return (
            <div className="fl wid50 h100 pd10">
                <div className="ax-card">
                    <div className="card-title title-l">日终</div>
                    <div className="flex-r">
                        <div className="wid50 jk-side">
                            <InfoItem info={indexArr[0]} />
                            <InfoItem info={indexArr[1]} />
                        </div>
                        <div className="wid50 jk-side">
                            <InfoItem info={indexArr[2]} />
                            <InfoItem info={indexArr[3]} />
                            <InfoItem info={indexArr[4]} />
                            <InfoItem info={indexArr[5]} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default BusinessInfoComp;
