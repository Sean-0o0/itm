import React from 'react';

class LegendGroup extends React.Component {

    render() {
        const { optIdxStateStat=[] } = this.props;
        let iconAll = '0';
        let iconNoStart = '0';
        let iconUnderway = '0';
        let iconCompleted = '0';
        let iconAbnormal = '0';
        optIdxStateStat.forEach(item => {
            if(item){
                if(item.state === '0'){
                    iconNoStart = item.count;
                }else if(item.state === '1'){
                    iconUnderway = item.count;
                }else if(item.state === '2'){
                    iconCompleted = item.count;
                }else if(item.state === '3'){
                    iconAbnormal = item.count;
                }
            }
        });
        iconAll = parseInt(iconNoStart)+parseInt(iconUnderway)+parseInt(iconCompleted)+parseInt(iconAbnormal);
        return (
            <div className=" data-list-wrap">
                <ul className=" clearfix data-list">
                    <li>
                        <div className=" flex-r data-item">
                            {/*<div className=" data-item-left"></div>*/}
                            <div className=" flex-r flex1 data-item-right">
                                <div className="flex1"><img className="data-item-img" src={[require("../../../../image/icon_all.png")]} alt="" />全部</div>
                                < div className="fwb pl5" >{iconAll}</div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className=" flex-r data-item">
                            {/*<div className=" data-item-left"></div>*/}
                            <div className=" flex-r flex1 data-item-right">
                                <div className="flex1 lightgray"><img className="data-item-img" src={[require("../../../../image/icon_nostart.png")]} alt="" />未开始</div>
                                <div className="fwb pl5">{iconNoStart}</div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className=" flex-r data-item">
                            {/*<div className=" data-item-left"></div>*/}
                            <div className=" flex-r flex1 data-item-right">
                                <div className="flex1 blue"><img className="data-item-img" src={[require("../../../../image/icon_underway.png")]} alt="" />进行中</div>
                                <div className="fwb pl5">{iconUnderway}</div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className=" flex-r data-item">
                            {/*<div className=" data-item-left"></div>*/}
                            <div className=" flex-r flex1 data-item-right">
                                <div className="flex1 green"><img className="data-item-img" src={[require("../../../../image/icon_completed.png")]} alt="" />已完成</div>
                                <div className="fwb pl5">{iconCompleted}</div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className=" flex-r data-item">
                            {/*<div className=" data-item-left"></div>*/}
                            <div className=" flex-r flex1 data-item-right">
                                <div className="flex1 red"><img className="data-item-img" src={[require("../../../../image/icon_abnormal.png")]} alt="" />异常</div>
                                <div className="fwb pl5">{iconAbnormal}</div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        );
    }
}
export default LegendGroup;
