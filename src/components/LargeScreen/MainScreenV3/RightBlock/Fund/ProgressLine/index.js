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
        const { GROUPNAME = '-',
            TOTALTASKS = '0',
            NORMALTASKS = '0',
            EXEPTTASKS = '0',
            HANDTASKS = '0',
            OUTTASKS = '0' } = data;
        const  normal = this.getPercent(NORMALTASKS,TOTALTASKS);
        const exept = this.getPercent(EXEPTTASKS,TOTALTASKS);
        const hand = this.getPercent(HANDTASKS,TOTALTASKS);
        const out = this.getPercent(OUTTASKS,TOTALTASKS);

        return (
            <div className='flex-c flex1 sec-pos h100' style={{ paddingTop: '1.5rem' }}>
                <div className='fs18'>
                    <span style={{ float: 'left', fontSize: '1.633rem' }}>{GROUPNAME}</span>
                    <span style={{ float: 'right' }}><span className='fs24'
                        style={{ fontWeight: 'bold', color: '#157EF4' }}>{this.getDoneTotal(data)} </span>/ {TOTALTASKS}</span>
                </div>
                <div className='flex-r' style={{ alignItems: 'center' }}>
                    <div className='flex-r' style={{ height: '1rem', margin:'1rem 0 0.5rem', borderRadius: '.5rem', overflow: 'hidden', width: '100%',backgroundColor: !TOTALTASKS||TOTALTASKS==='0'?'#233471':null}}>
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
                        <div className='flex2 tc' style={{ color: '#F7B432' }}>手工确认</div>
                        <div className='tc' style={{ width: '5rem', color: '#AAAAAA' }}>未完成</div>
                    </div>
                    <div className='flex1 flex-r' style={{ alignItems: 'center' }}>
                        <div className='flex1 tc fwb' style={{ color: '#00ACFF' }}>{NORMALTASKS}</div>
                        <div className='flex1 tc fwb' style={{ color: '#E23C39' }}>{EXEPTTASKS}</div>
                        <div className='flex2 tc fwb' style={{ color: '#F7B432' }}>{HANDTASKS}</div>
                        <div className='tc fwb' style={{ width: '5rem', color: '#AAAAAA' }}>{OUTTASKS}</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProgressChart
