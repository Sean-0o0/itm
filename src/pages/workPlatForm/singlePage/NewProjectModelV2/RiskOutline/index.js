import React, { Component } from 'react'
import RiskManage from '../RiskManage'

class RiskOutline extends Component {
    state = {
        type: 1,
        tooltipVisible: false
    }
    showTooltip=(type)=>{
        this.setState({
            type,
            tooltipVisible: true
        })
    }
    close=()=>{
        this.setState({
            tooltipVisible: false
        }) 
    }

    render() {
        const { tooltipVisible, type } = this.state;
        return (<div className='risk'>
            风险提示:
            <a className="iconfont fill-warning-t" style={{ fontSize: '2.5rem', color: '#D70E19', marginLeft: '2rem' }}>
                &nbsp;2
            </a>
            <a className="iconfont circle-add" onM
                style={{ fontSize: '2.5rem', color: 'rgb(51, 97, 255)', marginLeft: '2rem' }}
                onClick={() => this.showTooltip(1)}>&nbsp;新增</a>
            <a className="iconfont edit"
                style={{ fontSize: '2.5rem', color: 'rgb(51, 97, 255)', marginLeft: '2rem' }}
                onClick={() => this.showTooltip(2)}>&nbsp;修改</a>
            {tooltipVisible&&<RiskManage type = {type} onClose={this.close}/>}
        </div>);
    }
}

export default RiskOutline;