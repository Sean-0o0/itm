import React, { Component } from 'react'

export class ProgressChart extends Component {
    render() {
        const { percent = {}, item = {} } = this.props;
        return (
            <div className='flex-c flex1 sec-pos h100'>
                <div className='fs18'>
                    <span style={{ float: 'left', fontSize: '1.633rem' }}>{item.GROUPNAME ? item.GROUPNAME.replace('业务检查', '') : '-'}</span>
                    <span style={{ float: 'right' }}><span className='fs24'
                        style={{ fontWeight: 'bold', color: '#157EF4' }}>{item.COMPLTASKS ? item.COMPLTASKS : '-'}</span>/{item.TOTALTASKS ? item.TOTALTASKS : '-'}</span>
                </div>
                <div className='flex-r' style={{ alignItems: 'center' }}>
                    <div className='flex-r wid100' style={{ height: '1rem', borderRadius: '.5rem', margin: '1rem 0 .5rem', overflow: 'hidden',backgroundColor: !item.TOTALTASKS||item.TOTALTASKS==='0'?'#233471':null }}>
                        <div style={{ width: `${percent.two}%`, backgroundColor: '#157EF4', display: 'inline'}}></div>
                        <div style={{ width: `${percent.three}%`, backgroundColor: '#E23C39', display: 'inline', marginLeft: percent.three && percent.two ? '.3rem' : '0' }}></div>
                        <div style={{ width: `${percent.four}%`, backgroundColor: '#F7B432', display: 'inline', marginLeft: percent.four && (percent.two || percent.three)? '.3rem' : '0' }}></div>
                        <div style={{ width: `${percent.five}%`, backgroundColor: '#233471', display: 'inline', marginLeft: percent.five && (percent.two || percent.three || percent.four)? '.3rem' : '0' }}></div>
                    </div>
                </div>
                <div className='fs18 flex1 flex-c' style={{ fontSize: '1.5rem' }}>
                    <div className='flex1 flex-r' style={{ alignItems: 'center' }}>
                        <div className='flex1 tc' style={{ color: '#00ACFF' }}>正常</div>
                        <div className='flex1 tc' style={{ color: '#E23C39' }}>异常</div>
                        <div className='flex2 tc' style={{ color: '#F7B432' }}>手工确认</div>
                        <div className='tc' style={{ width: '5rem', color: '#AAAAAA' }}>未完成</div>
                    </div>
                    <div className='flex1 flex-r' style={{ alignItems: 'center' }}>
                        <div className='flex1 tc fwb' style={{ color: '#00ACFF' }}>{item.NORMALTASKS ? item.NORMALTASKS : '-'}</div>
                        <div className='flex1 tc fwb' style={{ color: '#E23C39' }}>{item.EXEPTTASKS ? item.EXEPTTASKS : '-'}</div>
                        <div className='flex2 tc fwb' style={{ color: '#F7B432' }}>{item.HANDTASKS ? item.HANDTASKS : '-'}</div>
                        <div className='tc fwb' style={{ width: '5rem', color: '#AAAAAA' }}>{item.OUTSTTASKS ? item.OUTSTTASKS : '-'}</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProgressChart
