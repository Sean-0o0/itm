import React from 'react';
import { Tabs } from 'antd';
import TradingUnitTableZYTop from './TradingUnitTableZYTop';
import TradingUnitTableZYCont from './TradingUnitTableZYCont';
import TradingUnitTableZYCenter from './TradingUnitTableZYCenter';
import TradingUnitTableZYButtom from './TradingUnitTableZYButtom';
import TradingUnitTableLCCont from './TradingUnitTableLCCont';
import TradingUnitTableLCButtom from './TradingUnitTableLCButtom';
import TradingUnitTableJYCont from './TradingUnitTableJYCont';
import TradingUnitTableJYCenter from './TradingUnitTableJYCenter';
import TradingUnitTableJYButtom from './TradingUnitTableJYButtom';
const{TabPane} = Tabs;
class TradingUnitZYPanoramaTab extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tab: "1",
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
                    <div>
                        <TradingUnitTableZYTop />
                        <TradingUnitTableZYCont />
                        <TradingUnitTableZYCenter />
                        <TradingUnitTableZYButtom />
                    </div>
                }
                {
                    tab === "2" &&
                    <div>
                        <TradingUnitTableLCCont />
                        <TradingUnitTableLCButtom />
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

export default TradingUnitZYPanoramaTab;