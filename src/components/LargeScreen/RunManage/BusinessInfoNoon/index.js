import React from 'react';
import InfoItem from '../BusinessInfoMorn/InfoItem';

class BusinessInfoMorn extends React.Component {
    render() {
        const { datas = [] } = this.props;
        let firstArr = [];
        let secondArr = [];
        let thirdArr = [];
        datas.forEach(element => {
            if (element.length) {
                if (element[0].IDX_CODE === 'YXGL0201') {
                    firstArr = element;
                } else if (element[0].IDX_CODE === 'YXGL0203') {
                    secondArr = element;
                } else if (element[0].IDX_CODE === 'YXGL0202') {
                    thirdArr = element;
                }
            }
        });

        return (
            <div className="wid40 pd10">
                <div className="ax-card current flex-c">
                    <div className="card-title title-l">下午</div>
                    <div className="flex1 flex-r">
                        <div className="flex1 rm-side flex-c">
                            <div className="flex1 jk-side-title">{firstArr.length ? firstArr[0].IDX_NM : ''}</div>
                            {[1, 2].map(i => (
                                <InfoItem infoItem={firstArr.length ?firstArr[i] : {}} key={i}/>))}
                            <div className="flex1 jk-side-title">{secondArr.length ? secondArr[0].IDX_NM : ''}</div>
                            {[1].map(i => (
                                <InfoItem infoItem={secondArr.length ? secondArr[i] : {}} key={i}/>))}
                        </div>
                        <div className="flex1 rm-side flex-c">
                            <div className="flex1 jk-side-title">{thirdArr.length ? thirdArr[0].IDX_NM : ''}</div>
                            {[1, 2, 3, 4].map(i => (
                                <InfoItem infoItem={thirdArr.length ? thirdArr[i] : {}} key={i}/>))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default BusinessInfoMorn;
