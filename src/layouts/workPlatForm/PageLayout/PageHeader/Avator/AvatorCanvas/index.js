import React from 'react';
import AvatarEditor from 'react-avatar-editor';
import { Button, Row, Col, Slider, Icon, message } from 'antd';
import { FetchUploadProto } from '../../../../../../services/commonbase';

class AvatorCanvas extends React.Component {
  state = {
    imageUrl: this.props.showPic || '',
    shapeImg: '', // 截取后的背景图
    avatarProps: {
      scale: 1,
      rotate: 0,
      border: 50,
      width: 200,
      height: 200,
    },
  }

  onScaleChange = (value) => {
    const { avatarProps = {} } = this.state;
    this.setState({
      avatarProps: { ...avatarProps, scale: value },
    });
  }

  onRotateChange = (flag) => {
    const { avatarProps = {} } = this.state;
    const { rotate } = avatarProps;
    this.setState({
      avatarProps: { ...avatarProps, rotate: rotate + (flag * 90) },
    });
  }

  onHeightChange = (value) => {
    const { avatarProps = {} } = this.state;
    this.setState({
      avatarProps: { ...avatarProps, height: value },
    });
  }

  onWidthChange = (value) => {
    const { avatarProps = {} } = this.state;
    this.setState({
      avatarProps: { ...avatarProps, width: value },
    });
  }

  onClickSave = () => {
    const dataURLtoBlob = (dataurl, filename = 'file') => {
      const arr = dataurl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const suffix = mime.split('/')[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      // return new File([u8arr], `${filename}.${suffix}`, { type: mime });
      // IE 不兼容File对象，所以这里用Blob
      const blob = new Blob([u8arr.buffer], { type: mime });
      return { blob, fileName: `${new Date().getTime()}.${suffix}` };
    };
    const { onCancel, forceRender } = this.props;
    if (this.editor) {
      const canvasScaled = this.editor.getImageScaledToCanvas();
      const dataUrl = canvasScaled.toDataURL('image/png') || '';
      const formData = new FormData();
      const fileBlob = dataURLtoBlob(dataUrl);
      formData.append('file', fileBlob.blob, fileBlob.fileName);
      this.constuctStates({
        shapeImg: dataUrl,
      });
      // 保存接口
      FetchUploadProto(formData).then((ret = {}) => {
        const { code = 0, note = '' } = ret;
        if (code > 0) {
          message.success(note);
        }
        if (onCancel) {
          onCancel();
        }
        if (forceRender) {
          forceRender();
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }
  }

  constuctStates = (payload) => {
    this.setState({
      ...this.state,
      ...payload,
    });
  }

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  handleFileChange = () => {
    const { files = [] } = document.getElementById('avatorFile') || {};
    if (files.length === 0) {
      message.error('图片不能为空！');
      return;
    }
    this.getBase64(files[0], (imageUrl) => {
      this.constuctStates({
        imageUrl,
      });
    });
  }

  render() {
    const { imageUrl, avatarProps = {} } = this.state;
    const { border = 0, height = 0, width = 0 } = avatarProps;
    const { onCancel } = this.props;
    const imgWidth = width + (2 * border);
    const imgHeight = height + (2 * border);
    return (
      <div style={{ padding: '2rem' }}>
        <Row>
          <Col span={6}>
            {/* 上传图片 */}
            <div>
              <Button type="primary" style={{ width: '10rem' }}>
                <Icon type="upload" /> 上传文件
              </Button>
              <input
                type="file"
                id="avatorFile"
                accept=".bmp,.jpg,.png"
                onChange={this.handleFileChange}
                style={{ position: 'absolute', left: 0, opacity: 0, width: '10rem' }}
              />
            </div>
            <div style={{ margin: '1.5rem 0' }}>
              <Button type="primary" style={{ width: '10rem' }} onClick={() => { this.onRotateChange(-1); }}>
                <Icon type="undo" /> 向左旋转
              </Button>
            </div>
            <div style={{ margin: '1.5rem 0' }}>
              <Button type="primary" style={{ width: '10rem' }} onClick={() => { this.onRotateChange(1); }}>
                <Icon type="redo" /> 向右旋转
              </Button>
            </div>
          </Col>
          <Col span={18} style={{ padding: '0 0 1.5rem 5rem' }}>
            <div style={{ height: `${imgHeight}px`, width: `${imgWidth}px`, border: '1px solid #ecedee' }}>
              <AvatarEditor
                ref={(editor) => { this.editor = editor; }}
                image={imageUrl}
                onPositionChange={this.onPositionChange}
                {...avatarProps}
              />
            </div>
            <Slider min={1} max={2} step={0.1} onChange={this.onScaleChange} style={{ width: '300px' }} />
          </Col>
        </Row>
        <Row style={{ textAlign: 'center' }}>
          <Button className="m-btn-radius m-btn-headColor" onClick={this.onClickSave}>确 定</Button>
          <Button className="m-btn-radius m-btn-white" onClick={() => onCancel && onCancel()}>取 消</Button>
        </Row>
      </div>
    );
  }
}

export default AvatorCanvas;
