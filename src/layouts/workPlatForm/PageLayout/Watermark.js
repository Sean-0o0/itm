import React from 'react';
import styles from './index.less';

class Watermark extends React.Component {
  componentDidMount() {
    const { userBasicInfo: { name = '', userid = '' }, elementID = 'htmlContent' } = this.props;
    this.getWM({ content: `${userid} ${name}` });
    // 绑定浏览器滚动条
    // const htmlContent = document.getElementById(elementID);
    // htmlContent.addEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const { elementID = 'htmlContent' } = this.props;
    const htmlContent = document.getElementById(elementID);
    const wmContent = document.getElementById('watermarkDiv');
    if (htmlContent && wmContent) {
      wmContent.scrollTop = htmlContent.scrollTop;
    }
  }

  getWM = (payload) => {
    const op = {
      content: 'text',
      rotate: -30,
      font: '30px microsoft yahei',
      width: 400,
      height: 300,
      ...payload,
    };
    // 生成新水印
    this.generateWatermask(op);
  }

  generateWatermask = (op) => {
    // 默认设置
    const options = {
      container: document.getElementById('watermarkDiv'),
      width: 200,
      height: 150,
      textAlign: 'center',
      textBaseline: 'bottom',
      font: '20px microsoft yahei',
      fillStyle: 'rgba(184, 184, 184, 0.2)',
      content: 'text',
      rotate: 30,
      zIndex: 1000,
    };
    // 采用配置项替换默认值
    const opKeys = Object.keys(op);
    opKeys.forEach((key) => {
      if (options[key]) {
        options[key] = op[key];
      }
    });

    const { container, width, height, textAlign, textBaseline, font, fillStyle, content, rotate, zIndex } = options;

    const canvas = document.createElement('canvas');

    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    canvas.setAttribute('margin-top', 50);
    const ctx = canvas.getContext('2d');

    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.font = font;
    ctx.fillStyle = fillStyle;
    ctx.rotate(Math.PI / 180 * rotate);
    ctx.fillText(content, parseFloat(width) / 3, height);

    const base64Url = canvas.toDataURL();
    const watermarkDiv = document.createElement('div');
    watermarkDiv.setAttribute('style', `
          width: 100%;
          height: 8000px;
          pointer-events: none;
          background-repeat: repeat;
          background-image: url('${base64Url}')`
    );
    // container.style.position = 'relative';
    container.insertBefore(watermarkDiv, container.firstChild);
  }

  render() {
    return (
      <div className={styles.watermarkDiv}>
        <div id="watermarkDiv" />
      </div>
    );
  }
}

export default Watermark;
