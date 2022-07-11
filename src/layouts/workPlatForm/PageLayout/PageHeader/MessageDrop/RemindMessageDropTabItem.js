import React, { Fragment } from 'react';
import { message } from 'antd';
import ExecutionModal from '../../../../../components/WorkPlatForm/MainPage/Mot/MotEvent/ExecutionModal';
import Execution from '../../../../../components/WorkPlatForm/MainPage/Mot/x/Execution';
import RemindMessageDropTaskModal from './RemindMessageDropTaskModal';
import FetchDataTable from '../../../../../components/Common/FetchDataTable';
import { fetchRmndEventList, fetchReadRmndEvent } from '../../../../../services/basicservices/index';
import ServiceRecord from '../../../../../components/WorkPlatForm/MainPage/Customer/MyCustomer/Buttons/ServiceRecord';
import LBFrameModal from '../../../../../components/Common/BasicModal/LBFrameModal';
import { EncryptBase64 } from '../../../../../components/Common/Encrypt';
import { FetchLivebosLink } from '../../../../../services/amslb/user';
import styles from './style.less';
import ActivityAuditContent from '../../../../../components/WorkPlatForm/MainPage/DigitalMarketing/activityAudit/content';
import BasicModal from '../../../../../components/Common/BasicModal';
import FeedbackModal from './Feedback/FeedbackModal';

class RemindMessageDropTabItem extends React.Component {
  state = {
    motVisible: false,
    taskVisible: false,
    item: {},
    feedbackModalVisible: false,
    feedbackLbUrl: '',
    titleSubName: '',
    rmndId: '',
    actVisible: false, // 活动审批
    feedbackVisible: false, // 反馈弹窗
  }
  onOpen = (type) => {
    if (type === '3') {
      this.setState({ motVisible: true });
    } else if (type < 3) {
      this.setState({ taskVisible: true });
    }
  };
  onClose = (type, rmndId) => {
    if (type === '3') {
      this.setState({ motVisible: false });
    } else if (type < 3) {
      this.setState({ taskVisible: false });
    }
    this.handleRmdMessageClick(rmndId);
  };

