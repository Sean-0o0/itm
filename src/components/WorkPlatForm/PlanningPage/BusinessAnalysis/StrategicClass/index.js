import React, { Component } from 'react';
import CompetitiveIndex from './CompetitiveIndex';
import CustomerSituation from './CustomerSituation';
import DispositionSituation from './DispositionSituation';
import InnovationSituation from './InnovationSituation';
import SynergySituation from './SynergySituation';
import RankingIndex from './RankingIndex';
/*
* @Author:  
* @Date:  
* @Description: 经营分析 战略类页面
*/
class StrategicClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div style={{padding:'0 0px 10px 0px'}}>
                <div className='bg_whith mgb1 '>
                    <CompetitiveIndex />
                </div>
                <div className='bg_whith mgb1 '>
                    <RankingIndex />
                </div>
                <div className='bg_whith mgb1'>
                    <CustomerSituation />
                </div>
                <div className='bg_whith mgb1'>
                    <DispositionSituation />
                </div>
                <div className='bg_whith mgb1'>
                    <InnovationSituation/>
                </div>
                <div className='bg_whith mgb1'>
                    <SynergySituation/>
                </div>
            </div>
        );
    }
}

export default StrategicClass;