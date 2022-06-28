import TWEEN from '@tweenjs/tween.js';
import svgpath from './svgpath';
import chainTweens from './chainTweens';

export default class Sprite {
  constructor({
    ctx,
    d = [],
    fillStyle = 'rgba(0,215,255,1)',
    velocity = 0.1,
    radius = 2.1,
  }) {
    const paths = d.map(str => svgpath(str));

    this.ctx = ctx;
    this.paths = paths;
    this.fillStyle = fillStyle;
    this.velocity = velocity;
    this.radius = radius;
    this.tween = null;
  }

  start = () => {
    if (this.tween) {
      this.tween.stop();
      this.tween = null;
    }

    const tweens = this.paths.map(this.createTween);
    const run = chainTweens(tweens);

    // 所有路径遍历完重新开始
    this.tween = run(this.start);

    return this;
  }

  createTween = (path, index) => {
    // 运动距离
    const len = path.getTotalLength();
    // 运动时间
    const duration = len / this.velocity;
    // 更新位置
    const updater = _object => this.update(index, _object.l);

    const tween = new TWEEN.Tween({ l: 0 });

    tween.to({ l: len }, duration).onUpdate(updater);

    return tween;
  }

  update = (index, l) => {
    const { ctx } = this;
    const path = this.paths[index];
    const dot = path.getPointAtLength(l);

    if (!dot || !ctx) return;

    ctx.save();

    ctx.fillStyle = this.fillStyle;
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
