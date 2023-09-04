import React, { useEffect, useState, useRef } from 'react';
import { Button, message, Popover } from 'antd';
import moment from 'moment';
import OprtModal from './OprtModal';

export default function IterationPayment(props) {
  const {} = props;
  const [isUnfold, setIsUnfold] = useState(false); //是否展开
  const [itemWidth, setItemWidth] = useState('31.851%'); //块宽度
  const [modalData, setModalData] = useState({
    visible: false, //弹窗显隐
    data: {},
  }); //新增迭代付款

  //防抖定时器
  let timer = null;

  useEffect(() => {
    return () => {};
  }, []);

  useEffect(() => {
    // 页面变化时获取浏览器窗口的大小
    window.addEventListener('resize', resizeUpdate);
    window.dispatchEvent(new Event('resize', { bubbles: true, composed: true })); //刷新时能触发resize
    return () => {
      // 组件销毁时移除监听事件
      window.removeEventListener('resize', resizeUpdate);
      clearTimeout(timer);
    };
  }, []);

  // 防抖
  const debounce = (fn, waits = 500) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn(...arguments);
    }, waits);
  };

  //屏幕宽度变化触发
  const resizeUpdate = e => {
    const fn = () => {
      let w = e.target.innerWidth; //屏幕宽度
      if (w < 1730) {
        setItemWidth('31.851%');
      } else if (w < 2008) {
        setItemWidth('23.718%');
      } else if (w < 2292) {
        setItemWidth('18.911%');
      } else if (w < 2576) {
        setItemWidth('15.724%');
      } else if (w < 2860) {
        setItemWidth('13.4565%');
      } else if (w < 3145) {
        setItemWidth('11.7605%');
      } else {
        setItemWidth('10.4441%'); //9个
      }
    };
    debounce(fn, 300);
  };

  //flex列表尾部占位置的空标签，处理justify-content对齐问题
  const getAfterItem = width => {
    let arr = [];
    for (let i = 0; i < 9; i++) {
      //每行最多n=11个
      arr.push('');
    }
    return arr.map((x, k) => <i key={k} style={{ width }} />);
  };

  //付款块
  const getPaymentItem = () => {
    return (
      <div className="item">
        <div className="item-top">第一次</div>
        <div className="item-bottom">
          <div className="bottom-row" key="评估信息">
            <span>评估信息</span>
            <div className="opr-more">
              <div className="reopr-btn" onClick={() => {}}>
                修改
              </div>
            </div>
          </div>
          <div className="bottom-row" key="审批流程">
            <span>审批流程</span>
            <div className="opr-btn" onClick={() => {}}>
              修改
            </div>
            <Popover
              placement="bottom"
              title={null}
              // content={reoprMoreCotent}
              overlayClassName="btn-more-content-popover"
            >
              <div className="reopr-more">
                <i className="iconfont icon-more2" />
              </div>
            </Popover>
          </div>
          <div className="bottom-row" key="迭代付款流程">
            <span>迭代付款流程</span>
            <div className="opr-btn" onClick={() => {}}>
              发起
            </div>
          </div>
        </div>
      </div>
    );
  };

  //新增迭代付款
  const handleAddIterationPayment = () => {
    setModalData(p => ({ ...p, visible: true }));
  };

  return (
    <div className="iteration-payment-box">
      <OprtModal
        // xmid={xmid}
        modalData={modalData}
        setModalData={setModalData}
        // getIterationCtn={getIterationCtn}
      />
      <div className="top-title">
        项目迭代付款<span onClick={handleAddIterationPayment}>新增迭代付款</span>
      </div>
      <div className="content-wrapper">
        <div className="content">
          {getPaymentItem()}
          {getPaymentItem()}
          {getPaymentItem()}
          {getPaymentItem()}
          {getAfterItem(itemWidth)}
        </div>
      </div>
    </div>
  );
}
