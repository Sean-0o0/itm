import React from 'react';
import { Button } from 'antd';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import eventUtils from 'livebos-frame/dist/utils/event';
import RecentlyVisiteUtils from '../../../../../../../utils/recentlyVisiteUtils';
import LBFrameModal from '../../../../../../../components/Common/BasicModal/LBFrameModal';

class StaffManagementTabButton extends React.Component {
  state = {
    buttonShow: 'none',
    showIframe: false,
    visible: false,
  }
  componentWillMount() {
    eventUtils.attachEvent('message', this.onMessage);
  }
  onMessage = (event) => { // iframe的回调事件
    const { success: sc = false } = event || {};
    let msg = {};
    try {
      msg = JSON.parse(event.data);
      if (!msg) {
        this.handleCancel();
      } else {
        const { success: sc1 = false, data: { success } } = msg;
        const { onRefresh } = this.props;
        if (onRefresh && (sc || sc1 || success)) { // 操作完成后,刷新消息提醒条数
          onRefresh();
        }
        this.handleCancel();
      }
    } catch (ignored) {
      this.handleCancel();
      return;
    }
    switch (msg.type) {
      case 'sessionTimeout':
        window.location.href = '/#/login';
        break;
      default:
        break;
    }
  }
  handleMouseIn = () => {
    this.setState({ buttonShow: 'inline-block' });
  }
  handleMouseOut = () => {
    this.setState({ buttonShow: 'none' });
  }
  handleTitleClick = (e, ljdz, dkfs, mc, flag) => {
    if (ljdz !== '' && ljdz !== '--' && flag) {
      switch (dkfs) {
        case '1':
          this.setState({ showIframe: true, visible: true });
          break;
        case '3':
          if (mc) {
            RecentlyVisiteUtils.saveRecentlyVisiteUtils(ljdz, '', mc);
          }
          window.open(`/#${ljdz}`, '_self');
          break;
        default:
          window.open(`${localStorage.getItem('livebos') || 'livebos'}${ljdz}`, '_blank');
      }
    }
  }
  handleButtonClick = (e, ljdz, mc = '') => {
    if (ljdz !== '' && ljdz !== '--') {
      RecentlyVisiteUtils.saveRecentlyVisiteUtils(ljdz, '', mc);
      window.location.href = `/#${ljdz}`;
    }
  }
  handleCancel = () => {
    this.setState({ visible: false });
  }

  isContains = (authorities, name, code) => {
    let flag = 0;
    const { userBasicInfo = {} } = this.props;
    const { userid = '' } = userBasicInfo
    for (let key in authorities) {
      if (authorities[key] && Array.isArray(authorities[key])) {
        flag = 0;
        if (key === code) {
          const [opert] = authorities[key].slice(-1);
          if (typeof opert === 'number' && !isNaN(opert)) {
            const result = opert & 4096;
            if (result !== 0) {
              flag = 1;
            }
          }
        }else{
          authorities[key].forEach(ele => {
            if (ele === name) {
              flag = 1;
            }
          }
          )
        }
        if (flag === 1) {
          break;
        }
      }
    }
    if (flag === 1 || userid === 'admin') {
      return true
    }
    return false
  }

  render() {
    const colors = ['blue', 'pink', 'orange'];
    const { item = {}, authorities = [] } = this.props;
    const { buttonShow, showIframe, visible } = this.state;
    let index = 0;
    const title = item.xsmc;
    const modalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      style: {
        overflowY: 'auto',
        top: '5rem',
      },
      destroyOnClose: true,
      title: `${title}`,
      width: '120rem',
      height: '90rem',
      visible,
      // onOk: this.handleOk,
      onCancel: this.handleCancel,
    };
    const frameProps = {
      src: `${localStorage.getItem('livebos') || 'livebos'}${item.ljdz}`,
      height: '70rem',
      onMessage: this.onMessage,
    };

