import React from 'react';
import BasicModal from '../../../../../components/Common/BasicModal';
import avatorPng from '../../../../../assets/blank.jpg';
import AvatorCanvas from './AvatorCanvas';

class Avator extends React.Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({ visible: true });
  }

  handleClose = () => {
    this.setState({ visible: false });
  }

  showDefaultImgError = (e) => {
    e.target.src = avatorPng;
  }

  render() {
    const { visible } = this.state;
    const { avatorShowPic = '', dispatch, forceRender } = this.props;
    return (
      <React.Fragment>
        <img src={avatorShowPic} alt="avator" title="点击修改头像" onError={this.showDefaultImgError} onClick={this.showModal} />
        <BasicModal
          width="50rem"
          style={{ top: '2rem' }}
          title="修改头像"
          visible={visible}
          onCancel={this.handleClose}
          footer={null}
        >
          <AvatorCanvas dispatch={dispatch} forceRender={forceRender} onCancel={this.handleClose} showPic={avatorShowPic} />
        </BasicModal>
      </React.Fragment>
    );
  }
}

export default Avator;
