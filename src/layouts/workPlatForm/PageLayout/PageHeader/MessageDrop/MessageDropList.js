import React from 'react';
import { connect } from 'dva';
import { Link, Redirect } from 'umi';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import { Tabs, Card, Badge, message, Button, Radio } from 'antd';
// import { FetchNotifyCount } from '../../../../../../services/amslb/user';
import { FetchRmndEventNum, fetchReadRmndEvent, fetchRmndEventConf } from '../../../../../services/basicservices/index';
import RemindMessageDropTabItem from './RemindMessageDropTabItem';
import WorkflowTable from './Workflow/WorkflowTable';

class MessageDropList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msgConf: [],
      isread: 0,//0为未读，2为全部
    };
  }
  componentDidMount() {
    this.fetchUnNums();
  }

  componentWillUnmount() {
    if (this.messageDropContent) {
      this.messageDropContent = null;
    }
  }
  fetchUnNums = () => {
    // 任务/计划/其他
    FetchRmndEventNum().then((ret = {}) => {
      const { records = [] } = ret;
      this.setState({
        msgConf: records,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  handleClear = (activeKey) => {
    const { msgConf = [] } = this.state;
    let rmndlx;
    if (msgConf.length > 0) {
      msgConf.every((item) => {
        if (activeKey === item.clCode) {
          rmndlx = item.clCode;
          return false;
        }
        return true;
      });
      fetchReadRmndEvent({ clCode: rmndlx }).then((response) => {
        const { code = -1 } = response;
        if (code > 0) {
          if (this.messageDropContent && activeKey && this.messageDropContent[activeKey]) {
            this.messageDropContent[activeKey].fetchTableData();
          }
          this.fetchUnNums();
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }
  }
  radioBtnChange = (e) => {
    this.setState({
      isread: e.target.value,
    });
  }
  render() {
    const { msgConf = {}, isread = 0 } = this.state;
    const { location: { pathname }, match: { url: prefix } } = this.props;
    const lastBackslashesIndex = pathname.lastIndexOf('/');
    const activeKey = pathname.substring(lastBackslashesIndex + 1);
    return (
      <React.Fragment>
        <Tabs
          className="m-tabs-underline m-tabs-underline-small"
          style={{ background: '#fff', marginTop: '1.5rem' }}
          activeKey={activeKey}
          tabBarExtraContent={
            <div>
              <Radio.Group onChange={(e)=>{ this.radioBtnChange(e);}} defaultValue={0}>
                <Radio value={0}>未读</Radio>
                <Radio value={2}>全部</Radio>
              </Radio.Group>
              <Button className="fcbtn m-btn-border m-btn-border-headColor btn-1c" onClick={() => this.handleClear(activeKey)}>全部已读</Button>
            </div>
          }
        >
          {
            msgConf.length > 0 && msgConf.map((item) => {
              const { evntNum = 0, clName = '', clCode = '' } = item;
              return (
                <Tabs.TabPane
                  key={clCode}
                  tab={
                    <Link to={`/messageDropList/${clCode}`}>
                      <Badge count={evntNum}>
                        <span style={{ display: 'inline-block', width: '8rem' }}>{clName || '--'}</span>
                      </Badge>
                    </Link>
                  }
                />
              );
            })
          }
        </Tabs>
        <Card className="m-card default" style={{ marginTop: '1.5rem' }} >
          <CacheSwitch>
            {
              msgConf.length > 0 && msgConf.map((item) => {
                const { clCode = '' } = item;
                return (
                  <CacheRoute
                    key={clCode}
                    path={`${prefix}/${clCode}`}
                    exact
                    render={props => (
                      clCode === 'Workflow' ? (
                        <WorkflowTable ref={(node) => { if (!this.messageDropContent) this.messageDropContent = {}; this.messageDropContent[clCode] = node; }} {...this.props} tabCode={clCode} onRefresh={this.fetchUnNums} isread={isread}/>
                      ) : <RemindMessageDropTabItem ref={(node) => { if (!this.messageDropContent) this.messageDropContent = {}; this.messageDropContent[clCode] = node; }} {...this.props} typeKey={clCode} tabCode={clCode} onRefresh={this.fetchUnNums} isread={isread}/>
                    )}
                  />
                );
              })
            }
            <Redirect to={`${prefix}/Workflow`} />
          </CacheSwitch>
        </Card>
      </React.Fragment>
    );
  }
}
// export default MessageDropList;
export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(MessageDropList);
