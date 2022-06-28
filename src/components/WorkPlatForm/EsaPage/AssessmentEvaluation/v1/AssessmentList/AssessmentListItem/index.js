import React, { Component } from 'react';
import { EncryptBase64 } from '../../../../../../Common/Encrypt';
import { message } from 'antd';

class AssessmentListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  onClick = (data = {}) => {
    if (data.status === '2') {
      message.warning('该考评状态下不可查看');
      return;
    }
    const params = {
      examPgmId: data.examPgmId || '',
      year: data.year || '',
      adpatScoreType: data.adpatScoreType || '',
      status: data.status || '',
      examPgmName: data.examPgmName || ''
    };
    if (data.status === '1') {
      window.location.href = `/#/esa/evaluation/v1/assessmentTable/${EncryptBase64(JSON.stringify(params))}`;
    } else {
      window.location.href = `/#/esa/evaluation/v1/assessmentNotice/${EncryptBase64(JSON.stringify(params))}`;
    }
  }

  render() {
    const { image, data = {} } = this.props;
    return (
      <div className="esa-evaluate-list-item" onClick={() => this.onClick(data)}>
        {data.status === '2' && <div className="assessed-tag">已提交</div>}
        {data.status === '0' && <div className="assessed-tag">未打分</div>}
        {data.status === '1' && <div className="assessed-tag">保存草稿中</div>}
        <div className="item-image">
          <img src={image} alt="" />
        </div>
        <div className="item-description">{data.examPgmName || ''}</div>
      </div>
    );
  }
}

export default AssessmentListItem;