import React from 'react';
import InfoItem from '../BusinessInfoMorn/InfoItem';

class BusinessInfoMorn extends React.Component {

    render() {
        const { datas = [] } = this.props;

        return (
            <div className="wid20 pd10">
                <div className="ax-card current flex-c">
                    <div className="card-title title-l">日终</div>
                    <div className="flex1 flex-r">
                        <div className="flex1 rm-side flex-c">
                            <div className="flex1 jk-side-title">{datas[0] ? datas[0][0].IDX_NM : ''}</div>
                            {[1,2,3,4].map(i => (
                                <InfoItem infoItem={datas[0] ? datas[0][i] : {}} key={i}/>))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default BusinessInfoMorn;
