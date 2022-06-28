import React from 'react';
import { Card, List, message, Spin } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import ReportFormsListItem from './ReportFormsListItem';
import { FetchEditableReportList } from '../../../../../../services/reportcenter';


class ReportFormsRightList extends React.Component {
  state = {
    loading: false,
    listData: {
      dataSource: [],
    },
  }
  componentDidMount() {
    this.getListData();// 拉取List列表数据
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { wdID = '' } = this.props;
    const { wdID: newwdID = '' } = nextProps;
    if (wdID !== newwdID) {
      this.getListData({ bbwd: newwdID });
    }
  }
  getListData = (params = {}) => {
    this.setState({ loading: true });
    const { wdID = '' } = this.props;
    FetchEditableReportList({
      bbwd: wdID,
      ...params,
    }).then((result) => {
      const { records = [] } = result;
      this.setState({ loading: false, listData: { dataSource: records } });
    }).catch((error) => {
      this.setState({ loading: false });
      message.error(!error.success ? error.message : error.note);
    });
  }
  render() {
    const { listData: { dataSource = [] }, loading = false } = this.state;
    return (
      <Card
        className="m-card m-card-pay"
      >
        <Scrollbars renderTrackHorizontal={() => { return <div style={{ display: 'none' }}/>; }} style={{ width: '100%', height: `${window.innerHeight - 200}px` }}>
          <div style={{ padding: '0 1.666rem' }}>
            <List
              className="m-list-report"
            >
              {loading && <Spin style={{ display: 'block', height: '25rem', margin: '0 auto', padding: '8rem 0' }} />}
              {!loading && dataSource && dataSource.length === 0 && <div style={{ textAlign: 'center', height: '25rem', lineHeight: '25rem' }}> <a>暂无数据</a> </div>}
              {!loading && dataSource && dataSource.length !== 0 && (
                dataSource.map((item, index) => {
                  return <ReportFormsListItem key={item.id} index={index} item={item} getListData={this.getListData} />;
                })
              )}
            </List>
          </div>
        </Scrollbars>
      </Card>
    );
  }
}

export default ReportFormsRightList;
