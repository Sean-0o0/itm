import React from 'react';
import { Button } from 'antd';
import OverviewHeader from './OverviewHeader';
import CostList from './CostList';
import CostDetail from './CostDetail';
import CalcModal from './CalcModal';

class TradingUnitCalculate extends React.Component {
    state = {
        selectedRow: {},
        calcVisible: false,
        type: 1
    }

    changeSelectedRow = (value = []) => {
        this.setState({
            selectedRow: value,
        })
    }

    changeCalcVisible = (value,type) =>{
        this.setState({
            calcVisible: value,
            type:type
        })
    }


    render() {
        const { selectedRow = {}, calcVisible = false, type = 1 } = this.state;

        return (
            <div className='calculate-box'>
                <OverviewHeader />
                <div>
                    <Button className="opt-button" style={{ margin: '.7rem .7rem .7rem 0' }} onClick={()=>this.changeCalcVisible(true,1)}>成本试算</Button>
                    <Button className="opt-button" style={{ margin: '.7rem' }} onClick={()=>this.changeCalcVisible(true,2)}>成本确认</Button>
                    <Button className="opt-button" style={{ margin: '.7rem' }} onClick={()=>this.changeCalcVisible(true,3)}>成本回退</Button>
                </div>
                <div style={{ display: 'flex' }}>
                    <CostList changeSelectedRow={this.changeSelectedRow} />
                    <CostDetail selectedRow={selectedRow}/>
                </div>
                <CalcModal type={type} visible={calcVisible} changeCalcVisible={this.changeCalcVisible}/>
            </div>
        );
    }
}

export default TradingUnitCalculate;
