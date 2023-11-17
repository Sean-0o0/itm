/*
    撒花效果

    必传项
    canvas
    flowersColor    彩带color
    faceColor   笑脸颜色
    eyeColor    眼睛颜色
    mouthColor  笑嘴颜色

    颜色传参格式及描述
    彩带:[[
        '250,174,255-60-11', '244,150,255-80-63', '247,197,255-100-100'
    ], [
        '255,255,255-80-25', '255,169,108-100-100'
    ], [
        '195,255,176-80-0', '69,197,117-100-100'
    ], [
        '79,213,255-80-0', '43,187,250-100-100'
    ]]
    彩带为多种颜色，所以传数组-----每条彩带为线性渐变，所以传二位数组-----250,174,255：rgb三色值---60：透明度---11：线性渐变结束为止百分比
    笑脸：'255,200,44-100'
    255,200,44：rgb三色值---100：透明度

    为保持运动一致，字段精简，笑脸运动基于彩带字段
*/
export default class ScatterFlowers {
  constructor(opts) {
    this.canvas = opts.canvas;
    this.canvas.width = this.canvas.offsetWidth * window.dpr;
    this.canvas.height = this.canvas.offsetHeight * window.dpr;
    this.ctx = opts.canvas.getContext('2d');

    this.flowersColor = opts.flowersColor; // 彩带颜色
    this.flowersLength = opts.flowersLength || Math.floor(this.canvas.offsetWidth / 20); // 彩带个数
    this.flowersWidth =
      (opts.flowersWidth || Math.floor(this.canvas.offsetWidth / 60)) * window.dpr; // 彩带宽度
    this.flowersHeight =
      (opts.flowersHeight || Math.floor(this.canvas.offsetWidth / 20)) * window.dpr; // 彩带长度
    this.flowersArr = []; // 彩带数组

    this.animationFrequency = opts.animationFrequency || 10; // 彩带上升运动步数
    this.animationFrequencyTime = opts.animationFrequencyTime || 10; // 彩带上升运动时间间隔
    this.animationFrequencyEd = 0; // 彩带上升运动当前步数
    this.fallingFrequency = opts.fallingFrequency || 100; // 彩带飘落运动步数
    this.fallingFrequencyTime = opts.fallingFrequencyTime || 10; // 彩带飘落运动时间间隔
    this.fallingSwingNum = opts.fallingSwingNum || 3; // 彩带一次摇摆所需帧长  奇数
    this.fallingSwing = opts.fallingSwing || 0.05; // 彩带摇摆帧步长
    this.fallingFrequencyEd = 0; // 彩带飘落运动当前步数

    this.faceFlag = opts.faceFlag === false ? false : true; // 是否显示笑脸
    this.faceR = opts.faceR; // 笑脸半径
    this.eyeR = opts.eyeR; // 眼睛半径
    this.mouthR = opts.mouthR; // 笑嘴半径
    this.faceColor = opts.faceColor; // 笑脸颜色
    this.eyeColor = opts.eyeColor; // 眼睛颜色
    this.mouthColor = opts.mouthColor; // 笑嘴颜色
    this.faceData = {}; // 笑脸中心坐标

    this.debugStartPoint = opts.debugStartPoint || false;

    this.timer = null;
    this.opts = opts;

    // 是否立即执行
    if (opts.autoStart) {
      this.reStart();
    }
  }
  // 开始或重新开始
  reStart(cb) {
    this.clear();

    this.cb = cb;
    this.initData(this.opts);

    this.animationFrequencyEd = 0; // 彩带上升运动当前步数
    this.fallingFrequencyEd = 0; // 彩带飘落运动当前步数

    this.drawFlowers();
    this.drawFace();
    this.run();
  }
  // 初始话彩带、笑脸数据
  initData(opts) {
    this.start = opts.start || {
      x: this.canvas.width / 2,
      y: (this.canvas.height / 5) * 3,
    };

    this.flowersArr = [];
    for (let i = 0; i < this.flowersLength; i++) {
      // 四象限
      let flag = this.rand(1, 4);
      // 弯曲2次flag
      let bendingFlag = this.rand(0, 1);
      let control = null;
      let control2 = null;
      let end = {};
      let deviation = {};
      if (bendingFlag) {
        switch (flag) {
          case 1:
            control = {
              x: this.rand(this.start.x, this.start.x + this.flowersHeight),
              y: this.rand(this.start.y - this.flowersHeight, this.start.y),
            };
            end = {
              x: this.start.x + this.rand(this.flowersHeight / 2, this.flowersHeight),
              y: this.start.y - this.rand(this.flowersHeight / 2, this.flowersHeight),
            };
            deviation = {
              w: this.flowersWidth,
              h: this.flowersWidth,
            };
            break;
          case 2:
            control = {
              x: this.rand(this.start.x, this.start.x + this.flowersHeight),
              y: this.rand(this.start.y, this.start.y + this.flowersHeight),
            };
            end = {
              x: this.start.x + this.rand(this.flowersHeight / 2, this.flowersHeight),
              y: this.start.y + this.rand(this.flowersHeight / 2, this.flowersHeight),
            };
            deviation = {
              w: this.flowersWidth,
              h: -this.flowersWidth,
            };
            break;
          case 3:
            control = {
              x: this.rand(this.start.x - this.flowersHeight, this.start.x),
              y: this.rand(this.start.y, this.start.y + this.flowersHeight),
            };
            end = {
              x: this.start.x - this.rand(this.flowersHeight / 2, this.flowersHeight),
              y: this.start.y + this.rand(this.flowersHeight / 2, this.flowersHeight),
            };
            deviation = {
              w: this.flowersWidth,
              h: this.flowersWidth,
            };
            break;
          case 4:
            control = {
              x: this.rand(this.start.x - this.flowersHeight, this.start.x),
              y: this.rand(this.start.y - this.flowersHeight, this.start.y),
            };
            end = {
              x: this.start.x - this.rand(this.flowersHeight / 2, this.flowersHeight),
              y: this.start.y - this.rand(this.flowersHeight / 2, this.flowersHeight),
            };
            deviation = {
              w: this.flowersWidth,
              h: -this.flowersWidth,
            };
            break;
        }
      } else {
        let endStartX = 0;
        let endStartY = 0;
        let controlIndex = this.rand(2, 4) / 10;
        let controlIndex2 = this.rand(6, 8) / 10;
        let controlIndexNum = this.rand(2, 3);
        let flowersHeightIndex = 3 / 5;
        switch (flag) {
          case 1:
            end = {
              x:
                this.start.x +
                this.rand(this.flowersHeight, this.flowersHeight * flowersHeightIndex),
              y:
                this.start.y -
                this.rand(this.flowersHeight, this.flowersHeight * flowersHeightIndex),
            };
            endStartX = end.x - this.start.x;
            endStartY = end.y - this.start.y;
            control = {
              x: this.start.x + endStartX * controlIndex + ((endStartY / 3) * controlIndexNum) / 2,
              y: this.start.y + endStartY * controlIndex + (endStartY / 3) * controlIndexNum,
            };
            control2 = {
              x:
                this.start.x + endStartX * controlIndex2 + (endStartY / 3) * (-controlIndexNum / 2),
              y: this.start.y + endStartY * controlIndex2 + (endStartY / 3) * -controlIndexNum,
            };
            deviation = {
              w: this.flowersWidth,
              h: this.flowersWidth,
            };
            break;
          case 2:
            end = {
              x:
                this.start.x +
                this.rand(this.flowersHeight, this.flowersHeight * flowersHeightIndex),
              y:
                this.start.y +
                this.rand(this.flowersHeight, this.flowersHeight * flowersHeightIndex),
            };
            endStartX = end.x - this.start.x;
            endStartY = end.y - this.start.y;
            control = {
              x: this.start.x + endStartX * controlIndex + (endStartY / 3) * (controlIndexNum / 2),
              y: this.start.y + endStartY * controlIndex + (endStartY / 3) * -controlIndexNum,
            };
            control2 = {
              x:
                this.start.x + endStartX * controlIndex2 + (endStartY / 3) * (-controlIndexNum / 2),
              y: this.start.y + endStartY * controlIndex2 + (endStartY / 3) * controlIndexNum,
            };
            deviation = {
              w: this.flowersWidth,
              h: -this.flowersWidth,
            };
            break;
          case 3:
            end = {
              x:
                this.start.x -
                this.rand(this.flowersHeight, this.flowersHeight * flowersHeightIndex),
              y:
                this.start.y +
                this.rand(this.flowersHeight, this.flowersHeight * flowersHeightIndex),
            };
            endStartX = end.x - this.start.x;
            endStartY = end.y - this.start.y;
            control = {
              x: this.start.x + endStartX * controlIndex + ((endStartY / 3) * controlIndexNum) / 2,
              y: this.start.y + endStartY * controlIndex + (endStartY / 3) * controlIndexNum,
            };
            control2 = {
              x:
                this.start.x + endStartX * controlIndex2 + (endStartY / 3) * (-controlIndexNum / 2),
              y: this.start.y + endStartY * controlIndex2 + (endStartY / 3) * -controlIndexNum,
            };
            deviation = {
              w: this.flowersWidth,
              h: this.flowersWidth,
            };
            break;
          case 4:
            end = {
              x:
                this.start.x -
                this.rand(this.flowersHeight, this.flowersHeight * flowersHeightIndex),
              y:
                this.start.y -
                this.rand(this.flowersHeight, this.flowersHeight * flowersHeightIndex),
            };
            endStartX = end.x - this.start.x;
            endStartY = end.y - this.start.y;
            control = {
              x: this.start.x + endStartX * controlIndex + (endStartY / 3) * (controlIndexNum / 2),
              y: this.start.y + endStartY * controlIndex + (endStartY / 3) * -controlIndexNum,
            };
            control2 = {
              x:
                this.start.x + endStartX * controlIndex2 + (endStartY / 3) * (-controlIndexNum / 2),
              y: this.start.y + endStartY * controlIndex2 + (endStartY / 3) * controlIndexNum,
            };
            deviation = {
              w: this.flowersWidth,
              h: -this.flowersWidth,
            };
            break;
        }
      }

      let obj = {
        start: {
          x: this.start.x,
          y: this.start.y,
          x2: this.start.x + deviation.w,
          y2: this.start.y + deviation.h,
        },
        control: {
          x: control.x,
          y: control.y,
          x2: control.x + deviation.w,
          y2: control.y + deviation.h,
        },
        end: {
          x: end.x,
          y: end.y,
          x2: end.x + deviation.w,
          y2: end.y + deviation.h,
        },
        deviation,
        color: this.flowersColor[i % this.flowersColor.length],
        step: {
          x: this.rand(
            -(this.start.x - this.flowersHeight) / this.animationFrequency,
            (this.canvas.width - this.start.x - this.flowersHeight) / this.animationFrequency,
          ),
          y: this.rand(
            -(this.start.y - this.flowersHeight) / this.animationFrequency,
            -(this.start.y - this.canvas.height / 2 + this.flowersHeight) / this.animationFrequency,
          ),
        },
        swingNum: this.rand(-(this.fallingSwingNum - 1) / 2, (this.fallingSwingNum - 1) / 2), // 摇摆当前所在帧
        swing: this.fallingSwing, // 摇摆帧步长
        fallingDeg: opts.fallingDeg || this.rand(15, 30), // 彩带每帧旋转度数
        fallingRange: opts.fallingRange || this.rand(this.flowersWidth / 2, this.flowersWidth), // 彩带每帧偏移
      };
      if (control2) {
        obj.control2 = {
          x: control2.x,
          y: control2.y,
          x2: control2.x + deviation.w,
          y2: control2.y + deviation.h,
        };
      }
      this.flowersArr.push(obj);
    }

    if (this.faceFlag) {
      this.faceData = {
        x: this.start.x,
        y: this.start.y,
        step: {
          x: this.rand(
            -(this.start.x - this.faceR * 2) / this.animationFrequency,
            (this.canvas.width - this.start.x - this.faceR * 2) / this.animationFrequency,
          ),
          y: this.rand(
            -(this.start.y - this.faceR * 2) / this.animationFrequency,
            -(this.start.y - this.canvas.height / 2 + this.faceR * 2) / this.animationFrequency,
          ),
        },
        swingNum: this.rand(-(this.fallingSwingNum - 1) / 2, (this.fallingSwingNum - 1) / 2), // 摇摆当前所在帧
        swing: this.fallingSwing, // 摇摆帧步长
        fallingDeg: opts.fallingDeg || this.rand(15, 30), // 笑脸每帧旋转度数
        fallingRange: opts.fallingRange || this.rand(this.flowersWidth / 2, this.flowersWidth), // 笑脸每帧偏移
        faceColor: opts.faceColor,
        eyeColor: opts.eyeColor,
        mouthColor: opts.mouthColor,
      };
      console.log(
        '🚀 ~ this.faceData:',
        this.faceData,
        this.start,
        this.faceR,
        this.animationFrequency,
      );
    }
  }
  // 彩带上升运动数据处理
  flowersArrMove() {
    this.flowersArr.forEach(item => {
      item.start = {
        x: item.start.x + item.step.x,
        y: item.start.y + item.step.y,
        x2: item.start.x2 + item.step.x,
        y2: item.start.y2 + item.step.y,
      };
      item.control = {
        x: item.control.x + item.step.x,
        y: item.control.y + item.step.y,
        x2: item.control.x2 + item.step.x,
        y2: item.control.y2 + item.step.y,
      };
      item.end = {
        x: item.end.x + item.step.x,
        y: item.end.y + item.step.y,
        x2: item.end.x2 + item.step.x,
        y2: item.end.y2 + item.step.y,
      };
      if (item.control2) {
        item.control2 = {
          x: item.control2.x + item.step.x,
          y: item.control2.y + item.step.y,
          x2: item.control2.x2 + item.step.x,
          y2: item.control2.y2 + item.step.y,
        };
      }
    });
  }
  // 笑脸上升运动数据处理
  faceMove() {
    if (!this.faceFlag) {
      return;
    }
    this.faceData.x = this.faceData.x + this.faceData.step.x;
    this.faceData.y = this.faceData.y + this.faceData.step.y;
  }
  // 彩带飘落运动数据处理
  flowersArrFalling() {
    let fallingHeight = this.canvas.height / 2 / this.fallingFrequency;
    this.flowersArr.forEach(item => {
      if (
        item.swingNum + item.swing > (this.fallingSwingNum - 1) / 2 ||
        item.swingNum + item.swing < -(this.fallingSwingNum - 1) / 2
      ) {
        item.swing = item.swing * -1;
      }
      item.swingNum += item.swing;

      item.start = {
        x: item.start.x,
        y: item.start.y + fallingHeight,
        x2: item.start.x2,
        y2: item.start.y2 + fallingHeight,
      };
      item.control = {
        x: item.control.x,
        y: item.control.y + fallingHeight,
        x2: item.control.x2,
        y2: item.control.y2 + fallingHeight,
      };
      item.end = {
        x: item.end.x,
        y: item.end.y + fallingHeight,
        x2: item.end.x2,
        y2: item.end.y2 + fallingHeight,
      };
      if (item.control2) {
        item.control2 = {
          x: item.control2.x,
          y: item.control2.y + fallingHeight,
          x2: item.control2.x2,
          y2: item.control2.y2 + fallingHeight,
        };
      }

      let color = [];
      item.color.forEach(colorItem => {
        let colorArr = colorItem.split('-');
        colorArr[1] = colorArr[1] - this.fallingFrequency / 100;
        color.push(colorArr.join('-'));
      });
      item.color = color;
    });
  }
  // 笑脸飘落运动数据处理
  faceFalling() {
    if (!this.faceFlag) {
      return;
    }
    let fallingHeight = this.canvas.height / 2 / this.fallingFrequency;

    this.faceData.y = this.faceData.y + fallingHeight;

    if (
      this.faceData.swingNum + this.faceData.swing > (this.fallingSwingNum - 1) / 2 ||
      this.faceData.swingNum + this.faceData.swing < -(this.fallingSwingNum - 1) / 2
    ) {
      this.faceData.swing = this.faceData.swing * -1;
    }
    this.faceData.swingNum += this.faceData.swing;

    this.faceData.faceColor =
      this.faceData.faceColor.split('-')[0] +
      '-' +
      (this.faceData.faceColor.split('-')[1] - this.fallingFrequency / 100);
    this.faceData.eyeColor =
      this.faceData.eyeColor.split('-')[0] +
      '-' +
      (this.faceData.eyeColor.split('-')[1] - this.fallingFrequency / 100);
    this.faceData.mouthColor =
      this.faceData.mouthColor.split('-')[0] +
      '-' +
      (this.faceData.mouthColor.split('-')[1] - this.fallingFrequency / 100);
  }
  // 运动函数
  run() {
    if (
      this.animationFrequencyEd > this.animationFrequency &&
      this.fallingFrequencyEd > this.fallingFrequency
    ) {
      this.cb && this.cb();
      this.clear();
      return;
    }
    if (this.animationFrequencyEd > this.animationFrequency) {
      this.startAnimationFrame = 0;
      this.animationFrameFalling();
    } else {
      this.startAnimationFrame = 0;
      this.animationFrameMove();
    }
  }
  // 上升动画
  animationFrameMove(timestamp) {
    if (!this.startAnimationFrame) {
      this.startAnimationFrame = timestamp;
    }
    if (timestamp - this.startAnimationFrame >= this.animationFrequencyTime) {
      this.startAnimationFrame = timestamp;
      this.animationFrequencyEd += 1;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawFlowers();
      this.drawFace();
      if (this.debugStartPoint) {
        this.drawStartPoint();
      }

      if (this.animationFrequencyEd <= this.animationFrequency) {
        this.faceMove();
        this.flowersArrMove();
      } else {
        window.cancelAnimationFrame(this.requestAnimationFrame);
        this.run();
        return;
      }
    }
    this.requestAnimationFrame = window.requestAnimationFrame(this.animationFrameMove.bind(this));
  }
  // 飘落动画
  animationFrameFalling(timestamp) {
    if (!this.startAnimationFrame) {
      this.startAnimationFrame = timestamp;
    }
    if (timestamp - this.startAnimationFrame >= this.fallingFrequencyTime) {
      this.startAnimationFrame = timestamp;
      this.fallingFrequencyEd += 1;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawFlowers();
      this.drawFace();
      if (this.debugStartPoint) {
        this.drawStartPoint();
      }

      if (this.fallingFrequencyEd <= this.fallingFrequency) {
        this.faceFalling();
        this.flowersArrFalling();
      } else {
        window.cancelAnimationFrame(this.requestAnimationFrame);
        this.run();
        return;
      }
    }
    this.requestAnimationFrame = window.requestAnimationFrame(
      this.animationFrameFalling.bind(this),
    );
  }
  // 随机数
  rand(n, m) {
    let c = m - n + 1;
    return Math.floor(Math.random() * c + n);
  }
  // 清空canvas
  clear() {
    if (this.requestAnimationFrame) {
      window.cancelAnimationFrame(this.requestAnimationFrame);
      this.requestAnimationFrame = null;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  // 绘制彩带
  drawFlowers() {
    this.flowersArr.forEach(item => {
      this.ctx.save();
      this.ctx.beginPath();

      let grd = this.ctx.createLinearGradient(item.start.x, item.start.y, item.end.x2, item.end.y2);
      let grdColor = item.color;
      grdColor.forEach(colorItem => {
        grd.addColorStop(
          colorItem.split('-')[2] / 100,
          'rgba(' + colorItem.split('-')[0] + ',' + colorItem.split('-')[1] / 100 + ')',
        );
      });
      this.ctx.fillStyle = grd;

      this.ctx.translate(
        (item.control.x + item.control.x2) / 2,
        (item.control.y + item.control.y2) / 2,
      );
      this.ctx.rotate((item.fallingDeg * item.swingNum * Math.PI) / 180);
      this.ctx.translate(
        -(item.control.x + item.control.x2) / 2 + item.fallingRange * item.swingNum,
        -(item.control.y + item.control.y2) / 2,
      );

      if (item.control2) {
        this.ctx.lineTo(item.start.x, item.start.y);
        this.ctx.bezierCurveTo(
          item.control.x,
          item.control.y,
          item.control2.x,
          item.control2.y,
          item.end.x,
          item.end.y,
        );
        this.ctx.lineTo(item.end.x2, item.end.y2);
        this.ctx.bezierCurveTo(
          item.control2.x2,
          item.control2.y2,
          item.control.x2,
          item.control.y2,
          item.start.x2,
          item.start.y2,
        );
        this.ctx.lineTo(item.start.x, item.start.y);
      } else {
        this.ctx.lineTo(item.start.x, item.start.y);
        this.ctx.quadraticCurveTo(item.control.x, item.control.y, item.end.x, item.end.y);
        this.ctx.lineTo(item.end.x2, item.end.y2);
        this.ctx.quadraticCurveTo(item.control.x2, item.control.y2, item.start.x2, item.start.y2);
        this.ctx.lineTo(item.start.x, item.start.y);
      }
      this.ctx.fill();

      this.ctx.closePath();
      this.ctx.restore();
    });
  }
  // 绘制笑脸
  drawFace() {
    if (!this.faceFlag) {
      return;
    }
    this.ctx.save();

    this.ctx.translate(this.faceData.x, this.faceData.y);
    this.ctx.rotate((this.faceData.fallingDeg * this.faceData.swingNum * Math.PI) / 180);
    this.ctx.translate(
      -this.faceData.x + this.faceData.fallingRange * this.faceData.swingNum,
      -this.faceData.y,
    );

    this.ctx.beginPath();
    this.ctx.fillStyle =
      'rgba(' +
      this.faceData.faceColor.split('-')[0] +
      ',' +
      this.faceData.faceColor.split('-')[1] / 100 +
      ')';
    this.ctx.arc(this.faceData.x, this.faceData.y, this.faceR, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.fillStyle =
      'rgba(' +
      this.faceData.eyeColor.split('-')[0] +
      ',' +
      this.faceData.eyeColor.split('-')[1] / 100 +
      ')';
    this.ctx.arc(
      this.faceData.x - this.faceR / 3,
      this.faceData.y - this.faceR / 3,
      this.eyeR,
      0,
      2 * Math.PI,
    );
    this.ctx.fill();
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.fillStyle =
      'rgba(' +
      this.faceData.eyeColor.split('-')[0] +
      ',' +
      this.faceData.eyeColor.split('-')[1] / 100 +
      ')';
    this.ctx.arc(
      this.faceData.x + this.faceR / 3,
      this.faceData.y - this.faceR / 3,
      this.eyeR,
      0,
      2 * Math.PI,
    );
    this.ctx.fill();
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.fillStyle =
      'rgba(' +
      this.faceData.mouthColor.split('-')[0] +
      ',' +
      this.faceData.mouthColor.split('-')[1] / 100 +
      ')';
    this.ctx.arc(this.faceData.x, this.faceData.y, this.mouthR, 0, Math.PI);
    this.ctx.fill();
    this.ctx.closePath();

    this.ctx.restore();
  }
  // 起始点调试
  drawStartPoint() {
    this.ctx.save();
    this.ctx.beginPath();

    this.ctx.fillStyle = 'rgba(0,255,0)';
    this.ctx.arc(this.start.x, this.start.y, (4 / 75) * window.dpr, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.closePath();
    this.ctx.restore();
  }
}
