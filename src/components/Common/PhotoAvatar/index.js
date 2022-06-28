import React, { Component } from 'react';
import { Slider, Button } from 'antd';
import AvatarEditor from 'react-avatar-editor';
import Dropzone from 'react-dropzone';

/**
 * 图片截取组件
 * 入参props: image：默认图片
 *            width：组件宽度
 *            height：组件高度
 *            savePhoto: 点击保存后的回调事件，将截取后的图片64位编码返回
 */
let dropzoneRef;
class PhotoAvatar extends Component {
  state = {
    scaleValue: 1, // 图片大小比例
    rotateValue: 0,
    image: this.props.image || '',
    displayAvatar: 'none',
  }
  onChange = (value) => {
    this.setState({
      scaleValue: value,
    });
  }

  onClickSave = () => {
    if (this.state.image !== '') {
      const img = this.editor.getImageScaledToCanvas().toDataURL();
      const rect = this.editor.getCroppingRect();// eslint-disable-line
      // console.info(img, rect); // 返回截取后的图片base64位编码
      if (this.props.savePhoto) {
        this.props.savePhoto(img);
      }
    }
  }
  setEditorRef = (editor) => { (this.editor = editor); };

  turnPosition = (value) => {
    this.setState({
      rotateValue: (this.state.rotateValue + value),
    });
  }

  handleDrop = (dropped) => {
    this.setState({ image: dropped[0], displayAvatar: 'block' });
  }

  render() {
    return (
      <div>
        <Button type="primary" onClick={() => { dropzoneRef.open(); }}>Primary</Button>
        <Dropzone
          ref={(node) => { dropzoneRef = node; }}
          onDrop={this.handleDrop}
          accept="image/*"
          disableClick
          multiple={false}
          style={{ width: '250px', height: '250px' }}
        >
          {/* <p style={{ display: (this.state.displayAvatar === 'block' ? 'none' : '') }}>点击添加图片</p> */}
          <div style={{ display: (this.state.displayAvatar === 'block' ? '' : 'none') }}>
            <AvatarEditor
              ref={this.setEditorRef}
              image={this.state.image}
              width={this.props.width || 250}
              height={this.props.height || 250}
              border={0}
              color={[255, 255, 255, 0.6]} // RGBA
              scale={this.state.scaleValue} // 图片大小比例
              rotate={this.state.rotateValue} // 图片旋转
            // borderRadius={125}
            />
          </div>
        </Dropzone>
        <Slider style={{ width: '20rem' }} disabled={!this.state.image} onChange={this.onChange} min={1} max={10} value={this.state.scaleValue} />
        旋转:<Button type="primary" onClick={() => this.turnPosition(-90)} >左转</Button> <Button type="primary" onClick={() => this.turnPosition(90)}>右转</Button>
        <Button type="primary" onClick={this.onClickSave}>保存图片</Button>
      </div>
    );
  }
}


export default PhotoAvatar;
