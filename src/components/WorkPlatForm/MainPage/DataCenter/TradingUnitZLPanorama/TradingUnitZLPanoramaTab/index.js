import React from 'react';
import { Tabs } from 'antd';
import TradingUnitTableZLCont from './TradingUnitTableZLCont';
import TradingUnitTableLCCont from './TradingUnitTableLCCont';
import TradingUnitTableLCButttom from './TradingUnitTableLCButtom';
import TradingUnitTableJYCont from './TradingUnitTableJYCont';
import TradingUnitTableJYCenter from './TradingUnitTableJYCenter';
import TradingUnitTableJYButtom from './TradingUnitTableJYButtom';
const { TabPane } = Tabs;
class TradingUnitZLPanoramaTab extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tab: "1"
        }
    }

    componentWillReceiveProps(nestProps) {
        
    }

    onTabsChange = (e) => {
        this.setState({
            tab: e
        })
    }

    render() {
        const { tab } = this.state;
        return (
            <div>
                <div className="tradingunitpanorama-tab">
                    <Tabs defaultActiveKey="1" onChange={(e)=>this.onTabsChange(e)}>
                        <TabPane tab="租赁信息" key="1" />
                        <TabPane tab="流程信息" key="2" />
                        <TabPane tab="交易信息" key="3" />
                    </Tabs>
                </div>
                {
                    tab === "1" &&
                    <TradingUnitTableZLCont />
                }

                {
                    tab === "2" &&
                    <div>
                        <TradingUnitTableLCCont />
                        <TradingUnitTableLCButttom />
                    </div>
                }
                {
                    tab === "3" &&
                    <div>
                        <TradingUnitTableJYCont />
                        <TradingUnitTableJYCenter />
                        <TradingUnitTableJYButtom />
                    </div>
                }
            </div>
        );
    }
}

export default TradingUnitZLPanoramaTab;