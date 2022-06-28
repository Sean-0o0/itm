import React, { Component } from 'react';
import { EncryptBase64 } from '../../../../../../Common/Encrypt';
import { Col } from 'antd';

class AssessmentListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  onClick = (data = {}) => {
    // if (data.status === '2') {
    //   message.warning('该考评状态下不可查看');
    //   return;
    // }
    // if (data.step === '1' || data.step === '') {
      const params = {
        examPgmId: data.examPgmId || '',
        year: data.year || '',
        adpatScoreType: data.adpatScoreType || '',
        status: data.status || '',
        examPgmName: data.examPgmName || '',
        orgNo: data.orgNo || '',
        orgName: data.orgName || '',
        examType: data.examType || '',
        disabled: false,
      };
      if (data.status === '2') {
        params.disabled = true;
      }
      window.location.href = `/#/esa/evaluation/v2/variousTypeScore/${EncryptBase64(JSON.stringify(params))}`
    // }
  }

  render() {
    const { image, data = {} } = this.props;
    return (
      <Col span={6} className="esa-evaluate-list-item-v2" onClick={() => this.onClick(data)}>
        {data.status === '2' && <div className="assessed-tag" style={{ background: "#ffc107" }}>已提交</div>}
        {data.status === '0' && <div className="assessed-tag" style={{ background: "#f44336" }}>未打分</div>}
        {data.status === '1' && <div className="assessed-tag" style={{ background: "#9e9e9e" }}>保存草稿中</div>}
        <div className="item-image">
          <img src={image} alt="" />
        </div>
        <div className="item-description">{data.scorType || ''}</div>
      </Col>
    );
  }
}

export default AssessmentListItem;