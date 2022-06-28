import React from 'react';
import { Button, message } from 'antd';
import LBFrameModal from '../../../../../../Common/BasicModal/LBFrameModal';
import { LoadAssessPlanData } from '../../../../../../../services/planning/planning';
import { connect } from 'dva';

class OperationList extends React.Component {
  state = {
    livebosUrl: '',
    visible: false,
    title: '',
    type: '',
    height:'',
  };

  importIndex = () => {
    this.setState({
      livebosUrl: `${localStorage.getItem('livebos') || ''}/OperateProcessor?operate=LoadExcel&Table=TCOMPANY_BUSPLAN_TEMP`,
      title: '导入经营指标',
      type: 3,
      height:'15rem'
    }, () => {
      this.showModal();
    });
  };

  importWork = () => {
    this.setState({
      livebosUrl: `${localStorage.getItem('livebos') || ''}/OperateProcessor?operate=LoadExcel&Table=TCOMBUSPLAN_KEYWORK_TEMP`,
      title: '导入重点工作',
      type: 4,
      height:'15rem'
    }, () => {
      this.showModal();
    });
  };

  importIndexMould = () => {
    this.setState({
      livebosUrl: `${localStorage.getItem('livebos') || ''}/OperateProcessor?operate=TCOMPANY_BUSPLAN_TEMP_M&Table=TCOMPANY_BUSPLAN_TEMP`,
      title: '经营指标模板下载',
      height:'27rem'
    }, () => {
      this.showModal();
    });
  };

  importWorkMould = () => {
    this.setState({
      livebosUrl: `${localStorage.getItem('livebos') || ''}/OperateProcessor?operate=TCOMBUSPLAN_KEYWORK_TEMP_M&Table=TCOMBUSPLAN_KEYWORK_TEMP`,
      title: ' 重点工作模板下载',
      height:'27rem'
    }, () => {
      this.showModal();
    });
  };


  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  closeModal = () => {
    this.setState({
      visible: false,
      livebosUrl: '',
      title: '--',
    });
  };

  onEditMessage = (messageObj) => { // iframe的回调事件
    if (!messageObj) { // 取消事件，对应 LiveBOS `operateCancel`
      this.closeModal();
    } else { // 操作完成事件，对应 LiveBOS `operateCallback`
      // LoadAssessPlanData({
      //     type: this.state.type,
      //     yr: new Date().getFullYear()
      // }).then((ret) => {
      //     const { code = 0 } = ret;
      //     if (code > 0) {
      //         this.closeModal();
      //         message.success('修改成功');
      //         this.props.refresh&&this.props.refresh()
      //     }

      // })
      this.closeModal();
      message.success('导入成功');
      this.props.refresh && this.props.refresh();
    }
  };

  render() {
    const { livebosUrl } = this.state;
    const { companyBusPlan = [] } = this.props;

    return (
      <div className='ip-tab1-operation'>
        {companyBusPlan.includes('companyBusPlanIndi')
        && <Button style={{ flexShrink: 0, marginLeft: '2rem' }}
                   className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c'
                   onClick={this.importIndex}>导入经营指标</Button>
        }
        {companyBusPlan.includes('companyBusPlanKeywork')
        && <Button style={{ flexShrink: 0, marginLeft: '1rem' }}
                   className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c'
                   onClick={this.importWork}>导入重点工作</Button>
        }
        {companyBusPlan.includes('companyBusPlanIndiTmpl')
        && <Button style={{ flexShrink: 0, marginLeft: '1rem' }}
                   className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c'
                   onClick={this.importIndexMould}>经营指标模版下载</Button>
        }
        {companyBusPlan.includes('companyBusPlanKeyworkTmpl')
        && <Button style={{ flexShrink: 0, marginLeft: '1rem' }}
                   className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c'
                   onClick={this.importWorkMould}>重点工作模版下载</Button>
        }
        {/* <Button style={{ marginLeft: '1rem' }}>导出</Button> */}
        {/* 导入 */}
        <LBFrameModal
          modalProps={{
            style: { overflowY: 'auto', top: '10rem' },
            destroyOnClose: true,
            title: this.state.title,
            width: '60rem',
            height: '50rem',
            visible: this.state.visible,
            onCancel: this.closeModal,
          }}
          frameProps={{
            height: this.state.height,
            src: this.state.livebosUrl,
            onMessage: this.onEditMessage,
          }}
        />
      </div>
    );
  }
}

export default OperationList;
