import React from 'react';
import { Col, message } from 'antd';
import { Link } from 'umi';
import ExecutionModal from '../../../../../components/WorkPlatForm/MainPage/Mot/MotEvent/ExecutionModal';
import Execution from '../../../../../components/WorkPlatForm/MainPage/Mot/x/Execution';
import styles from './style.less';
import RemindMessageDropTaskModal from './RemindMessageDropTaskModal';
import ServiceRecord from '../../../../../components/WorkPlatForm/MainPage/Customer/MyCustomer/Buttons/ServiceRecord';
import LBFrameModal from '../../../../../components/Common/BasicModal/LBFrameModal';
import { fetchReadRmndEvent } from '../../../../../services/basicservices/index';
import { EncryptBase64 } from '../../../../../components/Common/Encrypt';
import { FetchLivebosLink } from '../../../../../services/amslb/user';
import ActivityAuditContent from '../../../../../components/WorkPlatForm/MainPage/DigitalMarketing/activityAudit/content';
import BasicModal from '../../../../../components/Common/BasicModal';
import FeedbackModal from './Feedback/FeedbackModal';

class RemindMessageDropItem extends React.Component {
  state = {
    motVisible: false,
    taskVisible: false,
    feedbackModalVisible: false,
    feedbackLbUrl: '',
    titleSubName: '',
    rmndId: '',
    actVisible: false, // 活动审批
    feedbackVisible: false, // 反馈回复
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

  // 点击消息之后刷新列表
  handleRmdMessageClick = (rmndId = '') => {
    fetchReadRmndEvent({ rmndId, clCode: this.props.tabCode }).then((response) => {
      const { code = -1 } = response;
      if (code > 0) {
        const { onRefresh } = this.props;
        if (onRefresh) onRefresh();
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 薪酬提醒消息参数处理
  handleXcParams = (str = '') => {
    if (str) {
      const { item: { rmndId = '' } } = this.props;
      const tmplObj = JSON.parse(str);
      const paramObj = {
        rmndId,
        yf: tmplObj.jsyf,
        yyb: tmplObj.yyb,
      };
      const tmpl = JSON.stringify(paramObj);
      return EncryptBase64(tmpl);
    }
    return '';
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

  // 反馈回复弹窗关闭
  onFeedBackCancel = () => {
    const { rmndId } = this.state;
    this.setState({ feedbackVisible: false });
    this.handleRmdMessageClick(rmndId);
  }

  render() {
    const { feedbackModalVisible = false, feedbackLbUrl = '', titleSubName = '', actVisible = false } = this.state;
    const { item = {}, dictionary = [], dictionary: { HDDYZT = [] } } = this.props;
    const tm = item.rmndTm ? item.rmndTm.replace(/[-]/g, '/').substring(0, item.rmndTm.lastIndexOf(':')) : '--';
    const { lnkParm = '', objTp = '', rmndId = '', objId = '' } = item;
    let khid = '';
    let sjid = '';
    let motlx = '';
    if (objTp === '3' || objTp === '4') {
      const LJCS = JSON.parse(lnkParm);
      const { khid: khh = '', rwid = '', motlx: motlxData = '' } = LJCS;
      khid = khh;
      sjid = rwid;
      motlx = motlxData;
    }
    const actModalProps = {
      width: '80rem',
      title: '活动审批',
      style: { top: '2rem' },
      visible: actVisible,
      footer: null,
      onCancel: this.handleCancel,
    };
    const feedBackModalProps = {
      width: '70rem',
      title: '标签反馈',
      style: { top: '2rem' },
      visible: this.state.feedbackVisible,
      // confirmLoading,
      onCancel: () => this.onFeedBackCancel(),
      footer: null,
    };
    return (
      <div className="m-progress-warp" title={item.cntnt}>
        <div className="m-progress-name clearfix">
          <Col span={16} style={{ fontSize: '1.333rem', fontWeight: 'bold' }}>
            {
              (() => {
                if (item.objTp === '4') {
                  return (
                    <ServiceRecord
                      handleRmdMessageClick={() => this.handleRmdMessageClick(rmndId)}
                      cancel={() => this.handleRmdMessageClick(rmndId)}
                      selectedCount={1}
                      sceneId="1"
                      queryParameter={{}}
                      selectAll={false}
                      selectedRowKeys={[khid]}
                      dictionary={dictionary}
                      render={<p className={styles.textOverFlow} style={{ cursor: 'pointer' }}>{item.cntnt || '--'}</p>}
                    // modalWidth={document.body.clientWidth}
                    // modalHeight={document.body.clientHeight}
                    // style={{ top: '0rem', overflow: 'auto', paddingBottom: '0px' }}
                    />
                  );
                } else if (item.objTp === '5') {
                  return (
                    <Link to={`/pay/paramMain/${this.handleXcParams(item.lnkParm)}`} className={styles.textOverFlow} style={{ cursor: 'pointer' }}>
                      {item.cntnt || '--'}
                    </Link>
                  );
                } else if (item.objTp === '6') {
                  const { lnkParm: linkJson = '' } = item;
                  const linkObj = JSON.parse(linkJson) || {};
                  return (
                    <a onClick={() => { this.setState({ rmndId }); this.hrefToLb(linkObj); }} className={styles.textOverFlow} style={{ cursor: 'pointer' }}>
                      {item.cntnt || '--'}
                    </a>
                  );
                } else if (objTp === '7') { // 活动审批
                  return (
                    <p className={styles.textOverFlow} onClick={() => this.handleActClick(rmndId, objId)} style={{ color: '#54a9df' }}>
                      {item.cntnt || '--'}
                    </p>
                  );
                } else if (objTp === '8' || objTp === '10') { // 反馈
                  return (
                    <p className={styles.textOverFlow} style={{ cursor: 'pointer' }} onClick={() => { this.setState({ feedbackVisible: true, record1: item, rmndId: rmndId }); }}>
                      {item.cntnt || '--'}
                    </p>
                  );
                }
                return (
                  <p className={styles.textOverFlow} style={{ cursor: 'pointer' }} onClick={() => { this.onOpen(item.objTp, rmndId); }}>
                    {item.cntnt || '--'}
                  </p>
                );
              })()
            }
          </Col>
          <Col span={8} style={{ fontSize: '1.166rem', fontWeight: 'normal', color: '#8d9ea7', textAlign: 'right' }} >
            {tm}
          </Col>
        </div>
        <ExecutionModal
          title="事件执行-客户维度"
          visible={this.state.motVisible}
          onCancel={() => this.onClose(item.objTp, rmndId)}
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
          onCancel={() => this.onClose(item.objTp, rmndId)}
          width={document.body.clientWidth}
          height={document.body.clientHeight}
          style={{ top: '0rem', overflow: 'auto', paddingBottom: '0px' }}
          destroyOnClose
        >
          {this.state.taskVisible && <RemindMessageDropTaskModal data={item.lnkParm} height={document.body.clientHeight} rmndId={rmndId} onClose={this.onClose} />}
        </ExecutionModal>
        <LBFrameModal
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
        />
        {/* 反馈 */}
        <BasicModal {...feedBackModalProps} >
          <FeedbackModal record={this.state.record1} handleCancel={this.onFeedBackCancel} onRefresh={() => {this.handleRmdMessageClick(this.state.rmndId);}} />
        </BasicModal>
        {/* 活动审批 */}
        <BasicModal {...actModalProps}>
          <ActivityAuditContent actId={this.state.actId} sceneType={1} HDDYZT={HDDYZT} dictionary={dictionary} refreshData={this.handleCancel} />
        </BasicModal>
      </div>
    );
  }
}

export default RemindMessageDropItem;
