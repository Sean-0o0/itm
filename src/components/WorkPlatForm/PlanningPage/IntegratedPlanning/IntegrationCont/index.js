import React from 'react';
import { Tabs } from 'antd';
import CompanyPastPlan from './CompanyPastPlan';
import CompanyBusinessPlan from './CompanyBusinessPlan';
import CompanyProfitBudget  from "./CompanyProfitBudget";

class IntegrationCont extends React.Component {

    render() {

        return (
            <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="当年公司规划" key="1">
                    <CompanyPastPlan />
                </Tabs.TabPane>
                <Tabs.TabPane tab="利润预算表" key="2">
                    <CompanyProfitBudget />
                </Tabs.TabPane>
                <Tabs.TabPane tab="公司经营计划" key="3">
                    <CompanyBusinessPlan />
                </Tabs.TabPane>
            </Tabs>
        );
    }
}
export default IntegrationCont;
