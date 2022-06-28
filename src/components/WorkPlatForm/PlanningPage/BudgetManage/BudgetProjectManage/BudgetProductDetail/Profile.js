import React from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import { getDictKey } from '../../../../../../utils/dictUtils';

class Profile extends React.Component {
  render() {
    const { rightData, dictionary } = this.props;

    const { settObj = '', calLvl = '', status = '', warningVal = '', payClass = '', payRemark = '',
      isExbt = '', isExbtName = '', exbtType = '', exbtTypeName = '', qryProc, crspForm } = rightData;
    const {
      [getDictKey('YSLB')]: xclbList = [], // 获取预算类别
    } = dictionary;
    const jsjbList = [{ note: '一级', ibm: '1' }, { note: '二级', ibm: '2' }, { note: '三级', ibm: '3' }, { note: '四级', ibm: '4' }, { note: '五级', ibm: '5' }, { note: '六级', ibm: '6' }, { note: '七级', ibm: '7' }, { note: '八级', ibm: '8' }, { note: '九级', ibm: '9' }];
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
              <span><span className="red">*</span>&nbsp;项目类别:</span>
            </div>
            <div className="m-basic-control-wrapper">
              <div className="m-basic-item-control">
                <span className="m-basic-text">{xclbNote || '--'}</span>
              </div>
            </div>
          </div>
        </Col>
        {/* <Col sm={8}>
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
        </Col> */}
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
        {/* <Col sm={8}>
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
        </Col>} }
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
        </Col>*/}
        <Col sm={16}>
          <div className="m-basic-info m-basic-pay">
            <div className="m-basic-label" >
              <span>项目说明:</span>
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
