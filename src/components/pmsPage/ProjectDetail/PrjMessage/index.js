import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import moment from 'moment';
import { Drawer, Popover, Input, Button, message, Empty } from 'antd';
import { set } from 'store';
import { QueryProjectMessages, UpdateProjectMessages } from '../../../../services/pmsServices';
const { TextArea } = Input;

export default function PrjMessage(props) {
  const [drawerVisible, setDrawerVisible] = useState(false); //编辑
  const [msgData, setMsgData] = useState([]); //留言信息
  const [editingIndex, setEditingIndex] = useState(-1); //正在编辑的留言id
  const [editContent, setEditContent] = useState(''); //编辑的留言内容
  const [newMsg, setNewMsg] = useState(false); //是否位新增留言
  const [updatePage, setUpdatePage] = useState(0); //无意义，刷新组件
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  const { xmid } = props;
  //防抖定时器
  let timer = null;

  useEffect(() => {
    getMsgData();
    return () => {
      setEditingIndex(-1);
      clearTimeout(timer);
    };
  }, [xmid]);

  useLayoutEffect(() => {
    const nodeArr = document.getElementsByClassName('content msg-node');
    if (nodeArr.length !== 0) {
      let data = [...msgData];
      for (let i = 0; i < nodeArr.length; i++) {
        let x = nodeArr[i];
        data[i].textHide = !(x.clientHeight <= 44 && x.scrollHeight <= 44);
      }
      setMsgData(p => [...data]);
    }
    return () => {};
  }, [props]);

  const getMsgData = txt => {
    QueryProjectMessages({
      current: 1,
      czlx: 'ALL',
      pageSize: 10,
      paging: -1,
      sort: 'string',
      total: -1,
      xmid: Number(xmid),
      ryid: Number(LOGIN_USER_INFO.id),
    })
      .then(res => {
        if (res?.success) {
          const nodeArrNow = document.getElementsByClassName('content msg-node');
          if (nodeArrNow.length !== 0) {
            let data = [...msgData];
            console.log('节点拿到了！');
            for (let i = 0; i < nodeArrNow.length; i++) {
              let x = nodeArrNow[i];
              // setTimeout(() => {
              data[i].textHide = !(x.clientHeight <= 44 && x.scrollHeight <= 44);
              setUpdatePage(new Date().getTime());
              // }, 0);
            }
            setMsgData(p => [...data]);
            txt && message.success(txt, 1);
          } else {
            setMsgData(p => [...JSON.parse(res.result)]);
          }
        }
      })
      .catch(e => {
        console.error('QueryProjectMessages', e);
      });
  };
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
        <div
          className="item"
          onClick={() => {
            handleMsgDelete(id, content);
          }}
        >
          删除
        </div>
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
  const handleMsgEdit = () => {
    if (newMsg) {
      UpdateProjectMessages({
        lyid: -1,
        xmid: Number(xmid),
        lynr: editContent,
        lyr: Number(LOGIN_USER_INFO.id),
        czlx: 'ADD',
      })
        .then(res => {
          if (res?.success) {
            getMsgData('留言新增成功');
          }
        })
        .catch(e => {
          console.error('UpdateProjectMessages', e);
        });
    } else {
      UpdateProjectMessages({
        lyid: Number(editingIndex),
        xmid: Number(xmid),
        lynr: editContent,
        lyr: Number(LOGIN_USER_INFO.id),
        czlx: 'UPDATE',
      })
        .then(res => {
          if (res?.success) {
            getMsgData('留言修改成功');
          }
        })
        .catch(e => {
          console.error('UpdateProjectMessages', e);
        });
    }
    setDrawerVisible(false);
    setNewMsg(false);
  };
  //删除留言
  const handleMsgDelete = (id, content) => {
    UpdateProjectMessages({
      lyid: Number(id),
      xmid: Number(xmid),
      lynr: content,
      lyr: Number(LOGIN_USER_INFO.id),
      czlx: 'DELETE',
    })
      .then(res => {
        if (res?.success) {
          message.success('留言删除成功', 1);
        }
      })
      .catch(e => {
        console.error('UpdateProjectMessages', e);
      });
  };

  return (
    <div className="prj-msg-box">
      <div className="top-title">项目留言</div>
      <div className="bottom-box">
        {msgData?.map(item =>
          getMsgItem({
            id: item.ID,
            content: item.LYNR,
            name: item.LYR,
            time: item.LYSJ,
            unfold: item.unfold,
            editing: item.editing,
            textHide: item.textHide,
          }),
        )}
        {msgData?.length === 0 && (
          <Empty
            description="暂无留言"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ width: '100%', marginBottom: '16px' }}
          />
        )}
      </div>
      <div className="edit-drawer-wrapper">
        {drawerVisible ? (
          <div className="edit-drawer" style={{ maxHeight: drawerVisible ? '80%' : 0 }}>
            <TextArea
              allowClear
              autoFocus
              autoSize={{
                minRows: 3,
                maxRows: 7,
              }}
              onBlur={() => {
                // console.log('BLUR_BLUR');
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
