import { Row, Col, Carousel, Empty, message, Tooltip } from 'antd';
import React from 'react';
import BridgeModel from "../../../Common/BasicModal/BridgeModel";
import icon_01 from "../../../../image/pms/fastFunction/icon_01.png";
import icon_02 from "../../../../image/pms/fastFunction/icon_02.png";
import icon_03 from "../../../../image/pms/fastFunction/icon_03.png";
import icon_04 from "../../../../image/pms/fastFunction/icon_04.png";
import icon_05 from "../../../../image/pms/fastFunction/icon_05.png";
import icon_06 from "../../../../image/pms/fastFunction/icon_06.png";
import icon_07 from "../../../../image/pms/fastFunction/icon_07.png";
import icon_08 from "../../../../image/pms/fastFunction/icon_08.png";
import icon_09 from "../../../../image/pms/fastFunction/icon_09.png";
import icon_10 from "../../../../image/pms/fastFunction/icon_10.png";
import icon_11 from "../../../../image/pms/fastFunction/icon_11.png";
import icon_12 from "../../../../image/pms/fastFunction/icon_12.png";
import { FetchQueryOwnerMessage } from '../../../../services/pmsServices';
import moment from 'moment';

class FastFunction extends React.Component {
  state = {
    fileAddVisible: false,
    manageVisible: false,
    fileAddUrl: '/OperateProcessor?operate=TXMXX_XMXX_NEWPROGRAM&Table=TXMXX_XMXX',
    // manageUrl: '/OperateProcessor?operate=TFX_JBXX_ADD&Table=TFX_JBXX',
    curSliderKey: 0,
  };
  sliderRef = React.createRef(null);

  closeFileAddModal = () => {
    this.setState({
      fileAddVisible: false,
    });
  };

  closeManageModal = () => {
    this.setState({
      manageVisible: false,
    });
  };

