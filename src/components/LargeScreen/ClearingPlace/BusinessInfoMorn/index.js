import React from 'react';
import InfoItem from '../BusinessInfoMorn/InfoItem';

class BusinessInfoMorn extends React.Component {

    render() {
        const { optIdxMorn=[] } = this.props;
        let indexArr = [];
        optIdxMorn.forEach(element => {
            indexArr.push([]);
        })
        optIdxMorn.forEach(element => {
            if (element.length) {
                if (element[0].code === 'QS0101') {
                    indexArr[0] = element;
                } else if (element[0].code === 'QS0102') {
                    indexArr[1] = element;
                } else if (element[0].code === 'QS0103') {
                    indexArr[2] = element;
                } else if (element[0].code === 'QS0104') {
                    indexArr[3] = element;
                }else if (element[0].code === 'QS0107') {
                    indexArr[4] = element;
                }else if (element[0].code === 'QS0108') {
                    indexArr[5] = element;
                }else if (element[0].code === 'QS0106') {
                    indexArr[6] = element;
                }else if (element[0].code === 'QS0105') {
                  indexArr[7] = element;
                }
            }
        });

        return (
            <div className="h33 pd10">
                <div className="ax-card current">
                    <div className="card-title title-l">上午</div>
                    <div className="flex-r">
                        <div className="wid25 jk-side">
                            <InfoItem info={indexArr[0]}/>
                            <InfoItem info={indexArr[1]}/>
                        </div>
                        <div className="wid25 jk-side">
                            <InfoItem info={indexArr[2]} />
                            <InfoItem info={indexArr[3]} />
                        </div>
                        <div className="wid25 jk-side">
                            <InfoItem info={indexArr[4]} />
                            <InfoItem info={indexArr[5]} />
                        </div>
                        <div className="wid25 jk-side">
                            <InfoItem info={indexArr[6]} />
                          <InfoItem info={indexArr[7]} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default BusinessInfoMorn;
