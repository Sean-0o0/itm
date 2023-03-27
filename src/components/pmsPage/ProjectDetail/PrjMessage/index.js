import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { Drawer, Popover, Input } from 'antd';
const { TextArea } = Input;

export default function PrjMessage(props) {
  const {} = props;
  const [isUnfold, setIsUnfold] = useState(false); //是否展开
  const [drawerVisible, setDrawerVisible] = useState(false); //编辑
  const nodeRef = useRef(null);
  useEffect(() => {
    return () => {};
  }, []);

  const getMsgItem = ({ content = '--', name = '--', time = '--' }) => {
    const msgEditCotent = (
      <div className="list">
        <div className="item" onClick={() => setDrawerVisible(true)}>
          编辑
        </div>
        <div className="item">删除</div>
      </div>
    );
    return (
      <div className="msg-item">
        <div className="top">
          <div className="top-name">{name}</div>
          <div>{time}</div>
          <Popover
            placement="bottom"
            title={null}
            content={msgEditCotent}
            overlayClassName="msg-edit-content-popover"
          >
            <i className="iconfont icon-more" />
          </Popover>
        </div>
        <div className="bottom">
          <div
            className="content"
            style={{
              WebkitBoxOrient: 'vertical',
              height: isUnfold ? 'unset' : '44px',
              WebkitLineClamp: isUnfold ? 'unset' : '2',
            }}
          >
            {content}
          </div>
          {isUnfold ? (
            <div className="fold-box" onClick={() => setIsUnfold(false)}>
              收起
              <i className="iconfont icon-up" />
            </div>
          ) : (
            <div className="unfold-box" onClick={() => setIsUnfold(true)}>
              展开
              <i className="iconfont icon-down" />
            </div>
          )}
        </div>
      </div>
    );
  };
  return (
    <div className="prj-msg-box">
      <div className="top-title">项目留言</div>
      <div className="bottom-box" ref={nodeRef}>
        {getMsgItem({
          content:
            '项目于2022年12月启动，截止2023年1月，进度正常，状态正常。项目于2022年12月启动，截止2023年1月，进度正常，状态正常。项目于2022年12月启动，截止2023年1月，进度正常，状态正常。',
          name: '王建军',
          time: '1月23日 12:24',
        })}
        {getMsgItem({
          content:
            '项目于2022年12月启动，截止2023年1月，进度正常，状态正常。项目于2022年12月启动，截止2023年1月，进度正常，状态正常。项目于2022年12月启动，截止2023年1月，进度正常，状态正常。',
          name: '王建军',
          time: '1月23日 12:24',
        })}
        {getMsgItem({
          content:
            '项目于2022年12月启动，截止2023年1月，进度正常，状态正常。项目于2022年12月启动，截止2023年1月，进度正常，状态正常。项目于2022年12月启动，截止2023年1月，进度正常，状态正常。',
          name: '王建军',
          time: '1月23日 12:24',
        })}
        {getMsgItem({
          content:
            '项目于2022年12月启动，截止2023年1月，进度正常，状态正常。项目于2022年12月启动，截止2023年1月，进度正常，状态正常。项目于2022年12月启动，截止2023年1月，进度正常，状态正常。',
          name: '王建军',
          time: '1月23日 12:24',
        })}
        {getMsgItem({
          content:
            '项目于2022年12月启动，截止2023年1月，进度正常，状态正常。项目于2022年12月启动，截止2023年1月，进度正常，状态正常。项目于2022年12月启动，截止2023年1月，进度正常，状态正常。',
          name: '王建军',
          time: '1月23日 12:24',
        })}
        {getMsgItem({
          content:
            '项目于2022年12月启动，截止2023年1月，进度正常，状态正常。项目于2022年12月启动，截止2023年1月，进度正常，状态正常。项目于2022年12月启动，截止2023年1月，进度正常，状态正常。',
          name: '王建军',
          time: '1月23日 12:24',
        })}
        <Drawer
          title={null}
          placement="bottom"
          closable={false}
          visible={drawerVisible}
          getContainer={false}
          mask={false}
          className="edit-drawer"
          style={{ position: 'absolute' }}
        >
          <TextArea />
          <div className="footer-btn">example</div>
        </Drawer>
      </div>
    </div>
  );
}
