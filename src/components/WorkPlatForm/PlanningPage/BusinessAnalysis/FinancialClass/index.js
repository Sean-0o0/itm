import React, { Component } from 'react';
import NucleusIndex from './NucleusIndex';
import SelectedIndex from './SelectedIndex';
import CostAndExpense from './CostAndExpense';

/*
* @Author: cyp
* @Date:  2021年7月6日10:29:07
* @Description: 经营分析 业务类页面
*/
class FinancialClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showExpenseArray: [true, true, true]
        };
    }

    changeExpenseArray = (index, boolean) => {
        let { showExpenseArray } = this.state
        showExpenseArray.splice(index, 1, boolean)
        this.setState({
            showExpenseArray
        })
    }

    componentDidMount() {
        this.handleShowExpenseArray()
    }

    handleShowExpenseArray = () => {
        const { showExpenseArray } = this.props
        let temArray = showExpenseArray.split(',')
        temArray.map((item, index) => {
            if (item === 'true') {
                temArray.splice(index, 1, true)
            } else if (item === 'false') {
                temArray.splice(index, 1, false)
            }
        })
        showExpenseArray && this.setState({
            showExpenseArray: temArray
        })
    }
    render() {
        const { showExpenseArray } = this.state
        return (
            <div style={{ padding: '0 0px 10px 0px' }}>
                <div span={24} className='bg_whith mgb1 '>
                    <NucleusIndex showExpense={showExpenseArray[0]} changeExpenseArray={this.changeExpenseArray} />
                </div>
                <div span={24} className='bg_whith mgb1'>
                    <SelectedIndex showExpenseArray={showExpenseArray} changeExpenseArray={this.changeExpenseArray} />
                </div>
                <div span={24} className='bg_whith mgb1'>
                    <CostAndExpense showExpense={showExpenseArray[2]} changeExpenseArray={this.changeExpenseArray} />
                </div>
            </div>
        );
    }
}

export default FinancialClass;