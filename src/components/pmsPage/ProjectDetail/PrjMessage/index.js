import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import moment from 'moment';
import { Drawer, Popover, Input, Button, message } from 'antd';
import { set } from 'store';
const { TextArea } = Input;

export default function PrjMessage(props) {
  const [drawerVisible, setDrawerVisible] = useState(false); //编辑
  const [msgData, setMsgData] = useState([]); //留言信息
  const [editingIndex, setEditingIndex] = useState(-1); //正在编辑的留言id
  const [editContent, setEditContent] = useState(''); //编辑的留言内容
  const [newMsg, setNewMsg] = useState(false); //是否位新增留言
  const [updatePage, setUpdatePage] = useState(0); //无意义，刷新组件

  //防抖定时器
  let timer = null;

  const nodeArr = document.getElementsByClassName('content msg-node');

  useEffect(() => {
    return () => {
      setEditingIndex(-1);
      clearTimeout(timer);
    };
  }, []);
  useLayoutEffect(() => {
    let data = [
      {
        id: 1,
        content: '123456',
        name: '王建军1',
        time: '1月23日 12:24',
        unfold: false,
        editing: false,
        textHide: false,
      },
      {
        id: 2,
        content:
          '项目于2022年12月启动，截止2023年2月，进度正常，状态正常。项目于2022年12月启动，截止2023年1月，进度正常，状态正常。项目于2022年12月启动，截止2023年1月，进度正常，状态正常。',
        name: '王建军2',
        time: '2月23日 12:24',
        unfold: false,
        editing: false,
        textHide: false,
      },
      {
        id: 3,
        content:
          '项目于2022年12月启动，截止2023年3月，进度正常，状态正常。项目于2022年12月启动，截止2023年1月，进度正常，状态正常。项目于2022年12月启动，截止2023年1月，进度正常，状态正常。',
        name: '王建军3',
        time: '3月23日 12:24',
        unfold: false,
        editing: false,
        textHide: false,
      },
    ];
    if (nodeArr.length !== 0) {
      for (let i = 0; i < nodeArr.length; i++) {
        let x = nodeArr[i];
        data[i].textHide = !(x.clientHeight <= 44 && x.scrollHeight <= 44);
      }
    }
    setMsgData(p => [...data]);

    return () => {};
  }, [props]);
  //防抖
  const debounce = (fn, waits) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn(...arguments);
    }, waits);
  };

  //留言块
  const getMsgItem = ({
    id,
    content = '--',
    name = '--',
    time = '--',
    unfold = false,
    editing = false,
    textHide = false,
  }) => {
    const msgEditCotent = (
      <div className="list">
        <div
          className="item"
          onClick={() => {
            setEditingIndex(id);
            setDrawerVisible(true);
          }}
        >
          编辑
        </div>
        <div className="item">删除</div>
      </div>
    );
    return (
      <div className="msg-item" key={id}>
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
            className={'content msg-node'}
            style={{
              WebkitBoxOrient: 'vertical',
              // height: unfold ? 'unset' : '44px',
              WebkitLineClamp: unfold ? 'unset' : '2',
            }}
          >
            {content}
          </div>
          {textHide &&
            (unfold ? (
              <div
                className="fold-box"
                onClick={() => {
                  let arr = [...msgData];
                  arr.forEach(x => {
                    if (x.id === id) {
                      x.unfold = false;
                    }
                  });
                  setMsgData(p => [...arr]);
                }}
              >
                收起
                <i className="iconfont icon-up" />
              </div>
            ) : (
              <div
                className="unfold-box"
                onClick={() => {
                  let arr = [...msgData];
                  arr.forEach(x => {
                    if (x.id === id) {
                      x.unfold = true;
                    }
                  });
                  setMsgData(p => [...arr]);
                  console.log('🚀 ~ file: index.js ~ line 116 ~ PrjMessage ~ [...arr]', [...arr]);
                }}
              >
                展开
                <i className="iconfont icon-down" />
              </div>
            ))}
        </div>
      </div>
    );
  };
  //编辑留言
  const handleMsgEdit = v => {
    const nodeArrNow = document.getElementsByClassName('content msg-node');
    let arr = [...msgData];
    if (newMsg) {
      message.info('调接口新增');
    } else {
      arr.forEach(x => {
        if (x.id === editingIndex) {
          x.content = editContent;
        }
      });
      if (nodeArrNow.length !== 0) {
        for (let i = 0; i < nodeArrNow.length; i++) {
          let x = nodeArrNow[i];
          setTimeout(() => {
            arr[i].textHide = !(x.clientHeight <= 44 && x.scrollHeight <= 44);
            setUpdatePage(new Date().getTime());
          }, 0);
        }
      }
      // console.log('🚀 ~ file: index.js ~ line 159 ~ handleMsgEdit ~ [...arr]', [...arr]);
    }
    setMsgData(p => [...arr]);
    setDrawerVisible(false);
    setNewMsg(false);
  };

  return (
    <div className="prj-msg-box">
      <div className="top-title">项目留言</div>
      <div className="bottom-box">{msgData?.map(item => getMsgItem(item))}</div>
      <div className="edit-drawer-wrapper">
        {drawerVisible ? (
          <div className="edit-drawer" style={{ maxHeight: drawerVisible ? '80%' : 0 }}>
            <TextArea
              allowClear
              autoSize={{
                minRows: 3,
                maxRows: 7,
              }}
              onChange={e => {
                e.persist();
                debounce(() => {
                  setEditContent(e.target.value);
                  // console.log(
                  //   '🚀 ~ file: index.js ~ line 169 ~ debounce ~ e.target.value',
                  //   e.target.value,
                  // );
                }, 300);
              }}
            />
            <div className="footer-btn">
              <Button
                size="small"
                className="btn-cancel"
                onClick={() => {
                  setDrawerVisible(false);
                  setNewMsg(false);
                }}
              >
                取消
              </Button>
              <Button size="small" type="primary" className="btn-submit" onClick={handleMsgEdit}>
                提交
              </Button>
            </div>
          </div>
        ) : (
          <div className="edit-input">
            <Input
              placeholder="请输入"
              onFocus={() => {
                setDrawerVisible(true);
                setNewMsg(true);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
