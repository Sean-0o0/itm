import React, { Component } from 'react';
import RowHalfItem from './RowHalfItem';
import { Icon } from 'antd';

export class ItemList extends Component {
    render() {
        const { item = {}, total = 0 } = this.props;
        const { GROUPNAME = '-', data = [] } = item;
        let arr = new Array(total).fill("");
        
        return (
            <React.Fragment>
                <div className='flex1 flex-r left-cont-box'>
                    <div className='flex-r left-cont-title'>
                        <Icon type="caret-right" style={{ fontSize: '1.833rem', marginRight: '.5rem' }} />
                        {GROUPNAME}
                    </div>
                </div>
                {arr.map((element,index)=>{
                    return <RowHalfItem pos={1} key={index} data={data[index]}/>
                })
                }
            </React.Fragment>
        )
    }
}

export default ItemList
