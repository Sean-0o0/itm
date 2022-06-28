import React from 'react';
import { Tabs } from 'antd';
import AdviceFeedback from './AdviceFeedback';
import VersionRecord from './VersionRecord';

class RightContent extends React.Component {
    state = {
    };

  handleItemClick = (payload) => {
    //console.log('------次页面----');
    const { handleClickCallback } = this.props;
    if (handleClickCallback) {
      //console.log('------payload----', payload);
      handleClickCallback(payload);
    }
  };

    render() {
        const { planType = '', planId = '', dictionary = [] } = this.props;

        return (
            <div className='advice-right-content'>
                <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab="意见反馈" key="1">
                        <AdviceFeedback planId={planId} dictionary={dictionary} planType={planType} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="版本流水" key="2">
                        <VersionRecord planId={planId} handleItemClick={this.handleItemClick}/>
                    </Tabs.TabPane>
                </Tabs>
            </div>

        );
    }
}
export default RightContent;
