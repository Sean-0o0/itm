import { Button } from 'antd';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { FetchQueryOwnerMessage } from '../../../../services/pmsServices';
import moment from 'moment';

export default function ToDoCard(props) {
  const { itemWidth, getAfterItem } = props;
  const [isUnfold, setIsUnfold] = useState(false); //是否展开
  const [toDoData, setToDoData] = useState([]); //待办数据
  const [dataList, setDataList] = useState([]); //待办数据 - 展示

  useLayoutEffect(() => {
    getToDoData();
    return () => {};
  }, [props]);

  //获取待办数据
  const getToDoData = () => {
    FetchQueryOwnerMessage({
      cxlx: 'ALL',
      date: Number(new moment().format('YYYYMMDD')),
      paging: -1,
      current: 1,
      pageSize: 9999,
      total: 1,
      sort: '',
    })
      .then(res => {
        if (res?.success) {
          // console.log('🚀 ~ FetchQueryOwnerMessage ~ res', res.record);
          setToDoData(p => [...res.record]);
          setDataList(p => [...res.record].slice(0, getColNum(itemWidth)));
        }
      })
      .catch(e => {
        console.error('FetchQueryOwnerMessage', e);
      });
  };
  //获取目前每行几个
  const getColNum = w => {
    switch (w) {
      case '32%':
        return 3;
      case '24%':
        return 4;
      case '19%':
        return 5;
      case '15.6%':
        return 6;
      case '13.2%':
        return 7;
      case '11.5%':
        return 8;
      default:
        return 3;
    }
  };

  //展开、收起
  const handleUnfold = bool => {
    setIsUnfold(bool);
    if (bool) setDataList(p => [...toDoData]);
    else setDataList(p => [...toDoData?.slice(0, getColNum(itemWidth))]);
  };

  //待办块
  const getToDoItem = ({
    title = '--',
    content = '--',
    deadline = '--',
    btnTxt = '--',
    isLate = false,
    isDueSoon = false,
    lateDay = '--',
    key,
  }) => {
    let borderColor = '#EBEEF5FF';
    let fontColor = '#3361FF';
    if (isDueSoon) {
      fontColor = '#F9A812FF';
      borderColor = '#F9A8124D';
    } else if (isLate) {
      fontColor = '#E23C39FF';
      borderColor = '#D70E194D';
    }
    return (
      <div
        className="todo-item"
        style={{
          borderColor: borderColor,
          width: itemWidth,
        }}
        key={key}
      >
        {isDueSoon && <div className="status-tag-2">即将到期</div>}
        {isLate && <div className="status-tag-3">逾期{}天</div>}
        <div className="item-title">
          <i style={{ color: fontColor }}>#</i>
          {title}
          <div className="content">{content}</div>
          <div className="deadline">{deadline}</div>
        </div>
        <div className="item-btn">去{btnTxt}</div>
      </div>
    );
  };
  const getBtnTxt = txt => {
    if (txt.includes('录入')) return '录入';
    else if (txt.includes('填写')) return '填写';
    else return '处理';
  };
  return (
    <div className="todo-card-box">
      <div className="home-card-title-box">我的待办</div>
      <div className="todo-row">
        {dataList?.map((item, index) =>
          getToDoItem({
            title: item.xmmc,
            content: item.txnr,
            deadline: moment(item.jzrq).format('YYYY-MM-DD'),
            btnTxt: getBtnTxt(item.txnr),
            isLate: Number(item.wdsl) < 0, //是否逾期
            isDueSoon:
              Number(moment(item.jzrq).diff(moment(new moment()), 'days')) <= 3 &&
              Number(moment(item.jzrq).diff(moment(new moment()), 'days')) > 0,
            key: index,
            lateDay: item.wdsl,
          }),
        )}
        {getAfterItem(itemWidth)}
      </div>
      {isUnfold ? (
        <div className="more-item" onClick={() => handleUnfold(false)}>
          收起
          <i className="iconfont icon-up" />
        </div>
      ) : (
        <div className="more-item" onClick={() => handleUnfold(true)}>
          更多
          <i className="iconfont icon-down" />
        </div>
      )}
    </div>
  );
}
