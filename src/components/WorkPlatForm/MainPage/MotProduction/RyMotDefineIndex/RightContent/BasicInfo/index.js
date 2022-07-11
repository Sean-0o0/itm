/* eslint-disable array-callback-return */
import React, { Fragment } from 'react';
import { Row, Col, Rate } from 'antd';
import { getDictKey } from '../../../../../../../utils/dictUtils';

// 引入请求路径的示例
// import { FetchMotSameBatchList } from '../../../../../services/motProduction';


// 右边内容模块-基本信息
class BasicInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }


  componentWillReceiveProps() {

  }


  render() {
    const { motDetail = {}, dictionary = {}, tgtTp = '', leftPanelList = [], yybList = [] } = this.props;
    // 目标类型
    const { [getDictKey('MOT_TGT_TP')]: tgtTpDicts = [] } = dictionary;
    // 目标类型
    let type = '';
    if (tgtTpDicts.length > 0) {
      tgtTpDicts.some((item) => {
        if (tgtTp === item.ibm) {
          type = item.note;
        }
      });
    }

    // 重要程度
    const { [getDictKey('MOT_IMPT')]: imptDicts = [] } = dictionary;

    let importantCount = 0;
    let importantLevel = 0;
    if (imptDicts.length > 0) {
      importantCount = imptDicts.length;
      switch (Number(motDetail.impt)) {
        case 1: importantLevel = 3; break;
        case 2: importantLevel = 2; break;
        case 3: importantLevel = 1; break;
        default: importantLevel = 0;
      }
    }

    //  计算方式
    const { [getDictKey('MOT_CMPT_MODE')]: cmptModeDicts = [] } = dictionary;

    let jsfs = '';
    cmptModeDicts.forEach((item) => {
      if (motDetail.cmptMode === item.ibm) {
        jsfs = item.note;
      }
    });

    // 所属阶段
    let ssjd = '';
    leftPanelList.forEach((item) => {
      if (item.DIC_CODE === motDetail.sbrdStg) {
        ssjd = item.DIC_NOTE;
      }
    });


    // 适用范围
    const syfw = [];
    let syfwStr = '';
    let syfwArr = [];
    if (motDetail.avlRng !== '') {
      syfwStr = `${motDetail.avlRng}`;
      syfwArr = syfwStr.split(';');
      yybList.forEach((item) => {
        syfwArr.forEach((childItem) => {
          if (item.yybid === childItem) {
            syfw.push(item.yybmc);
          }
        });
      });
    }


    return (
      <Fragment>
        <div >
          <p style={{ color: '#333333', fontWeight: 'bold' }}>基本信息</p>
          <div style={{ padding: '0 0 0 1.5rem' }}>
            <Row style={{ padding: '0 0 1rem 0' }}>
              <span style={{ color: '#999999' }}>目标类型</span>
              <span style={{ padding: '0 0 0 1rem' }}>{type}</span>
            </Row>
            <Row style={{ padding: '0 0 1rem 0' }}>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <span style={{ color: '#999999' }}>所属阶段</span>
                <span style={{ padding: '0 0 0 1rem' }}>{ssjd}</span>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <span style={{ color: '#999999' }}>计算方式</span>
                <span style={{ padding: '0 0 0 1rem' }}>{jsfs}</span>
              </Col>

            </Row>
            <Row style={{ padding: '0 0 1rem 0' }}>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <span style={{ color: '#999999' }}>重要程度</span>
                <span style={{ padding: '0 0 0 1rem' }}><Rate style={{ fontSize: '12px' }} disabled count={importantCount} value={importantLevel} /></span>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <span style={{ color: '#999999' }}>记录最近触发时间</span>
                <span style={{ padding: '0 0 0 1rem' }}>{motDetail.wthrRcd === 0 ? '否' : '是'}</span>
              </Col>

            </Row>
            <Row style={{ padding: '0 0 1rem 0' }}>
              <span style={{ color: '#999999', whiteSpace: 'pre-line' }}>事件描述</span>
              <span style={{ padding: '0 0 0 1rem' }}>{motDetail.evntDesc}</span>
            </Row>
            <Row style={{ padding: '0 0 1rem 0' }}>
              <span style={{ color: '#999999', whiteSpace: 'pre-line' }}>规则说明</span>
              <span style={{ padding: '0 0 0 1rem' }}>{motDetail.ruleExpl}</span>
            </Row>
            <Row style={{ padding: '0 0 1rem 0' }}>
              <span style={{ color: '#999999' }}>适用范围</span>
              <span style={{ padding: '0 0 0 1rem' }}>{syfw.join(' ')}</span>
            </Row>


          </div>
        </div>
      </Fragment>
    );
  }
}

export default BasicInfo;
