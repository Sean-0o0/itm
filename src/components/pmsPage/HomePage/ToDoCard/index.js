import { Button } from 'antd';
import React, { useEffect, useState } from 'react';

export default function ToDoCard(props) {
  const {} = props;
  const [isUnfold, setIsUnfold] = useState(false); //是否展开
  useEffect(() => {
    return () => {};
  }, []);
  const getToDoItem = ({
    title = '--',
    content = '--',
    deadline = '--',
    btnTxt = '--',
    status = '1',
  }) => {
    let borderColor = '#EBEEF5FF';
    let fontColor = '#3361FF';
    if (status === '2') {
      fontColor = '#F9A812FF';
      borderColor = '#F9A8124D';
    } else if (status === '3') {
      fontColor = '#E23C39FF';
      borderColor = '#D70E194D';
    }
    return (
      <div className="todo-item" style={{ borderColor: borderColor }}>
        {status === '2' && <div className="status-tag-2">即将到期</div>}
        {status === '3' && <div className="status-tag-3">逾期10天</div>}
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
  return (
    <div className="todo-card-box">
      <div className="home-card-title-box">我的待办</div>
      <div className="todo-row">
        {getToDoItem({
          title: '项目信息管理系统',
          content: '立项申请流程需要发起',
          deadline: '2023-12-12',
          btnTxt: '发起',
          status: '2',
        })}
        {getToDoItem({
          title: '项目信息管理系统',
          content: '立项申请流程需要发起',
          deadline: '2023-12-12',
          btnTxt: '发起',
          status: '3',
        })}
        {getToDoItem({})}
        {getToDoItem({})}
        {getToDoItem({})}
        {getToDoItem({})}
        {getToDoItem({})}
        {getToDoItem({})}
      </div>
      {isUnfold ? (
        <div className="more-item" onClick={() => setIsUnfold(false)}>
          收起
          <i className="iconfont icon-up" />
        </div>
      ) : (
        <div className="more-item" onClick={() => setIsUnfold(true)}>
          更多
          <i className="iconfont icon-down" />
        </div>
      )}
    </div>
  );
}