    return (
      // <li key={item.id} onMouseEnter={this.handleMouseIn} onMouseLeave={this.handleMouseOut}>
      //   <a onClick={(e) => { this.handleTitleClick(e, item.ljdz, item.dkfs, item.xsmc); }} className=""><span className={`${styles.overflow}`} title={item.xsmc}>{item.xsmc === '' ? '--' : item.xsmc}</span></a>
      //   <div className="m-btn-box" style={{ opacity: 1, display: buttonShow, paddingLeft: '0' }}>
      //     {(item.fj1dz !== '' && Object.hasOwnProperty.call(authorities, item.fj1qx)) && (
      //     <Button
      //       className={`m-btn-border m-btn-small m-btn-border-${colors[index++ % 3]} ant-btn btn-1c ${item.fj1tb}`}
      //       onClick={e => this.handleButtonClick(e, item.fj1dz, item.xsmc)}
      //       // style={{ marginRight: '0.5rem' }}
      //       style={{ margin: '0 0 0 1rem', padding: '0' }}
      //     >
      //       {item.fj1mc}
      //     </Button>)}
      //     {(item.fj2dz !== '' && Object.hasOwnProperty.call(authorities, item.fj2qx)) && (
      //     <Button
      //       className={`m-btn-border m-btn-small m-btn-border-${colors[index++ % 3]} ant-btn btn-1c ${item.fj2tb}`}
      //       onClick={e => this.handleButtonClick(e, item.fj2dz, item.xsmc)}
      //       // style={{ marginRight: '0.5rem' }}
      //       style={{ margin: '0 0 0 1rem', padding: '0' }}
      //     >
      //       {item.fj2mc}
      //     </Button>)}
      //     {(item.fj3dz !== '' && Object.hasOwnProperty.call(authorities, item.fj3qx)) && (
      //     <Button
      //       className={`m-btn-border m-btn-small m-btn-border-${colors[index++ % 3]} ant-btn btn-1c ${item.fj3tb}`}
      //       onClick={e => this.handleButtonClick(e, item.fj3dz, item.xsmc)}
      //       // style={{ marginRight: '0.5rem' }}
      //       style={{ margin: '0 0 0 1rem', padding: '0' }}
      //     >
      //       {item.fj3mc}
      //     </Button>)}
      //   </div>
      //   {showIframe && (<LBFrameModal modalProps={modalProps} frameProps={frameProps} />)}
      // </li>
      <li key={item.id} onMouseEnter={this.handleMouseIn} onMouseLeave={this.handleMouseOut}>
        <a onClick={(e) => { this.handleTitleClick(e, item.ljdz, item.dkfs, item.xsmc, this.isContains(authorities, item.qxbm, item.tbys)); }} className=""><span title={this.isContains(authorities, item.qxbm, item.tbys) ? item.xsmc : '暂无权限'} style={{ color: this.isContains(authorities, item.qxbm, item.tbys) ? '#333' : '#AAA' }}>{item.xsmc === '' ? '--' : item.xsmc}</span></a>
        <div className="m-btn-box" style={{ opacity: 1, display: buttonShow, paddingLeft: '0' }}>
          {(item.fj1dz !== '' && Object.hasOwnProperty.call(authorities, item.fj1qx)) && (
            <Button
              className={`m-btn-border m-btn-small m-btn-border-${colors[index++ % 3]} ant-btn btn-1c ${item.fj1tb}`}
              onClick={e => this.handleButtonClick(e, item.fj1dz, item.xsmc)}
              // style={{ marginRight: '0.5rem' }}
              style={{ margin: '0 0 0 1rem', padding: '0' }}
            >
              {item.fj1mc}
            </Button>)}
          {(item.fj2dz !== '' && Object.hasOwnProperty.call(authorities, item.fj2qx)) && (
            <Button
              className={`m-btn-border m-btn-small m-btn-border-${colors[index++ % 3]} ant-btn btn-1c ${item.fj2tb}`}
              onClick={e => this.handleButtonClick(e, item.fj2dz, item.xsmc)}
              // style={{ marginRight: '0.5rem' }}
              style={{ margin: '0 0 0 1rem', padding: '0' }}
            >
              {item.fj2mc}
            </Button>)}
          {(item.fj3dz !== '' && Object.hasOwnProperty.call(authorities, item.fj3qx)) && (
            <Button
              className={`m-btn-border m-btn-small m-btn-border-${colors[index++ % 3]} ant-btn btn-1c ${item.fj3tb}`}
              onClick={e => this.handleButtonClick(e, item.fj3dz, item.xsmc)}
              // style={{ marginRight: '0.5rem' }}
              style={{ margin: '0 0 0 1rem', padding: '0' }}
            >
              {item.fj3mc}
            </Button>)}
        </div>
        {showIframe && (<LBFrameModal modalProps={modalProps} frameProps={frameProps} />)}
      </li>
    );
  }
}
export default connect(({ global }) => ({
  userBasicInfo: global.userBasicInfo,
}))(withRouter(StaffManagementTabButton));
