import React, { PureComponent } from 'react';
import TWEEN from '@tweenjs/tween.js';
import Sprite from './Sprite';
import paths from './paths.json';

export default class TrackCanvas extends PureComponent {
  componentDidMount() {
    const ctx = this.canvas.current.getContext('2d');
    this.ctx = ctx;

    this.sprites = paths.map(options => (
      new Sprite({ ...options, ctx }).start()
    ));

    this.update();
  }

  canvas = React.createRef();

  update = () => {
    requestAnimationFrame(this.update);

    const { ctx } = this;

    if (!ctx) {
      return;
    }

    ctx.globalCompositeOperation = 'destination-in';
    ctx.fillStyle = 'hsla(180, 100%, 50%, 0.89)';
    ctx.fillRect(0, 0, this.props.width, this.props.height);
    ctx.globalCompositeOperation = 'source-over';

    TWEEN.update();
  }

  render() {
    return (
      <canvas ref={this.canvas} {...this.props} />
    );
  }
}
