import React from 'react';
import moment from 'moment';
import { Link } from 'umi';
import { Col } from 'antd';
import { FetchUserReadMsgRmd } from '../../../../../services/commonbase';
import styles from './style.less';

class MessageDropItem extends React.Component {
  handleReadMsg = (msgId) => {
    const { onRefresh } = this.props;
    FetchUserReadMsgRmd({
      msg_id: msgId || '',
    }).then((ret = {}) => {
      const { code = 0 } = ret;
      if (code > 0) {
        // 刷新数据
        if (onRefresh && typeof onRefresh === 'function') {
          onRefresh.call(this);
        }
      }
    });
  }
  render() {
    const { item = {} } = this.props;
    const tm = item.rmdTm ? moment(item.rmdTm || '').format('YY/M/D HH:mm') : '--';
    return (
      <div className="m-progress-warp" title={item.title}>
        <div className="m-progress-name clearfix">
          <Col span={16} style={{ fontSize: '1.333rem', fontWeight: 'bold', color: '#313131' }}>
            <Link to={item.link} target="_blank" className={styles.textOverFlow} onClick={() => { this.handleReadMsg(item.msgId); }}>
              {item.title || '--'}
            </Link>
          </Col>
          <Col span={8} style={{ fontSize: '1.166rem', fontWeight: 'normal', color: '#8d9ea7', textAlign: 'right' }} >
            {tm}
          </Col>
        </div>
      </div>
    );
  }
}

export default MessageDropItem;