  render() {
    const { fileAddVisible, fileAddUrl, manageVisible, manageUrl, curSliderKey } = this.state;
    const { sliderData } = this.props;
    const fileAddModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      title: '新建项目',
      width: '70%',
      height: '125rem',
      style: { top: '5%' },
      visible: fileAddVisible,
      footer: null,
    };
    const manageModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '100rem',
      height: '53rem',
      title: '流程中心',
      style: { top: '10rem' },
      visible: manageVisible,
      footer: null,
    };
    const src_fileAdd = localStorage.getItem('livebos') + fileAddUrl;
    const src_manage = localStorage.getItem('livebos') + manageUrl;
    return (
      <div className='workBench'>
        <div className='fast-function'>
          <div className='top-box'>
            <div className='title-box'>
              <img className='title-icon' src={require('../../../../image/pms/fastFunction/title-bell.png')} alt=''></img>
              预算提醒
            </div>
            {sliderData?.length !== 0 && curSliderKey !== 0 && <img className='last-icon' onClick={() => this.sliderRef.current.prev()} src={require('../../../../image/pms/fastFunction/last@2x.png')} alt=''></img>}
            {sliderData?.length !== 0 && curSliderKey !== (sliderData?.length - 1) && <img className='next-icon' onClick={() => this.sliderRef.current.next()} src={require('../../../../image/pms/fastFunction/next@2x.png')} alt=''></img>}
            <Carousel ref={this.sliderRef} afterChange={(e) => this.setState({ curSliderKey: e })} autoplay={true}>
              {sliderData?.map((item, index) => {
                return (<div className='slider-box' key={index}>
                  <div className='title'>
                    <span className='title-txt'>{item.xmmc}</span>
                    <div className='title-time'>{moment(item.txrq).format('YYYY-MM')}</div>
                  </div>
                  <Tooltip title={item.txnr}>
                    <div className='content-box'>{item.txnr}</div>
                  </Tooltip>
                </div>)
              })}
            </Carousel>
            {sliderData?.length === 0 && <Empty description={"暂无提醒"} imageStyle={{ height: '56px' }} />}
          </div>
          <div className='bottom-box'>
            {fileAddVisible &&
              <BridgeModel modalProps={fileAddModalProps} onSucess={() => {
                this.props.fetchQueryOwnerProjectList();
                message.success('执行成功', 1);
              }} onCancel={this.closeFileAddModal}
                src={src_fileAdd} />}
            <Row className='workBench'>
              <Col xs={24} sm={24} lg={24} xl={24} className='fastFun'
                style={{ display: 'flex' }}>
                <div style={{ width: '25%', height: '33%', display: 'grid', justifyContent: 'center', textAlign: 'center' }}
                  onClick={() => this.setState({ fileAddVisible: true })}>
                  <div><img src={icon_01} alt="" style={{ width: '7.143rem', height: '7.143rem' }} /></div>
                  <div className='fastFun-head' style={{ margin: '1.19rem 0 0 0', fontSize: '2.083rem' }} >新建项目</div>
                </div>
                <div style={{ width: '25%', height: '33%', display: 'grid', justifyContent: 'center', textAlign: 'center' }}
                  onClick={() => window.location.href = `/#/UIProcessor?Table=XMXX&hideTitlebar=true`}>
                  <div><img src={icon_02} alt="" style={{ width: '7.143rem', height: '7.143rem' }} />
                  </div>
                  <div className='fastFun-head' style={{ margin: '1.19rem 0 0 0', fontSize: '2.083rem' }}>项目信息</div>
                </div>
                <div style={{ width: '25%', height: '33%', display: 'grid', justifyContent: 'center', textAlign: 'center' }}
                  onClick={() => window.location.href = `/#/pms/manage/LifeCycleManagement`} >
                  <div><img src={icon_05} alt="" style={{ width: '7.143rem', height: '7.143rem' }} /></div>
                  <div className='fastFun-head' style={{ margin: '1.19rem 0 0 0', fontSize: '2.083rem' }}>生命周期
                  </div>
                </div>
                <div style={{ width: '25%', height: '33%', display: 'grid', justifyContent: 'center', textAlign: 'center' }}
                  onClick={() => window.location.href = `/#/UIProcessor?Table=V_WDCX&hideTitlebar=true`}>
                  <div><img src={icon_03} alt="" style={{ width: '7.143rem', height: '7.143rem' }} />
                  </div>
                  <div className='fastFun-head' style={{ margin: '1.19rem 0 0 0', fontSize: '2.083rem' }}>文档管理</div>
                </div>
              </Col>
              <Col xs={24} sm={24} lg={24} xl={24} className='fastFun' style={{ display: 'flex', marginTop: '3.3688rem' }}>
                <div style={{ width: '25%', height: '33%', display: 'grid', justifyContent: 'center', textAlign: 'center' }}
                  onClick={() => window.location.href = `/#/UIProcessor?Table=V_YSXMTJ&hideTitlebar=true`}>
                  <div><img src={icon_08} alt="" style={{ width: '7.143rem', height: '7.143rem' }} />
                  </div>
                  <div className='fastFun-head' style={{ margin: '1.19rem 0 0 0', fontSize: '2.083rem' }}>预算开销</div>
                </div>
                <div style={{ width: '25%', height: '33%', display: 'grid', justifyContent: 'center', textAlign: 'center' }}
                  onClick={() => window.location.href = `/#/UIProcessor?Table=ZBYBTX&hideTitlebar=true`}>
                  <div><img src={icon_04} alt="" style={{ width: '7.143rem', height: '7.143rem' }} />
                  </div>
                  <div className='fastFun-head' style={{ margin: '1.19rem 0 0 0', fontSize: '2.083rem' }} >周报填写</div>
                </div>
                <div style={{ width: '25%', height: '33%', display: 'grid', justifyContent: 'center', textAlign: 'center' }}
                  onClick={() => window.location.href = `/#/pms/manage/WeeklyReportTable`}>
                  <div><img src={icon_06} alt="" style={{ width: '7.143rem', height: '7.143rem' }} /></div>
                  <div className='fastFun-head' style={{ margin: '1.19rem 0 0 0', fontSize: '2.083rem' }}>周报汇总</div>
                </div>
                <div style={{ width: '25%', height: '33%', display: 'grid', justifyContent: 'center', textAlign: 'center' }}
                  onClick={() => window.location.href = `/#/UIProcessor?Table=KHJFY&hideTitlebar=true`}>
                  <div><img src={icon_07} alt="" style={{ width: '7.143rem', height: '7.143rem' }} />
                  </div>
                  <div className='fastFun-head' style={{ margin: '1.19rem 0 0 0', fontSize: '2.083rem' }}>外包费用</div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

export default FastFunction;
