import React from 'react';
import InfoItem from './InfoItem';

class BusinessInfoMorn extends React.Component {
    render() {
        const { datas = [] } = this.props;
        let firstArr = [];
        let secondArr = [];
        let thirdArr = [];
        let forthArr = [];
        datas.forEach(element => {
            if (element.length) {
                if (element[0].IDX_CODE === 'YXGL0101') {
                    firstArr = element;
                } else if (element[0].IDX_CODE === 'YXGL0102') {
                    secondArr = element;
                } else if (element[0].IDX_CODE === 'YXGL0104') {
                    thirdArr = element;
                } else if (element[0].IDX_CODE === 'YXGL0105') {
                    forthArr = element;
                }
            }
        });
        
        return (
            <div className="h42 pd10">
                <div className="ax-card current flex-c">
                    <div className="card-title title-l">上午</div>
                    <div className="flex1 flex-r">
                        <div className="flex1 rm-side flex-c">
                            <div className="flex1 jk-side-title">{firstArr.length ? firstArr[0].IDX_NM : ''}</div>
                            {[1, 2, 3].map(i => (
                                <InfoItem infoItem={firstArr.length ? firstArr[i] : {}} key={i}/>))}
                        </div>
                        <div className="flex1 rm-side flex-c">
                            <div className="flex1 jk-side-title"></div>
                            {[4, 5, 6].map(i => (
                                <InfoItem infoItem={firstArr.length ? datas[3][i] : {}} key={i}/>))}
                        </div>
                        <div className="flex1 rm-side flex-c">
                            <div className="flex1 jk-side-title">{secondArr.length ? secondArr[0].IDX_NM : ''}</div>
                            {[1, 2, 3].map(i => (
                                <InfoItem infoItem={secondArr.length ? secondArr[i] : {}} key={i}/>))}
                        </div>
                        <div className="flex1 rm-side flex-c">
                            <div className="flex1 jk-side-title"></div>
                            {[4, 5, 6].map(i => (
                                <InfoItem infoItem={secondArr.length ? secondArr[i] : {}} key={i}/>))}
                        </div>
                        <div className="flex1 rm-side flex-c">
                            <div className="flex1 jk-side-title">{thirdArr.length ? thirdArr[0].IDX_NM : ''}</div>
                            {[1].map(i => (
                                <InfoItem infoItem={thirdArr ? thirdArr[i] : {}} key={i}/>))}

                            <div className="flex1 jk-side-title">{forthArr.length ? forthArr[0].IDX_NM : ''}</div>
                            {[1, 2].map(i => (
                                <InfoItem infoItem={forthArr.length ? forthArr[i] : {}} key={i}/>))}

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default BusinessInfoMorn;
