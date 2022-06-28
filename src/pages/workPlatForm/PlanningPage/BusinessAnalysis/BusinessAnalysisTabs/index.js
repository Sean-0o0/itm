import React, { Component } from 'react';
import { Tabs } from 'antd';
import FinancialClass from '../../../../../components/WorkPlatForm/PlanningPage/BusinessAnalysis/FinancialClass';
import BussinessClass from '../../../../../components/WorkPlatForm/PlanningPage/BusinessAnalysis/BusinessClass';
import StrategicClass from '../../../../../components/WorkPlatForm/PlanningPage/BusinessAnalysis/StrategicClass';
import { DecryptBase64 } from "../../../../../components/Common/Encrypt";
const TabPane = Tabs.TabPane
class BusinessAnalysisTabs extends Component {
    constructor(props) {
        super(props)

        this.state = {
            defaultActiveKey: '2'
        }
    }

    componentDidMount() {
        //返回的时候定位到对应Tab页面
        const lastUrl = sessionStorage.getItem('recentlyVisited').substring(sessionStorage.getItem('recentlyVisited').lastIndexOf(',') + 1, sessionStorage.getItem('recentlyVisited').lastIndexOf('|'))
        if (lastUrl.indexOf('WealthManagement') !== -1) {
            this.setState({
                defaultActiveKey: '2'
            })
        } else if (lastUrl.indexOf('businessIncome') != -1) {
            this.setState({
                defaultActiveKey: '1'
            })
        }

    }
    onTabClick = (e) => {
        this.setState({
            defaultActiveKey: e
        })
    }

    render() {
        const { defaultActiveKey = '1' } = this.state
        let brokerArray = ''
        let showExpenseArray = ''
        if (this.props.location.state) {
            if (this.props.location.state.brokerArray) {
                brokerArray = DecryptBase64(this.props.location.state.brokerArray)
            }
            if (this.props.location.state.showExpenseArray) {
                showExpenseArray = this.props.location.state.showExpenseArray.join(',')
            }
        }
        return (
            <div className='ba-body' id='ba-body' style={{ margin: '.8rem', minHeight: 'calc(100% - 5rem' }}>
                <Tabs onTabClick={e => this.setState({ defaultActiveKey: e })} activeKey={defaultActiveKey}>
                    <TabPane tab="财务类" key="1" >
                        <FinancialClass showExpenseArray={showExpenseArray} />
                    </TabPane>
                    <TabPane tab="业务类" key="2">
                        <BussinessClass brokerArray={brokerArray} />
                    </TabPane>
                    <TabPane tab="战略类" key="3">
                        <StrategicClass />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default BusinessAnalysisTabs;