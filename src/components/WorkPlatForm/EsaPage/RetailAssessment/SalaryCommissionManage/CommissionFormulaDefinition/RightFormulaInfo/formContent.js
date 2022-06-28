/* eslint-disable no-nested-ternary */
import React from 'react';
import { Row, Col } from 'antd';

class FormContent extends React.Component {
  // 分段取值  1|分段选一； 2|分段累加 ；3|单项
  getSeqVal = (key) => {
    let x;
    switch (key) {
      case '1':
        x = '分段选一';
        break;
      case '2':
        x = '分段累加';
        break;
      case '3':
        x = '单项';
        break;
      default:
        x = '--';
        break;
    }
    return x;
  }

  // 结算类型 1|按单户计算;2|按营业部汇总；3|按人员汇总
  getSettType = (key) => {
    let x;
    switch (key) {
      case '1':
        x = '按单户计算';
        break;
      case '2':
        x = '按营业部汇总';
        break;
      case '3':
        x = '按人员汇总';
        break;
      default:
        x = '--';
        break;
    }
    return x;
  }

  checkLength = (str, length) => {
    if (str === '' || str === undefined) {
      return '--';
    } else if (str.length > length) {
      return `${(str).substring(0, length)}...`;
    }
    return str;
  }

  render() {
    const { data } = this.props;
    return (
      <Row type="flex" className="m-task-info-flex">
        <Col sm={24} md={8}>
          <div className="m-basic-info m-basic-small">
            <div className="m-basic-label">
              <span className="darkgray">公式分类:</span>
            </div>
            <div className="m-basic-control-wrapper">
              <div className="m-basic-item-control">
                <span className="m-basic-text">{data.takeClass || '--'}</span>
              </div>
            </div>
          </div>
        </Col>
        <Col sm={24} md={8}>
          <div className="m-basic-info m-basic-small">
            <div className="m-basic-label">
              <span className="darkgray">分段取值方式:</span>
            </div>
            <div className="m-basic-control-wrapper">
              <div className="m-basic-item-control">
                <span className="m-basic-text">{this.getSeqVal(data.segValMode)}</span>
              </div>
            </div>
          </div>
        </Col>
        <Col sm={24} md={8}>
          <div className="m-basic-info m-basic-small">
            <div className="m-basic-label">
              <span className="darkgray">结算类型:</span>
            </div>
            <div className="m-basic-control-wrapper">
              <div className="m-basic-item-control">
                <span className="m-basic-text">{this.getSettType(data.settType)}</span>
              </div>
            </div>
          </div>
        </Col>
        <Col sm={24} md={24}>
          <div className="m-basic-info m-basic-small">
            <div className="m-basic-label">
              <span className="darkgray">公式说明:</span>
            </div>
            <div className="m-basic-control-wrapper">
              <div className="m-basic-item-control">
                <span className="m-basic-text">{data.remk || '--'}</span>
              </div>
            </div>
          </div>
        </Col>
        <Col sm={24} md={24}>
          <div className="m-basic-info m-basic-small">
            <div className="m-basic-label">
              <span className="darkgray">公式描述:</span>
            </div>
            <div className="m-basic-control-wrapper">
              <div className="m-basic-item-control">
                <span className="m-basic-text">{data.fmlaDesc || '--'}</span>
              </div>
            </div>
          </div>
        </Col>
        <Col sm={24} md={8}>
          <div className="m-basic-info m-basic-small">
            <div className="m-basic-label">
              <span className="darkgray">创建日期:</span>
            </div>
            <div className="m-basic-control-wrapper">
              <div className="m-basic-item-control">
                <span className="m-basic-text">{data.crtDate || '--'}</span>
              </div>
            </div>
          </div>
        </Col>
        <Col sm={24} md={8}>
          <div className="m-basic-info m-basic-small">
            <div className="m-basic-label">
              <span className="darkgray">作废标志:</span>
            </div>
            <div className="m-basic-control-wrapper">
              <div className="m-basic-item-control">
                <span className="m-basic-text">{data.cancelFlag === '1' ? '作废' : (data.cancelFlag === '0' ? '正常' : '--')}</span>
              </div>
            </div>
          </div>
        </Col>
        {
          data.cancelFlag === '1' ?
            (
              <Col sm={24} md={8}>
                <div className="m-basic-info m-basic-small">
                  <div className="m-basic-label">
                    <span className="darkgray">作废日期:</span>
                  </div>
                  <div className="m-basic-control-wrapper">
                    <div className="m-basic-item-control">
                      <span className="m-basic-text"><span className="blue">{data.cancelDate || '--'}</span></span>
                    </div>
                  </div>
                </div>
              </Col>
            )
            :
            null
        }
        <Col sm={24} md={8}>
          <div className="m-basic-info m-basic-small">
            <div className="m-basic-label">
              <span className="darkgray">创建人:</span>
            </div>
            <div className="m-basic-control-wrapper">
              <div className="m-basic-item-control">
                <span className="m-basic-text"><span className="blue">{data.creator || '--'}</span></span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    );
  }
}

export default FormContent;
