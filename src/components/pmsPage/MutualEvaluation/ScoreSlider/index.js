import { Divider, message, Tooltip } from 'antd';
import React, { useCallback, useState, useEffect, useRef } from 'react';
import styles from './styles.less'
import { connect } from 'dva';

const ScoreSlider = props => {
  const { score = '0.0', disabled = false, onChange = () => { }, dictionary } = props;
  const [scoreNum, setScoreNum] = useState('0.0');
  const [tooltip, setTooltip] = useState({
    num: null,
    visible: false,
    current: -1,
  });
  const [isSelecting, setIsSelecting] = useState(false); //正在选中
  const data = Array.from({ length: 10 }, (_, index) => index + 1);

  const gradeRef = useRef('不及格')

  useEffect(() => {
    setScoreNum(Number.isInteger(Number(score)) ? Number(score) + '.0' : score);
    return () => { };
  }, [score]);

  // 鼠标滑动
  const handleMouseMove = useCallback(
    (e, index) => {
      if (
        isSelecting
        // &&!e.target.className.includes('sliderItemTooltip') &&
        // !e.target.className.includes('sliderItemBar') &&
        // !e.target.className.includes('ant-tooltip-open')
      ) {
        const boundingBox = e.target.getBoundingClientRect();
        const clickX = e.clientX - boundingBox.left;
        const isLeft = clickX / boundingBox.width < 0.6;
        // console.log(
        //   '🚀 ~ file: index.js:22 ~ ScoreSlider ~ clickX:',
        //   clickX,
        //   e.clientX,
        //   e.offsetX,
        //   boundingBox,
        //   e.target.className,
        //   e.target,
        // );
        let finalNum = isLeft ? index + '.5' : index + 1 + '.0';
        if (index === 0 && clickX <= 1) {
          finalNum = '0.0';
        }
        //待解决问题：10往后选快会是9.5
        //  else if (index === 9 && (clickX >= 12 || clickX < 0)) {
        //   setTooltip({
        //     num: null,
        //     visible: false,
        //     current: -1,
        //   });
        //   setScoreNum('10');
        // }
        setTooltip({
          num: finalNum,
          visible: true,
          current: index,
        });
        setScoreNum(finalNum);
        onChange(isLeft ? index + '.5' : index + 1 + '.0');
      }
    },
    [isSelecting],
  );

  // 鼠标移开滑动器
  const handleMouseLeave = useCallback(
    e => {
      if (isSelecting) {
        const boundingBox = e.target.getBoundingClientRect();
        const clickX = e.clientX - boundingBox.left;
        // console.log(
        //   '🚀 ~ file: index.js:66 ~ ScoreSlider ~ clickX:',
        //   clickX,
        //   e.clientX,
        //   boundingBox,
        //   e.target,
        //   document.body.scrollWidth - boundingBox.left - e.clientX - 260,
        // );
        if (clickX <= 0) {
          handleBackToZero();
        } else {
          setTooltip({ visible: false, num: null, current: -1 });
        }
        setIsSelecting(false);
      }
    },
    [isSelecting],
  );

  // 滑动开始
  const handleMouseDown = useCallback(e => {
    setIsSelecting(true);
  }, []);

  // 滑动结束
  const handleMouseUp = useCallback((e, index) => {
    // const boundingBox = e.target.getBoundingClientRect();
    // const clickX = e.clientX - boundingBox.left;
    // const isLeft = clickX / boundingBox.width < 0.6;
    // setScoreNum(isLeft ? index + '.5' : index + 1);
    setTooltip({ visible: false, num: null, current: -1 });
    e.target.removeEventListener('mousemove', handleMouseMove);
    setIsSelecting(false);
  }, []);

  // 归零
  const handleBackToZero = useCallback(() => {
    setTooltip({
      num: '0.0',
      visible: false,
      current: -1,
    });
    setScoreNum('0.0');
    onChange('0.0');
    // setIsSelecting(false);
  }, []);

  //点击选中
  const handleClick = useCallback((e, index) => {
    const boundingBox = e.target.getBoundingClientRect();
    const clickX = e.clientX - boundingBox.left;
    const isLeft = clickX / boundingBox.width < 0.6;
    setScoreNum(isLeft ? index + '.5' : index + 1 + '.0');
    onChange(isLeft ? index + '.5' : index + 1 + '.0');
    setTooltip({
      num: null,
      visible: false,
      current: -1,
    });
  }, []);

  /** 推断评价等级 */
  const judgeGradeScale = (score) => {
    for (let i = 1; i <= 4; i++) {
      const findItem = dictionary.PJDJ.find(item => item.ibm === String(i))
      if (parseFloat(score) >= parseFloat(findItem.note)) {
        const { cbm } = findItem
        gradeRef.current = cbm
        return cbm
      }
    }
  }

  /** 推断打分颜色风格 */
  const judgeScoreStyle = (score) => {
    const grade = judgeGradeScale(score)
    let res = ''
    switch (grade) {
      case '优秀': res = 'blueScore'; break;
      case '良好': res = 'skyblueScore'; break;
      case '及格': res = 'yellowScore'; break;
      case '不及格': res = 'redScore'; break;
    }
    return res
  }

  /** 推断评价等级颜色风格 */
  const judgeGradeStyle = (score) => {
    const grade = judgeGradeScale(score)
    let res = ''
    switch (grade) {
      case '优秀': res = 'blueGrade'; break;
      case '良好': res = 'skyblueGrade'; break;
      case '及格': res = 'yellowGrade'; break;
      case '不及格': res = 'redGrade'; break;
    }
    return res
  }


  return (
    <div className={styles.sliderWrapper}>
      <div className={styles.backToZero} onClick={disabled ? () => { } : handleBackToZero}></div>
      <div className={styles.sliderBox} onMouseLeave={disabled ? () => { } : handleMouseLeave}>
        {data.map((x, index) => (
          <Tooltip
            visible={tooltip.current === index && tooltip.visible}
            title={tooltip.num}
            placement="top"
            overlayClassName={styles.sliderItemTooltip}
          >
            <div
              key={x}
              className={
                styles.sliderItem +
                (tooltip.num !== null && Number(tooltip.num) >= Number(index + '.5')
                  ? ` ${styles.sliderItemHalfHovered}` +
                  (tooltip.num !== null && Number(tooltip.num) >= index + 1
                    ? ` ${styles.sliderItemHovered}`
                    : '')
                  : Number(scoreNum) > 0 && Number(scoreNum) >= index + 1
                    ? ` ${styles.sliderItemSlted}`
                    : Number(scoreNum) > 0 && Number(scoreNum) >= Number(index + '.5')
                      ? ` ${styles.sliderItemHalfSlted}`
                      : '')
              }
              onMouseMove={disabled ? () => { } : e => handleMouseMove(e, index)}
              onMouseDown={disabled ? () => { } : handleMouseDown}
              onMouseUp={disabled ? () => { } : e => handleMouseUp(e, index)}
              onClick={
                disabled
                  ? () => {
                    message.warn('该人员已评分，不允许修改！', 2);
                  }
                  : e => handleClick(e, index)
              }
              style={disabled ? { cursor: 'default' } : {}}
            >
              {x}
              {!disabled &&
                Number(scoreNum) > 0 &&
                [index + 1, Number(index + '.5')].includes(Number(scoreNum)) ? (
                <div
                  className={styles.sliderItemBar}
                  style={{ left: Number(scoreNum) === index + 1 ? 24 : 12 + 'px' }}
                ></div>
              ) : !disabled && Number(scoreNum) === 0 && index === 0 ? (
                <div className={styles.sliderItemBar}></div>
              ) : (
                ''
              )}
            </div>
          </Tooltip>
        ))}
      </div>
      <span className={styles[judgeScoreStyle(scoreNum)]}>{scoreNum}</span>

      <div className={styles[judgeGradeStyle(scoreNum)]} style={{ marginLeft: scoreNum === '10.0' ? '10px' : '' }}>
        {gradeRef.current === '优秀' && <img src={require('../../../../assets/MutualEvaluation/grade_blue.png')}></img>}
        {gradeRef.current === '良好' && <img src={require('../../../../assets/MutualEvaluation/grade_skyblue.png')}></img>}
        {gradeRef.current === '及格' && <img src={require('../../../../assets/MutualEvaluation/grade_yellow.png')}></img>}
        {gradeRef.current === '不及格' && <img src={require('../../../../assets/MutualEvaluation/grade_red.png')}></img>}

        <span>{judgeGradeScale(scoreNum)}</span>
      </div>

    </div>
  );
};


export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(ScoreSlider);

