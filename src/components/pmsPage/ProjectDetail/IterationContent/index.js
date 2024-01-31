import React, { useEffect, useState, useRef, Fragment } from 'react';
import { Button, Empty, message, Tooltip } from 'antd';
import moment from 'moment';
import ImgArrowUp from '../../../../assets/projectDetail/icon_arrow_up.png';
import OprtModal from './OprtModal';

export default function IterationContent(props) {
  const { prjData = {}, xmid, is_XMJL_FXMJL, getIterationCtn, openNewIteContent = false } = props;
  const { iterationCtn = [], prjBasic = {} } = prjData;
  const [dataShow, setDataShow] = useState([]); //展示用
  const [isUnfold, setIsUnfold] = useState(false); //是否展开
  const [itemWidth, setItemWidth] = useState('31.851%'); //块宽度
  const [modalData, setModalData] = useState({
    visible: false, //弹窗显隐
    data: {},
    type: 'ADD', //'UPDATE'、'ADD'、'DELETE'
  }); //弹窗数据

  //防抖定时器
  let timer = null;

  //打开弹窗
  useEffect(() => {
    if (openNewIteContent) {
      setModalData({
        visible: true,
        type: 'ADD',
      });
    }
    return () => {};
  }, [openNewIteContent]);

  useEffect(() => {
    setDataShow([...iterationCtn.slice(0, getColNum(itemWidth) * 2)]);
    setIsUnfold(false);
    return () => {};
  }, [JSON.stringify(iterationCtn), itemWidth]);

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

  //获取目前每行几个
  const getColNum = w => {
    switch (w) {
      case '31.851%':
        return 3;
      case '23.718%':
        return 4;
      case '18.911%':
        return 5;
      case '15.724%':
        return 6;
      case '13.4565%':
        return 7;
      case '11.7605%':
        return 8;
      case '10.4441%':
        return 9;
      default:
        return 3;
    }
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

  //获取内容块
  const getContentItem = ({ date = '--', detail = '--', key, times }) => {
    //日期处理
    const getDate = (ds = undefined) => {
      const dateStr = String(ds);
      if (moment(dateStr).year() === moment(prjBasic.CJRQ).year())
        return moment(dateStr).format('MM-DD');
      return moment(dateStr).format('YYYY-MM-DD');
    };
    const handleEdit = () =>
      setModalData({
        data: { date, detail, key, times },
        visible: true,
        type: 'UPDATE',
      });
    return (
      <div className="item" key={key}>
        <div className="item-title">
          <div className="title-left">
            {getDate(date)}
            {is_XMJL_FXMJL && <i className="iconfont icon-edit" onClick={handleEdit} />}
          </div>
          <img className="title-right-img" src={ImgArrowUp} alt="arrow-bg" />
        </div>
        <div className="item-detail" style={{ WebkitBoxOrient: 'vertical' }}>
          <Tooltip
            title={detail}
            placement="rightTop"
            autoAdjustOverflow
            overlayClassName="iteration-content-tooltip"
            overlayStyle={{
              whiteSpace: 'pre-wrap',
              maxWidth: 400,
            }}
          >
            {detail}
          </Tooltip>
        </div>
      </div>
    );
  };

  //展开、收起
  const handleUnfold = (bool = true) => {
    setIsUnfold(bool);
    if (bool) {
      setDataShow([...iterationCtn]);
    } else {
      setDataShow([...iterationCtn.slice(0, getColNum(itemWidth) * 2)]);
    }
  };

  if (iterationCtn.length === 0) return null;
  return (
    <div className="iteration-content-box">
      <OprtModal
        xmid={xmid}
        modalData={modalData}
        setModalData={setModalData}
        getIterationCtn={getIterationCtn}
      />
      <div className="top-title">
        项目迭代内容
        {is_XMJL_FXMJL && (
          <span
            onClick={() =>
              setModalData({
                visible: true,
                type: 'ADD',
              })
            }
          >
            新增升级内容
          </span>
        )}
      </div>
      {iterationCtn.length !== 0 && (
        <div
          className="content"
          style={iterationCtn.length === 0 ? { paddingTop: 0, marginBottom: 0 } : {}}
        >
          {dataShow.map(x =>
            getContentItem({
              date: x.SJRQ,
              detail: x.SJNR,
              key: x.ID,
              times: x.SJCS,
            }),
          )}
          {getAfterItem(itemWidth)}
          {iterationCtn.length === 0 && (
            <Empty
              description="暂无内容"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ width: '100%' }}
            />
          )}
        </div>
      )}
      {iterationCtn.length > getColNum(itemWidth) * 2 &&
        (isUnfold ? (
          <Fragment>
            <div className="more-item-unfold" onClick={() => handleUnfold(false)}>
              收起
              <i className="iconfont icon-up" />
            </div>
          </Fragment>
        ) : (
          <div className="more-item" onClick={handleUnfold}>
            展开
            <i className="iconfont icon-down" />
          </div>
        ))}
    </div>
  );
}
