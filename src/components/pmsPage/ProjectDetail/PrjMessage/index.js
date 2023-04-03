import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import moment from 'moment';
import { Drawer, Popover, Input, Button, message, Empty, Spin } from 'antd';
import { set } from 'store';
import { QueryProjectMessages, UpdateProjectMessages } from '../../../../services/pmsServices';
const { TextArea } = Input;

export default function PrjMessage(props) {
  const [drawerVisible, setDrawerVisible] = useState(false); //编辑
  const [msgData, setMsgData] = useState([]); //留言信息
  const [editingIndex, setEditingIndex] = useState(-1); //正在编辑的留言id
  const [editContent, setEditContent] = useState(''); //编辑的留言内容
  const [newMsg, setNewMsg] = useState(false); //是否位新增留言
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [updatePage, setUpdatePage] = useState(-1); //刷新数据
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  const { xmid } = props;
  const nodeArr = document.getElementsByClassName('content msg-node');
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
    if (nodeArr.length !== 0) {
      let data = [...msgData];
      for (let i = 0; i < nodeArr.length; i++) {
        let x = nodeArr[i];
        data[i].unfold = false;
        data[i].textHide = !(x.clientHeight <= 44 && x.scrollHeight <= 44);
      }
      setMsgData(p => [...data]);
    }
    return () => {};
  }, [msgData.length, ...msgData]);

  //获取留言数据
  const getMsgData = (txt, isDel = false) => {
    setIsSpinning(true);
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
          setIsSpinning(false);
          if (isDel) {
            //删除时刷新数据
            setMsgData(p => [...JSON.parse(res.result)]);
            txt && message.success(txt, 1);
          } else {
            const nodeArrNow = document.getElementsByClassName('content msg-node');
            if (nodeArrNow.length !== 0) {
              //新增、编辑时刷新数据
              let data = [...JSON.parse(res.result)];
              for (let i = 0; i < nodeArrNow.length; i++) {
                let x = nodeArrNow[i];
                if (data[i]) {
                  data[i].textHide = !(x.clientHeight <= 44 && x.scrollHeight <= 44);
                  data[i].unfold = false;
                }
              }
              setUpdatePage(new Date().getTime());
              setMsgData(p => [...data]);
              // console.log('🚀 ~ file: index.js ~ line 72 ~ getMsgData ~ [...data]', [...data]);
              txt && message.success(txt, 1);
            } else {
              //最初获取数据
              setMsgData(p => [...JSON.parse(res.result)]);
            }
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
    isSelf = false,
  }) => {
    const msgEditCotent = (
      <div className="list">
        <div
          className="item"
          onClick={() => {
            setEditingIndex(id);
            setDrawerVisible(true);
            setEditContent(content);
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
          {isSelf && (
            <Popover
              placement="bottom"
              title={null}
              content={msgEditCotent}
              overlayClassName="msg-edit-content-popover"
            >
              <i className="iconfont icon-more" />
            </Popover>
          )}
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
                    if (x.ID === id) {
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
                    if (x.ID === id) {
                      x.unfold = true;
                    }
                  });
                  setMsgData(p => [...arr]);
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
          getMsgData('留言删除成功', true);
        }
      })
      .catch(e => {
        console.error('UpdateProjectMessages', e);
      });
  };

  return (
    <Spin spinning={isSpinning} tip="加载中" size="small">
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
              isSelf: String(item.LYRID) === String(LOGIN_USER_INFO.id),
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
                defaultValue={editContent}
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
                    setEditContent('');
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
    </Spin>
  );
}
