import React from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import { getDictKey } from '../../../../../../../utils/dictUtils';

class Profile extends React.Component {
  render() {
    const { rightData, dictionary } = this.props;

    const { settObj = '', calLvl = '', status = '', warningVal = '', payClass = '', payRemark = '',
      isExbt = '', isExbtName = '', exbtType = '', exbtTypeName = '', qryProc, crspForm } = rightData;
    const {
      [getDictKey('YSLB')]: xclbList = [], // 获取薪酬类别
      [getDictKey('CAL_LVL')]: jsjbList = [], // 计算级别
    } = dictionary;
    let xclbNote = '';
    if (xclbList !== null && xclbList.length > 0) {
      xclbList.forEach((element) => {
        const { ibm, note } = element;
        if (ibm === payClass) {
          xclbNote = note;
        }
      });
    }

    let jsjbNote = '';
    jsjbList.forEach((element) => {
      const { ibm, note } = element;
      if (ibm === calLvl) {
        jsjbNote = note;
      }
    });
    return (
      <Row >
        <Col sm={8}>
          <div className="m-basic-info m-basic-pay">
            <div className="m-basic-label">
              <span><span className="red">*</span>&nbsp;薪酬类别:</span>
            </div>
            <div className="m-basic-control-wrapper">
              <div className="m-basic-item-control">
                <span className="m-basic-text">{xclbNote || '--'}</span>
              </div>
            </div>
          </div>
        </Col>
        <Col sm={8}>
          <div className="m-basic-info m-basic-pay">
            <div className="m-basic-label">
              <span><span className="red">*</span>&nbsp;结算对象:</span>
            </div>
            <div className="m-basic-control-wrapper">
              <div className="m-basic-item-control">
                <span className="m-basic-text">{settObj || '--'}</span>
              </div>
            </div>
          </div>
        </Col>
        <Col sm={8}>
          <div className="m-basic-info m-basic-pay">
            <div className="m-basic-label" style={{ width: '10.16rem' }}>
              <span><span className="red">*</span>&nbsp;数值预警上限制:</span>
            </div>
            <div className="m-basic-control-wrapper">
              <div className="m-basic-item-control">
                <span className="m-basic-text">{warningVal || '--'}</span>
              </div>
            </div>
          </div>
        </Col>
        <Col sm={8}>
          <div className="m-basic-info m-basic-pay">
            <div className="m-basic-label">
              <span><span className="red">*</span>&nbsp;计算级别:</span>
            </div>
            <div className="m-basic-control-wrapper">
              <div className="m-basic-item-control">
                <span className="m-basic-text">{jsjbNote || '--'}</span>
              </div>
            </div>
          </div>
        </Col>
        <Col sm={8}>
          <div className="m-basic-info m-basic-pay">
            <div className="m-basic-label">
              <span><span className="red">*</span>&nbsp;启用状态:</span>
            </div>
            <div className="m-basic-control-wrapper">
              <div className="m-basic-item-control">
                <span className="m-basic-text">{status || '--'}</span>
              </div>
            </div>
          </div>
        </Col>
        <Col sm={8}>
          <div className="m-basic-info m-basic-pay">
            <div className="m-basic-label">
              <span><span className="red">*</span>&nbsp;是否展示:</span>
            </div>
            <div className="m-basic-control-wrapper">
              <div className="m-basic-item-control">
                <span className="m-basic-text">{isExbtName || '--'}</span>
              </div>
            </div>
          </div>
        </Col>
        {isExbt === '1' && <Col sm={8}>
          <div className="m-basic-info m-basic-pay">
            <div className="m-basic-label">
              <span><span className="red">*</span>&nbsp;展示方式:</span>
            </div>
            <div className="m-basic-control-wrapper">
              <div className="m-basic-item-control">
                <span className="m-basic-text">{exbtTypeName || '--'}</span>
              </div>
            </div>
          </div>
        </Col>}
        {isExbt === '1' && exbtType === '1' && <Col sm={8}>
          <div className="m-basic-info m-basic-pay">
            <div className="m-basic-label">
              <span><span className="red">*</span>&nbsp;查询过程:</span>
            </div>
            <div className="m-basic-control-wrapper">
              <div className="m-basic-item-control">
                <span className="m-basic-text">{qryProc || '--'}</span>
              </div>
            </div>
          </div>
        </Col>}
        {isExbt === '1' && exbtType === '2' && <Col sm={8}>
          <div className="m-basic-info m-basic-pay">
            <div className="m-basic-label">
              <span><span className="red">*</span>&nbsp;自定义报表:</span>
            </div>
            <div className="m-basic-control-wrapper">
              <div className="m-basic-item-control">
                <span className="m-basic-text">{crspForm || '--'}</span>
              </div>
            </div>
          </div>
        </Col>}
        <Col sm={24}>
          <div className="m-basic-info m-basic-pay">
            <div className="m-basic-label">
              <span>薪酬说明:</span>
            </div>
            <div className="m-basic-control-wrapper">
              <div className="m-basic-item-control">
                <span className="m-basic-text">{payRemark || '--'}</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    );
  }
}
export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(Profile);
