import React, { Component } from 'react'

class BudgetType extends Component {
    state = {}
    render() {
        const { title = '-' } = this.props;
        return (<div className='cont-block staff-overview'>
            <div style={{ color: '#303133', fontSize: 16, fontWeight: 'bold', height: '30px', lineHeight: '35px' }}>{title}</div>
        </div>);
    }
}

export default BudgetType;