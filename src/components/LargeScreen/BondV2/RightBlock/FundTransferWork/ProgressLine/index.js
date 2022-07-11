import React, { Component } from 'react'

export class ProgressChart extends Component {
    getDoneTotal = (data) =>{
        const { 
        NORMALTASKS = '0',
        EXEPTTASKS = '0',
        HANDTASKS = '0' } = data;
        return Number.parseInt(NORMALTASKS)+Number.parseInt(EXEPTTASKS)+Number.parseInt(HANDTASKS);
    }

    getPercent = (num, total) =>{
        const percent = num/total;
        return percent.toFixed(2)*100;
    }

    render() {
        const { data = {} } = this.props;
        const { NAME = '-',          
            COMPLETE = '0',
            ANOMALOUS = '0',
            MANUAL = '0',
            INCOMPLETE = '0' } = data;
        const TOTALTASKS = Number.parseInt(COMPLETE)+Number.parseInt(ANOMALOUS)+Number.parseInt(MANUAL)+Number.parseInt(INCOMPLETE);
        const  normal = this.getPercent(COMPLETE,TOTALTASKS);
        const exept = this.getPercent(ANOMALOUS,TOTALTASKS);
        const hand = this.getPercent(MANUAL,TOTALTASKS);
        const out = this.getPercent(INCOMPLETE,TOTALTASKS);

        return (
            <div className='flex-c flex1 sec-pos h100' style={{ paddingTop: '1.5rem' }}>
                <div className='fs18'>
                    <span style={{ float: 'left', fontSize: '1.633rem' }}>{NAME}</span>
                </div>
                <div className='flex-r' style={{ alignItems: 'center' }}>
                    <div className='flex-r bond-progress' style={{backgroundColor: !TOTALTASKS||TOTALTASKS==='0'?'#233471':null}}>
                        <div style={{ width: `${normal}%`, backgroundColor: '#157EF4', display: 'inline',
                         marginRight: normal&&(exept||hand||out)?'.3rem': '0' }}></div>
                        <div style={{ width: `${exept}%`, backgroundColor: '#E23C39', display: 'inline', 
                        marginRight: exept&&(hand||out)?'.3rem': '0' }}></div>
                        <div style={{ width: `${hand}%`, backgroundColor: '#F7B432', display: 'inline', 
                        marginRight: hand&&(out)?'.3rem': '0' }}></div>
                        <div style={{ width: `${out}%`, backgroundColor: '#233471', display: 'inline' }}></div>
                    </div>
                </div>
                <div className='fs18 flex-c flex' style={{ fontSize: '1.5rem', height: '4.5rem' }}>

                    <div className='flex1 flex-r flex1' style={{ alignItems: 'center' }}>
                        <div className='flex1 tc' style={{ color: '#00ACFF' }}>正常</div>
                        <div className='flex1 tc' style={{ color: '#E23C39' }}>异常</div>
                        <div className='flex2 tc' style={{ color: '#F7B432' }}>手工结算</div>
                        <div className='tc' style={{ width: '5rem', color: '#AAAAAA' }}>未完成</div>
                    </div>
                    <div className='flex1 flex-r'>
                        <div className='flex1 tc fwb' style={{ color: '#00ACFF' }}>{COMPLETE}</div>
                        <div className='flex1 tc fwb' style={{ color: '#E23C39' }}>{ANOMALOUS}</div>
                        <div className='flex2 tc fwb' style={{ color: '#F7B432' }}>{MANUAL}</div>
                        <div className='tc fwb' style={{ width: '5rem', color: '#AAAAAA' }}>{INCOMPLETE}</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProgressChart
