import React from 'react';
import { Col, message } from 'antd';
import styles from '../style.less';
import { fetchReadRmndEvent } from '../../../../../../services/basicservices/index';
import WorkflowModel from './WorkflowModel';
// import { EncryptBase64 } from '../../../../../../Common/Encrypt';

class WorkflowDropItem extends React.Component {
  state={
  }

  handleRmdMessageClick = (msgId = '') => {
    const { tabCode = '' } = this.props;
    // 点击消息之后刷新列表
    fetchReadRmndEvent({
      rmndId: msgId,
      clCode: tabCode,
    }).then((response) => {
      const { code = -1 } = response;
      if (code > 0) {
        const { onRefresh } = this.props;
        if (onRefresh) onRefresh();
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  render() {
    const { item = {} } = this.props;
    const { link = '{}', msgId } = item;
    let obj = {};
    try {
      obj = JSON.parse(link);
    } catch (e) {
      // do nothing
    }
    const { step = '', instid = '' } = obj;
    const { title = '' } = item;
    return (
      <div className="m-progress-warp" title={title}>
        <div className="m-progress-name clearfix">
          <Col span={16} style={{ fontSize: '1.333rem', fontWeight: 'bold' }}>
            <p className={styles.textOverFlow} onClick={() => { this.Modal.open(); }} style={{ cursor: 'pointer' }}>{item.title || '--'}</p>
          </Col>
          <Col span={8} style={{ fontSize: '1.166rem', fontWeight: 'normal', color: '#8d9ea7', textAlign: 'right' }}>
            {item.rmdTm}
          </Col>
        </div>
        <WorkflowModel ref={(c) => { this.Modal = c; }} data={{ step, instId: instid, msgId }} onRefresh={this.handleRmdMessageClick} />
      </div>
    );
  }
}

export default WorkflowDropItem;
