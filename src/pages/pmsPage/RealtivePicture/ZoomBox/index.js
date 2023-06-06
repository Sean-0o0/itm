import React, { Component } from 'react'

class ZoomBox extends Component {
    state = {
        zoom: 1
    }



    roamMap = (flag) => {
        let zoom = this.props.getRoam();
        if(flag===0){
            zoom = zoom<2?zoom*1.2:zoom
        }else{
            zoom = zoom>0.2?zoom/1.2:zoom
        }
        this.setState({
            zoom
        },()=>{
            this.props.roamMap(zoom)
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