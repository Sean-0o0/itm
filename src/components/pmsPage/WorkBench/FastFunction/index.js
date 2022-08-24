import {Row, Col,} from 'antd';
import React from 'react';
import BridgeModel from "../../../Common/BasicModal/BridgeModel";

class FastFunction extends React.Component {
  state = {
    fileAddVisible: false,
    manageVisible: false,
    fileAddUrl: '/OperateProcessor?operate=TXMXX_XMXX_NEWPROGRAM&Table=TXMXX_XMXX',
    // manageUrl: '/OperateProcessor?operate=TFX_JBXX_ADD&Table=TFX_JBXX',
  };

  componentDidMount() {
  }

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

  //成功回调
  onSuccess = () => {

  }

  render() {
    const {fileAddVisible, fileAddUrl, manageVisible, manageUrl} = this.state;
    const fileAddModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '180rem',
      height: '100rem',
      title: '新建项目',
      style: {top: '10rem'},
      visible: fileAddVisible,
      footer: null,
    };
    const manageModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '100rem',
      height: '53rem',
      title: '流程中心',
      style: {top: '10rem'},
      visible: manageVisible,
      footer: null,
    };
    const src_fileAdd = localStorage.getItem('livebos') + fileAddUrl;
    const src_manage = localStorage.getItem('livebos') + manageUrl;
    return (
      <Col className='workBench' style={{height: '75%', margin: '4.5rem 0rem 5rem 6rem'}}>
        <Col xs={24} sm={24} lg={24} xl={24} className='fastFun'
             style={{margin: '1rem', paddingBottom: '3rem', display: 'flex', height: '33%',}}>
          <div style={{width: '25%', height: '33%', float: 'left', textAlign: 'center'}}>
            <div className='fastFun-head'>
              <div className='fastFun-head-title'
                   style={{background: 'linear-gradient(315deg, #3361FF 0%, #629AFF 100%)'}}>
                <div className='fastFun-head-cont'>
                  <i style={{color: 'white'}} className="iconfont icon-file-add" onClick={() => {
                    this.setState({fileAddVisible: true,})
                  }}/>
                </div>
              </div>
            </div>
            <div className='fastFun-head' onClick={() => {
              this.setState({fileAddVisible: true,})
            }}>新建项目
            </div>
            {fileAddVisible &&
            <BridgeModel modalProps={fileAddModalProps} onSucess={this.onSuccess} onCancel={this.closeFileAddModal}
                         src={src_fileAdd}/>}
          </div>
          <div style={{width: '25%', height: '33%', float: 'left', textAlign: 'center'}}>
            <div className='fastFun-head'>
              <div className='fastFun-head-title'
                   style={{background: 'linear-gradient(138deg, #FDD329 0%, #F9A812 100%)'}}>
                <div className='fastFun-head-cont'>
                  <i style={{color: 'white'}} className="iconfont icon-search" onClick={() => {
                    window.location.href = `/#/UIProcessor?Table=XMXX&hideTitlebar=true`;
                  }}/>
                </div>
              </div>
            </div>
            <div className='fastFun-head' onClick={() => {
              window.location.href = `/#/UIProcessor?Table=XMXX&hideTitlebar=true`;
            }}>项目信息
            </div>
          </div>
          <div style={{width: '25%', height: '33%', float: 'left', textAlign: 'center'}}>
            <div className='fastFun-head'>
              <div className='fastFun-head-title'
                   style={{background: 'linear-gradient(135deg, #A4ACFF 0%, #6B74FF 100%)'}}>
                <div className='fastFun-head-cont'>
                  <i style={{color: 'white'}} className="iconfont icon-file-search" onClick={() => {
                    window.location.href = `/#/UIProcessor?Table=WORKFLOW_TOTASKS`;
                  }}/>
                </div>
              </div>
            </div>
            <div className='fastFun-head' onClick={() => {
              window.location.href = `/#/UIProcessor?Table=WORKFLOW_TOTASKS`;
            }}>流程中心
            </div>
            {/*{manageVisible &&*/}
            {/*<BridgeModel modalProps={manageModalProps} onSucess={this.onSuccess} onCancel={this.closeManageModal}*/}
            {/*             src={src_manage}/>}*/}
          </div>
          <div style={{width: '25%', height: '33%', float: 'left', textAlign: 'center'}}>
            <div className='fastFun-head'>
              <div className='fastFun-head-title'
                   style={{background: 'linear-gradient(137deg, #FF8693 0%, #D70E19 100%)'}}>
                <div className='fastFun-head-cont'>
                  <i style={{color: 'white'}} className="iconfont icon-date" onClick={() => {
                    window.location.href = `/#/pms/manage/LifeCycleManagement`
                  }}/>
                </div>
              </div>
            </div>
            <div className='fastFun-head' onClick={() => {
              window.location.href = `/#/pms/manage/LifeCycleManagement`
            }}>查询进度
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} lg={24} xl={24} className='fastFun'
             style={{margin: '1rem', paddingBottom: '3rem', height: '33%'}}>
          <div style={{width: '25%', height: '33%', float: 'left', textAlign: 'center'}}>
            <div className='fastFun-head'>
              <div className='fastFun-head-title'
                   style={{background: 'linear-gradient(138deg, #FDD329 0%, #F9A812 100%)'}}>
                <div className='fastFun-head-cont'>
                  <i style={{color: 'white'}} className="iconfont icon-procedure" onClick={() => {
                    window.location.href = `/#/UIProcessor?Table=ZBXYSLR&hideTitlebar=true`
                  }}/>
                </div>
              </div>
            </div>
            <div className='fastFun-head' onClick={() => {
              window.location.href = `/#/UIProcessor?Table=ZBXYSLR&hideTitlebar=true`
            }}>管理预算
            </div>
          </div>
          <div style={{width: '25%', height: '33%', float: 'left', textAlign: 'center'}}>
            <div className='fastFun-head'>
              <div className='fastFun-head-title'
                   style={{background: 'linear-gradient(137deg, #FF8693 0%, #D70E19 100%)'}}>
                <div className='fastFun-head-cont'>
                  <i style={{color: 'white'}} className="iconfont icon-reloadtime" onClick={() => {
                    window.location.href = `/#/UIProcessor?Table=V_YSXMTJ&hideTitlebar=true`
                  }}/>
                </div>
              </div>
            </div>
            <div className='fastFun-head' onClick={() => {
              window.location.href = `/#/UIProcessor?Table=V_YSXMTJ&hideTitlebar=true`
            }}>预算开销
            </div>
          </div>
          <div style={{width: '25%', height: '33%', float: 'left', textAlign: 'center'}}>
            <div className='fastFun-head'>
              <div className='fastFun-head-title'
                   style={{background: 'linear-gradient(315deg, #3361FF 0%, #629AFF 100%)'}}>
                <div className='fastFun-head-cont'>
                  <i style={{color: 'white'}} className="iconfont icon-file-fillout"
                     onClick={() => {
                       window.location.href = `/#/UIProcessor?Table=V_XMFKXX&hideTitlebar=true`
                     }}/>
                </div>
              </div>
            </div>
            <div className='fastFun-head' onClick={() => {
              window.location.href = `/#/UIProcessor?Table=V_XMFKXX&hideTitlebar=true`
            }}>付款详情
            </div>
          </div>
          <div style={{width: '25%', height: '33%', float: 'left', textAlign: 'center'}}>
            <div className='fastFun-head'>
              <div className='fastFun-head-title'
                   style={{background: 'linear-gradient(138deg, #FDD329 0%, #F9A812 100%)'}}>
                <div className='fastFun-head-cont'>
                  <i style={{color: 'white'}} className="iconfont icon-finance" onClick={() => {
                    window.location.href = `/#/UIProcessor?Table=V_RYGSGL&hideTitlebar=true`
                  }}/>
                </div>
              </div>
            </div>
            <div className='fastFun-head' onClick={() => {
              window.location.href = `/#/UIProcessor?Table=V_RYGSGL&hideTitlebar=true`
            }}>工时登记
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} lg={24} xl={24} className='fastFun'
             style={{margin: '1rem', paddingBottom: '3rem', height: '33%'}}>
          <div style={{width: '25%', height: '33%', float: 'left', textAlign: 'center'}}>
            <div className='fastFun-head'>
              <div className='fastFun-head-title'
                   style={{background: 'linear-gradient(138deg, #FDD329 0%, #F9A812 100%)'}}>
                <div className='fastFun-head-cont'>
                  <i style={{color: 'white'}} className="iconfont icon-workbench" onClick={() => {
                    window.location.href = `/#/UIProcessor?Table=ZBTX&hideTitlebar=true`
                  }}/>
                </div>
              </div>
            </div>
            <div className='fastFun-head' onClick={() => {
              window.location.href = `/#/UIProcessor?Table=ZBTX&hideTitlebar=true`
            }}>周报填写
            </div>
          </div>
          <div style={{width: '25%', height: '33%', float: 'left', textAlign: 'center'}}>
            <div className='fastFun-head'>
              <div className='fastFun-head-title'
                   style={{background: 'linear-gradient(315deg, #3361FF 0%, #629AFF 100%)'}}>
                <div className='fastFun-head-cont'>
                  <i style={{color: 'white'}} className="iconfont icon-flag" onClick={() => {
                    window.location.href = `/#/UIProcessor?Table=YBGL&hideTitlebar=true`
                  }}/>
                </div>
              </div>
            </div>
            <div className='fastFun-head' onClick={() => {
              window.location.href = `/#/UIProcessor?Table=YBGL&hideTitlebar=true`
            }}>月报填写
            </div>
          </div>
          <div style={{width: '25%', height: '33%', float: 'left', textAlign: 'center'}}>
            <div className='fastFun-head'>
              <div className='fastFun-head-title'
                   style={{background: 'linear-gradient(137deg, #FF8693 0%, #D70E19 100%)'}}>
                <div className='fastFun-head-cont'>
                  <i style={{color: 'white'}} className="iconfont icon-riskrecord" onClick={() => {
                    window.location.href = `/#/UIProcessor?Table=V_WDCX&hideTitlebar=true`
                  }}/>
                </div>
              </div>
            </div>
            <div className='fastFun-head' onClick={() => {
              window.location.href = `/#/UIProcessor?Table=V_WDCX&hideTitlebar=true`
            }}>项目文档
            </div>
          </div>
          <div style={{width: '25%', height: '33%', float: 'left', textAlign: 'center'}}>
            <div className='fastFun-head'>
              <div className='fastFun-head-title'
                   style={{background: 'linear-gradient(138deg, #FDD329 0%, #F9A812 100%)'}}>
                <div className='fastFun-head-cont'>
                  <i style={{color: 'white'}} className="iconfont icon-billquery" onClick={() => {
                    window.location.href = `/#/UIProcessor?Table=V_RYXX`
                  }}/>
                </div>
              </div>
            </div>
            <div className='fastFun-head' onClick={() => {
              window.location.href = `/#/UIProcessor?Table=V_RYXX`
            }}>外包人员
            </div>
          </div>
        </Col>
      </Col>
    );
  }
}

export default FastFunction;
