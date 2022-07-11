import React from 'react';
import FmItem from './FmItem';

class FundManage extends React.Component {
    render() {
        const { datas = [] } = this.props;
        let tmpl = [];
        datas.forEach(item => {
            if(item.IDX_GRD === '1'){
                tmpl.push(item);
            }
        });
        const firstVertical = [];
        const secondVertical = [];
        const thirdVertical = [];
        const maxlength = Math.ceil(tmpl.length/3);
        for(let i=0;i<maxlength;i++){
            firstVertical.push(i);
            secondVertical.push(i+maxlength);
            thirdVertical.push(i+maxlength*2);
        }
        
        return (
            <div className="flex1 pd10 flex-c">
                <div className="ax-card flex1 flex-c">
                    <div className="card-title title-l">资金交收管理</div>
                    <div className="flex1 flex-r">
                        <div className="flex-c flex1 fm-side">
                            {firstVertical.map(i => (
                                <FmItem key={i} itemInfo={tmpl[i] ? tmpl[i] : ''}/>
                            ))}
                        </div>
                        <div className="flex-c flex1 fm-side">
                            {secondVertical.map(i => (
                                <FmItem key={i} itemInfo={tmpl[i] ? tmpl[i] : ''}/>
                            ))}
                        </div>
                        <div className="flex-c flex1 fm-side">
                            {thirdVertical.map(i => (
                                <FmItem key={i} itemInfo={tmpl[i] ? tmpl[i] : ''}/>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}
export default FundManage;
