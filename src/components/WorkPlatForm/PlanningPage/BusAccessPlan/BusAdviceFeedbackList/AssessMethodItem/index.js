import React, { Component } from 'react';
import { EncryptBase64 } from '../../../../../Common/Encrypt';
import { Col,Progress } from 'antd';

class AssessMethodItem extends Component {

  onClick = (data = {}) => {
    const params = {
      planId: data.planId || '',
      planType: data.planType || '',
      rollback:false,
    };
    window.location.href = `/#/esa/planning/accessPlanDetail/${EncryptBase64(JSON.stringify(params))}`
  }

  render() {
    const { image, data = {} } = this.props;
    return (
      <Col span={6} className="esa-evaluate-list-item-v3" onClick={() => this.onClick(data)}>
        {data.planStatus === '2' && <div className="assessed-tag" style={{ background: "#ffc107" }}>{data.planStatusName}</div>}
        {data.planStatus === '3' && <div className="assessed-tag" style={{ background: "#A8A8A8" }}>{data.planStatusName}</div>}
        {data.planStatus === '2' &&
              <div className={'rate-warp'}  >
                  <div>
                    <div style={{fontWeight:'bold'}}>总意见数</div>
                    <div class="container">
                      <div class="skills" style={{width: 100+'%',backgroundColor: '#56A7FF'}} >{data.totalNum}</div>
                    </div>
                    <div style={{fontWeight:'bold'}}>已处理数</div>
                    <div class="container">
                      <div class="skills" style={{width: data.dealNum/data.totalNum*100+'%',backgroundColor: data.dealNum>0?'#FE8A8A':'#ddd'}} >{data.dealNum}</div>
                    </div>
                  </div>
              </div>

        }
        {data.planStatus === '3' &&
              <div className={'rate-warp'}  >
                  <div>
                    <div style={{fontWeight:'bold'}}>总意见数</div>
                    <div class="container">
                      <div class="skills" >{data.totalNum}</div>
                    </div>
                    <div style={{fontWeight:'bold'}}>已处理数</div>
                    <div class="container">
                      <div class="skills" >{data.dealNum}</div>
                    </div>
                  </div>
              </div>
        }
        <div className="item-image">
          <img src={image} alt="" />
        </div>
        {data.planStatus !== '3' && <div className="item-description">{data.planName || ''}</div>}
        {data.planStatus === '3' && <div className="item-description" style={{ color: '#A8A8A8' }}>{data.planName || ''}</div>}
      </Col>
    );
  }
}

export default AssessMethodItem;
