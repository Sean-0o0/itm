import React from 'react';
import { List, message } from 'antd';
import { SysVersionList } from '../../../../services/login';

class VersionInfoList extends React.Component {
  state={
    sysVersionList: [],
  }
  componentDidMount() {
    SysVersionList({}).then((ret = {}) => {
      const { records = [] } = ret;
      if (records && records.length > 0) {
        this.setState({
          sysVersionList: records,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  render() {
    const { sysVersionList = [] } = this.state;
    return (
      <List
        className="m-list-icon-small"
        itemLayout="horizontal"
        style={{ padding: '0 0.833rem', height: '25rem', overflow: 'auto' }}
        dataSource={sysVersionList}
        renderItem={item => (
          <List.Item
            style={{ borderBottom: 'none' }}
          >
            <List.Item.Meta
              title={<p><span>版本号：{item.bbh || ''}</span><span style={{ float: 'right' }}>{item.gxsj || ''}</span></p>}
              description={
                <div>
                  <p><span dangerouslySetInnerHTML={{ __html: item.bbsm || '--' }} /></p>
                </div>
              }
            />
          </List.Item>
        )}
      />
    );
  }
}

export default VersionInfoList;