  // 已读操作
  handleRmdMessageClick = (rmndId) => {
    const { tabCode } = this.props;
    fetchReadRmndEvent({ rmndId, clCode: tabCode }).then((response) => {
      const { code = -1 } = response;
      if (code > 0) {
        this.fetchTableData();
        const { onRefresh } = this.props;
        if (onRefresh) onRefresh();
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  fetchTableData = () => {
    const { tabCode, isread = 0 } = this.props;
    const fetch = {
      service: fetchRmndEventList,
      params: {
        clCode: tabCode,
        rdFlg: isread,
      },
    };
    if (this.table) this.table.fetchTableData({ fetch });
  }
  assembleColumns = () => {
    const _this = this;
    return [
      {
        title: '任务类别',
        dataIndex: 'objNm',
        key: 'dxlxmc',
        render: (text, record) => {
          return <span style={{ color: `${record.rdFlg === '1' ? '' : '#54a9df'}` }} >{text || '--'}</span>;
        },
      },
      {
        title: '提醒类型',
        dataIndex: 'rmndTpNm',
        key: 'txlxmc',
        render: (text, record) => {
          return <span style={{ color: `${record.rdFlg === '1' ? '' : '#54a9df'}` }} >{text || '--'}</span>;
        },
      },
      {
        title: '内容',
        dataIndex: 'cntnt',
        key: 'nr',
        className: `${styles.maxWidth}`,
        render: (text, record) => {
          let subedText = (text && text.length > 20 ? <span style={{ color: `${record.rdFlg === '1' ? '' : '#54a9df'}` }} title={text}>{text.substring(0, 20)}...</span> : <span style={{ color: `${record.rdFlg === '1' ? '' : '#54a9df'}` }} title={text}>{text || '--'}</span>);
          if (record.objTp === '6' && text) {
            const { lnkParm: linkJson = '', rmndId } = record;
            const linkObj = JSON.parse(linkJson) || {};
            subedText = (
              <div className={styles.pleaseCheck}>
                {subedText}
                <a onClick={() => { this.setState({ rmndId }); this.hrefToLb(linkObj); }}>
                  {
                    linkObj.flag === '1' ? <span>请处理</span> : <span>请查看</span>
                  }
                </a>
              </div>
            );
          }
          return subedText;
        },
      },
      {
        title: '提醒时间',
        dataIndex: 'rmndTm',
        key: 'txsj',
        render: (text, record) => {
          return <span style={{ color: `${record.rdFlg === '1' ? '' : '#54a9df'}` }} >{text || '--'}</span>;
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (_, record) => {
          const { lnkParm = '{}', objTp = '', rmndId = '', rdFlg = '', objId = '' } = record;
          if (rdFlg === '1') {
            return (<div >已读</div>);
          }
          if (objTp <= 3) return (<a onClick={() => { _this.setState({ item: record }, () => { _this.onOpen(objTp); }); }} style={{ color: '#54a9df' }}>执行</a>);
          let LJCS = {};
          try {
            LJCS = JSON.parse(lnkParm);
          } catch (e) {
            // do nothing
          }
          const { khid = '' } = LJCS;
          // 判断 objTp === '5' 的话就把 yyb 和 yf 以及 rmndId 这3个参数带到薪酬首页
          let tmpl = '';
          if (lnkParm !== '') {
            const paramObj = {
              yf: LJCS.jsyf,
              yyb: LJCS.yyb,
              rmndId,
            };
            tmpl = EncryptBase64(JSON.stringify(paramObj));
          }
          if (objTp === '5') return (<a href={`/#/salary/paramMain/${tmpl}`} style={{ color: '#54a9df' }}>执行</a>);
          if (objTp === '6') {
            const linkObj = JSON.parse(lnkParm) || {};
            const { flag } = linkObj;
            if (flag === '1') {
              return (<a onClick={() => { this.setState({ rmndId }); this.hrefToLb(linkObj); }} style={{ color: '#54a9df' }}>执行</a>);
            }
            return (<a onClick={() => { this.setState({ rmndId }); this.handleRmdMessageClick(rmndId); }} style={{ color: '#54a9df' }}>已读</a>);
          }
          if (objTp === '7') { // 活动审批
            if (rdFlg === '0') {
              return (<a onClick={() => this.handleActClick(rmndId, objId)} style={{ color: '#54a9df' }}>执行</a>);
            }
            return (<a style={{ color: '#54a9df' }}>已读</a>);
          }
          if (objTp === '8' || objTp === '10') { // 反馈
            return (<a onClick={() =>{ this.setState({ feedbackVisible: true, item: record, rmndId }); console.info('rmndId', rmndId); } } style={{ color: '#54a9df' }}>执行</a>);
          }
          return (
            <ServiceRecord
              handleRmdMessageClick={() => this.handleRmdMessageClick(rmndId)}
              cancel={() => this.handleRmdMessageClick(rmndId)}
              selectedCount={1}
              sceneId="1"
              queryParameter={{}}
              selectAll={false}
              selectedRowKeys={[khid]}
              dictionary={_this.props.dictionary}
              render={<a style={{ color: '#54a9df' }}>执行</a>}
            />
          );
        },
      },
    ];
  }

  // 跳转到livebos页面
  hrefToLb = (obj = {}) => {
    const { method, object, ID, flag } = obj;
    FetchLivebosLink({
      method,
      object,
      params: { ID },
    }).then((ret = {}) => {
      const { code = 0, data = '' } = ret;
      if (code > 0) {
        this.setState({
          feedbackModalVisible: true,
          feedbackLbUrl: `${localStorage.getItem('livebos') || ''}${data}`,
          titleSubName: flag === '1' ? '处理' : '查看',
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  onFeedBackLbMessage = (messageObj) => { // iframe的回调事件
    const { rmndId } = this.state;
    if (!messageObj) { // 取消事件，对应 LiveBOS `operateCancel`
      this.setState({ feedbackModalVisible: false });
    } else { // 操作完成事件，对应 LiveBOS `operateCallback`
      this.setState({ feedbackModalVisible: false });
    }
    this.handleRmdMessageClick(rmndId);
  }
  // 活动审批-执行按钮
  handleActClick =(rmndId, objId) => {
    this.setState({ rmndId, actVisible: true, actId: objId });
  }
  handleCancel = () => {
    const { rmndId } = this.state;
    this.setState({ actVisible: false });
    this.handleRmdMessageClick(rmndId);
  }

  // 反馈弹窗关闭
  handleFeedBackCancel = () => {
    this.setState({ feedbackVisible: false });
    console.info('this.state.rmndId', this.state.rmndId);
    this.handleRmdMessageClick(this.state.rmndId || '');
  }

  render() {
    const { item = {}, feedbackModalVisible = false, feedbackLbUrl = '', titleSubName = '', actVisible = false } = this.state;
    const { lnkParm = '{}', objTp = '' } = item;
    let khid = '';
    let sjid = '';
    let motlx = '';
    if (objTp === '3' || objTp === '4') {
      let LJCS = {};
      try {
        LJCS = JSON.parse(lnkParm);
      } catch (e) {
        // do nothing
      }
      const { khid: khh = '', rwid = '', motlx: motlxData = '' } = LJCS;
      khid = khh;
      sjid = rwid;
      motlx = motlxData;
    }
    const { tabCode, isread = 0, dictionary = {} } = this.props;
    const { HDDYZT = [] } = dictionary;
    const tableProps = {
      rowKey: record => record.rmndId,
      rowClassName: (record, chosenRowKey) => `${record.objId === chosenRowKey ? 'active' : ''}`,
      columns: this.assembleColumns(),
      fetch: {
        service: fetchRmndEventList,
        params: {
          clCode: tabCode,
          rdFlg: isread,
        },
      },
      rowSelection: null,
      pagination: {
        className: 'm-paging',
        pageSize: 10,
        showSizeChanger: false,
      },
    };
    const actModalProps = {
      width: '80rem',
      title: '活动审批',
      style: { top: '2rem' },
      visible: actVisible,
      footer: null,
      onCancel: this.handleCancel,
    };
    const modalProps = {
      width: '70rem',
      title: '标签反馈',
      style: { top: '2rem' },
      visible: this.state.feedbackVisible,
      // confirmLoading,
      onCancel: () => this.handleFeedBackCancel(),
      footer: null,
    };
    return (
      <Fragment>
        <FetchDataTable
          className="m-table-customer"
          ref={(n) => { this.table = n; }}
          {...tableProps}
        />
        <ExecutionModal
          title="事件执行-客户维度"
          visible={this.state.motVisible}
          onCancel={() => this.onClose(item.objTp, item.rmndId)}
          width={document.body.clientWidth}
          height={document.body.clientHeight}
          style={{ top: '0rem', overflow: 'auto', paddingBottom: '0px' }}
        >
          {this.state.motVisible && (
            <Execution
              type={1} // 客户维度执行
              queryParams={{ sjid, khh: khid || '', ksrq: '', jsrq: '', khid, motlx }}
            />
          )}
        </ExecutionModal>
        <ExecutionModal
          title="自定义任务"
          visible={this.state.taskVisible}
          onCancel={() => this.onClose(item.objTp, item.rmndId)}
          width={document.body.clientWidth}
          height={document.body.clientHeight}
          style={{ top: '0rem', overflow: 'auto', paddingBottom: '0px' }}
          destroyOnClose
        >
          {this.state.taskVisible && <RemindMessageDropTaskModal data={item.lnkParm} height={document.body.clientHeight} rmndId={item.rmndId} onClose={this.onClose} />}
        </ExecutionModal>
        {/* <LBFrameModal
          modalProps={{
            style: {
              overflowY: 'auto',
              top: '2rem',
            },
            destroyOnClose: true,
            title: `用户反馈 - ${titleSubName}`,
            width: '60rem',
            height: '50rem',
            visible: feedbackModalVisible,
            onCancel: () => {
              this.setState({ feedbackModalVisible: false });
              this.handleRmdMessageClick(this.state.rmndId);
            },
          }}
          frameProps={{
            height: '45rem',
            src: feedbackLbUrl,
            onMessage: this.onFeedBackLbMessage,
          }}
        /> */}
        <BasicModal {...modalProps} >
          <FeedbackModal record={this.state.item} handleCancel={this.handleFeedBackCancel} />
        </BasicModal>
        <BasicModal {...actModalProps}>
          <ActivityAuditContent actId={this.state.actId} sceneType={1} HDDYZT={HDDYZT} dictionary={dictionary} refreshData={this.handleCancel} />
        </BasicModal>
      </Fragment>
    );
  }
}

export default RemindMessageDropTabItem;
