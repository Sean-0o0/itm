import React from 'react';
import moment from 'moment';
import { Col, message } from 'antd';
import ExecutionModal from '../../../../../components/WorkPlatForm/MainPage/Mot/MotEvent/ExecutionModal';
import Execution from '../../../../../components/WorkPlatForm/MainPage/Mot/x/Execution';
// import CustomerDimensionExecution from '../../../../MainPage/Mot/MotEvent/CustomerDimensionExecution';
import { getMotListCusDimension } from '../../../../../services/motbase';
import styles from './style.less';

class MessageDropItem extends React.Component {
  state={
    loading: true,
    executionVisible: false,
    customer: {},
  }
  FetchCustomerProfile = () => {
    this.setState({ loading: true });
    const { item = {} } = this.props;
    const { sjid = '', khh = '', fwksrq: rq = '' } = item;
    getMotListCusDimension({
      current: 1,
      pageSize: 10,
      paging: 1,
      total: -1,
      sort: '',
      motlx: '',
      zzc: '',
      khh,
      sjid,
      ksrq: rq || '',
      jsrq: rq || '',
    }).then((response) => {
      const { records = [] } = response;
      this.setState({ loading: false, executionVisible: true, customer: records[0] || {} });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  handleMOTExecution = (e) => {
    if (e) e.preventDefault();
    this.FetchCustomerProfile();
  }
  handleCancelExecute = () => {
    this.setState({ executionVisible: false });
  }
  render() {
    const { item = {} } = this.props;
    const tm = item.rmdTm ? moment(item.rmdTm || '').format('M/D') : '--';
    const { executionVisible, loading, customer } = this.state;
    const { sjid = '', khh = '', fwksrq: rq = '' } = item;
    return (
      <div className="m-progress-warp" title={item.title}>
        <div className="m-progress-name clearfix">
          <Col span={16} style={{ fontSize: '1.333rem', fontWeight: 'bold', color: '#313131' }}>
            <a href="#" className={styles.textOverFlow} onClick={this.handleMOTExecution}>
              {item.title || '--'}
            </a>
          </Col>
          <Col span={8} style={{ fontSize: '1.166rem', fontWeight: 'normal', color: '#8d9ea7', textAlign: 'right' }} >
            {tm}
          </Col>
        </div>
        {
          !loading && (
            <ExecutionModal
              title="事件执行-客户维度"
              visible={executionVisible}
              onCancel={this.handleCancelExecute}
            >
              {executionVisible && (
                <Execution
                  type={1} // 客户维度执行
                  dimensionData={customer}
                  queryParams={{ khh, sjid, ksrq: rq || '', jsrq: rq || '' }}
                />
              )}
              {/* <CustomerDimensionExecution
                customer={customer}
                currentEvent={{ khh, sjid, yf: rq || '' }}
                onRefresh={this.props.onRefresh}
              /> */}
            </ExecutionModal>
          )
        }
      </div>
    );
  }
}

export default MessageDropItem;
