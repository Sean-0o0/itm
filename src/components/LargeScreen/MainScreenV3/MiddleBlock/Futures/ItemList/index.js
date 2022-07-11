import React, { Component } from 'react';
import { Icon } from 'antd';
import RowHalfItem from './RowHalfItem';

export class ItemList extends Component {
    render() {
        const { item = {}, total = 0 } = this.props;
        const { data = [], GROUPNAME = '-'} = item;
        let arr = new Array(total).fill("");

        return (
            <div className="flex1 flex-c" style={{paddingLeft: '1rem'}}>
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
            </div>
        )
    }
}

export default ItemList

