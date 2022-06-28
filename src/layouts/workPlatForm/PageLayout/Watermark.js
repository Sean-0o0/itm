import React from 'react';

class Watermark extends React.Component {
  componentDidMount() {
    const { userBasicInfo: { name = '', userid = '' } } = this.props;
    this.getWM({ content: `${userid} ${name}` });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { userBasicInfo: preInfo } = this.props;
    const { userBasicInfo: aftInfo } = nextProps;
    if (JSON.stringify(preInfo) !== JSON.stringify(aftInfo)) {
      const { name = '', userid = '' } = aftInfo;
      this.getWM({ content: `${userid} ${name}` });
    }
  }

  getWM = (payload) => {
    const op = {
      content: `text`,
      rotate: -30,
      font: '36px microsoft yahei',
      width: 900,
      height: 400,
      ...payload,
    };
    this.generateWatermask(op);
  }

  generateWatermask = (op) => {
    //默认设置
    const options = {
      container: document.getElementById('htmlContent'),
      width: 400,
      height: 300,
      textAlign: 'center',
      textBaseline: 'bottom',
      font: '20px microsoft yahei',
      fillStyle: 'rgba(184, 184, 184, 0.3)',
      content: 'text',
      rotate: 30,
      zIndex: 1000,
    };
    //采用配置项替换默认值
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
    const ctx = canvas.getContext("2d");

    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.font = font;
    ctx.fillStyle = fillStyle;
    ctx.rotate(Math.PI / 180 * rotate);
    ctx.fillText(content, parseFloat(width) / 3, height);

    const base64Url = canvas.toDataURL();
    const watermarkDiv = document.createElement("div");
    watermarkDiv.setAttribute('style', `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: ${zIndex};
            pointer-events: none;
            background-repeat: repeat;
            overflow: hidden;
            background-image: url('${base64Url}')`
    );
    container.style.position = 'relative';
    container.insertBefore(watermarkDiv, container.firstChild);
  }

  render() {
    return null;
  }
}

export default Watermark;
