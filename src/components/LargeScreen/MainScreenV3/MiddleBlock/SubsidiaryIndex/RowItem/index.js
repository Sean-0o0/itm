import React, { Component } from 'react'

export class RowItem extends Component {
    render() {
        const { ele = {} } = this.props;
        const { idxName = '-' } = ele;
        return (
            <div className="uncomplete-item flex-r" style={{alignItems: 'center'}}>{idxName}</div>
        )
    }
}

export default RowItem
