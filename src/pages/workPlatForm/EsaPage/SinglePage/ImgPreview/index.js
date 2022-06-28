import React from 'react';
import RcViewer from '@hanyk/rc-viewer';

class ImgPreview extends React.Component {
  componentDidMount() {
    const { viewer } = this.refs.viewer;
    if (viewer) {
      viewer.show();
    }
    this.handleInit();
  }

  handleInit = () => {
    // 设置无法点击关闭
    const vCanvas = document.getElementsByClassName('viewer-canvas') || [];
    if (vCanvas[0]) {
      vCanvas[0].setAttribute('data-viewer-action', 'show');
    }
  }

  getImgUrl = () => {
    const { match: { params: { params = '' } } } = this.props;
    const [table, column, id] = params.split(',');
    return `${localStorage.getItem('livebos') || ''}/OperateProcessor?EVENT_SOURCE=Download&Table=${table}&ID=${id}&Column=${column}&Type=View&fileid=0`;
  }

  render() {
    const options = {
      show: true,
      button: false,
      keyboard: false,
      toolbar: {
        zoomIn: 4,
        zoomOut: 4,
        oneToOne: 4,
        reset: 4,
        play: {
          show: 4,
          size: 'large',
        },
        rotateLeft: 4,
        rotateRight: 4,
        flipHorizontal: 4,
        flipVertical: 4,
      }
    };
    return (
      <div>
        <RcViewer options={options} ref="viewer">
          <ul id="images">
            <li>
              <img src={this.getImgUrl()} alt="" style={{ display: 'none' }} />
            </li>
          </ul>
        </RcViewer>
      </div>
    );
  }
}

export default ImgPreview;
