import { Row, Col, Carousel, Empty, message, Tooltip, Modal } from 'antd';
import React from 'react';
import {EncryptBase64} from '../../../Common/Encrypt';
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
import {FetchQueryOwnerMessage} from '../../../../services/pmsServices';
import moment from 'moment';
import ProcessSituation from '../ProcessSituation';
import NewProjectModelV2 from "../../../../pages/workPlatForm/singlePage/NewProjectModelV2";
import BasicModal from "../../../Common/BasicModal";

class FastFunction extends React.Component {
  state = {
    fileAddVisible: false,
    manageVisible: false,
    fileAddUrl: '/OperateProcessor?operate=TXMXX_XMXX_NEWPROGRAM&Table=TXMXX_XMXX',
    // manageUrl: '/OperateProcessor?operate=TFX_JBXX_ADD&Table=TFX_JBXX',
    curSliderKey: 0,
  };
  sliderRef = React.createRef(null);

  componentDidMount() {
    window.addEventListener('message', this.handleIframePostMessage)
  }
  handleIframePostMessage = (event) => {
    if (typeof event.data !== 'string' && event.data.operate === 'close') {
      this.closeFileAddModal();
    }
    if (typeof event.data !== 'string' && event.data.operate === 'success') {
      this.closeFileAddModal();
      // message.success('保存成功');
      //projectId跳转到生命周期页面
      const handleType = sessionStorage.getItem("projectId")
      if (handleType === '1') {
        const params = {
          projectId: sessionStorage.getItem("projectId"),
        }
        window.location.href = `/#/pms/manage/LifeCycleManagement/${EncryptBase64(JSON.stringify(params))}`
      }
    }
  };


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
    const { sliderData, data, total, fetchQueryOwnerWorkflow } = this.props;
    const fileAddModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      title: '新建项目',
      width: '70%',
      height: '95vh',
      style: {top: '2rem'},
      visible: fileAddVisible,
      footer: null,
    };
    const manageModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '60%',
      height: '53rem',
      title: '流程中心',
      style: { top: '10rem' },
      visible: manageVisible,
      footer: null,
    };
    // const src_fileAdd = localStorage.getItem('livebos') + fileAddUrl;
    const src_fileAdd = `/#/single/pms/SaveProject/${EncryptBase64(JSON.stringify({ xmid: -1, type: true }))}`;
    const src_manage = localStorage.getItem('livebos') + manageUrl;
    return (
      <div className='workBench'>
        <div className='fast-function'>
          <div className='top-box'>
            {fileAddVisible &&
              <BridgeModel isSpining="customize" modalProps={fileAddModalProps} onSucess={() => {
                this.closeFileAddModal();
                message.success('保存成功', 1);
              }} onCancel={this.closeFileAddModal}
                src={src_fileAdd} />}
            <div className="top-box-title" style={{width: '100%'}}>
              <div style={{display: 'flex',}}>
                <i className="top-box-title-i iconfont icon-send"/>
                <div className="top-box-title-div" style={{height: '10%'}}>快捷入口
                </div>
              </div>
            </div>
            <Col xs={24} sm={24} lg={24} xl={24} className='fastFun' style={{display: 'flex'}}>
              <a className="fastFun-a" style={{width: '25%'}}
                 onClick={() => this.setState({fileAddVisible: true})}>
                <div><img src={icon_01} alt="" style={{}}/></div>
                <div className='fastFun-head'>新建项目</div>
              </a>
              <a className="fastFun-a" style={{width: '25%'}}
                 onClick={() => window.location.href = `/#/UIProcessor?Table=ZBYBTX&hideTitlebar=true`}>
                <div><img src={icon_04} alt="" style={{}}/>
                </div>
                <div className='fastFun-head'>月报填写</div>
              </a>
            </Col>
          </div>
          <div className='bottom-box'>
            <ProcessSituation data={data} fetchQueryOwnerWorkflow={fetchQueryOwnerWorkflow} total={total} />
          </div>
        </div>
      </div>
    );
  }
}

export default FastFunction;
