import React, { Component } from 'react'

class ZoomBox extends Component {
    state = {
        zoom: 1
    }

    roamMap = (flag) => {
        const { zoom } = this.state
        let increaseAmplitude = 0.2 // 点击按钮每次 放大/缩小 比例
        if (flag === 1) {
            increaseAmplitude = -0.2
        }
        this.setState({
            zoom: (zoom + increaseAmplitude) > 0.2 && (zoom + increaseAmplitude) < 2 ? zoom + increaseAmplitude : zoom
        },()=>{
            this.props.roamMap((zoom + increaseAmplitude) > 0.2 && (zoom + increaseAmplitude) < 2 ? zoom + increaseAmplitude : zoom)
        })
    }

    add = () => {
        this.roamMap(0)
    }

    sub = () => {
        this.roamMap(1)
    }

    render() {
        const { zoom } = this.state;
        return (<div className='pobtm'>
            <div className='btn-back add' onClick={this.add}>+</div>
            <div className='btn-back sub' onClick={this.sub}>-</div>
            <div className='btn-back'>{(zoom * 100).toFixed(0) + '%'}</div>
            
        </div >);
    }
}

export default ZoomBox;