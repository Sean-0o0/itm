import React, { useEffect, useState, Fragment, useLayoutEffect, useCallback, useRef } from 'react';
import { Avatar, Badge, Button, Drawer, Icon, message, Popconfirm, Spin } from 'antd';
import avatarMale from '../../../../assets/homePage/img_avatar_male.png';
import avatarFemale from '../../../../assets/homePage/img_avatar_female.png';
import moment from 'moment';
import { FetchQueryOwnerMessage, UpdateMessageState } from '../../../../services/pmsServices';
import { Link } from 'react-router-dom';
import { EncryptBase64 } from '../../../../components/Common/Encrypt';

export default function MsgNoticeDrawer(props) {
  const { dataProps = {}, funcProps = {} } = props;
  const { newMsgNum } = dataProps;
  const { getUnreadNum } = funcProps;
  const [data, setData] = useState([]); //消息数据
  const [visible, setVisible] = useState(false); //详情显隐
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const curPage = useRef(1); //当前页码
  const isNoMoreData = useRef(false); //无更多数据
  const container = document.querySelector('.msg-notice-drawer .ant-drawer-body');
  let timer = null;

  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useLayoutEffect(() => {
    if (visible) {
      getMsgData();
    }
    return () => {};
  }, [visible]);

  // 滚动监听
  useLayoutEffect(() => {
    if (visible && container !== null) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [visible, handleScroll, container]);

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

  //处理滚动之底部
  const handleScroll = useCallback(() => {
    if (
      container !== null &&
      container.scrollHeight - (container.clientHeight + container.scrollTop) < 20
    ) {
      // 滚动到底部了
      debounce(() => {
        console.log('滚动到底部了', isNoMoreData);
        if (!isNoMoreData.current) {
          curPage.current = curPage.current + 1;
          handleReachBottom(curPage.current);
        }
      }, 500);
    }
  }, [isNoMoreData, curPage, container]);

  //初始数据
  const getMsgData = async (current = 1) => {
    try {
      setIsSpinning(true);
      //获取消息通知数据
      const res = await FetchQueryOwnerMessage({
        cxlx: 'TX',
        date: Number(new moment().format('YYYYMMDD')),
        paging: 1,
        current,
        pageSize: 50,
        total: -1,
        sort: '',
      });
      if (res.success) {
        setData(res.record);
        isNoMoreData.current = false;
        setIsSpinning(false);
      }
    } catch (e) {
      message.error('消息获取失败', 1);
      console.error('🚀 ~ getMsgData ~ e:', e);
      setIsSpinning(false);
    }
  };

  const handleReachBottom = async (current = 1) => {
    try {
      setIsSpinning(true);
      //获取消息通知数据
      const res = await FetchQueryOwnerMessage({
        cxlx: 'TX',
        date: Number(new moment().format('YYYYMMDD')),
        paging: 1,
        current,
        pageSize: 50,
        total: -1,
        sort: '',
      });
      if (res.success) {
        if (res.totalrows <= 50) {
          setData(res.record);
          isNoMoreData.current = true;
        } else if (res.record.length === 0) {
          isNoMoreData.current = true;
        } else {
          setData(p => [...p, ...res.record]);
        }
        setIsSpinning(false);
      }
    } catch (e) {
      message.error('消息获取失败', 1);
      console.error('🚀 ~ handleReachBottom ~ e:', e);
      setIsSpinning(false);
    }
  };

  const getTitleNode = () => {
    //未读
    const xxidArr = data.reduce((acc, cur) => {
      if (cur.ckzt === '2') return [...acc, cur.xxid];
      return acc;
    }, []);
    const handleAllRead = async () => {
      // console.log('🚀 ~ 未读消息idArr:', xxidArr);
      UpdateMessageState({
        zxlx: 'READ_ALL',
        xxid: -1,
      })
        .then(res => {
          getMsgData();
        })
        .catch(e => {
          console.error('🚀 ~ handleRead ', e);
          message.error('操作失败', 1);
        });
    };
    return (
      <div className="drawer-header">
        消息通知
        {!isSpinning && (
          <div
            className="all-read"
            style={{ marginRight: 6, marginLeft: 'auto' }}
            onClick={() => getMsgData()}
          >
            <Icon type="sync" className="icon-msg-read" />
            刷新
          </div>
        )}
        {!isSpinning && xxidArr.length !== 0 && (
          <Popconfirm title="确定全部设为已读吗？" onConfirm={handleAllRead}>
            <div className="all-read">
              <i className="iconfont icon-msg-read" />
              全部已读
            </div>
          </Popconfirm>
        )}
      </div>
    );
  };

  const getMsgItem = (unread1 = true, obj = {}) => {
    const unread = unread1 && !obj.bgGray;
    const handleRead = () => {
      unread &&
        UpdateMessageState({
          zxlx: 'READ',
          xxid: obj.xxid,
        })
          .then(res => {
            // getMsgData();
            setData(p => {
              let arr = JSON.parse(JSON.stringify(p));
              arr.forEach(x => {
                if (x.xxid === obj.xxid) {
                  x.bgGray = true;
                }
              });
              return arr;
            });
          })
          .catch(e => {
            console.error('🚀 ~ handleRead ', e);
            message.error('操作失败', 1);
          });
    };
    return (
      <div className="msg-item" key={obj.xxid + '-' + obj.ckzt} onClick={handleRead}>
        <Badge dot={unread} offset={[-4, 5]} className="item-avatar">
          <Avatar src={obj.xb === '女' ? avatarFemale : avatarMale} />
        </Badge>
        <div className="item-info" style={unread ? {} : { color: '#909399', fontWeight: 400 }}>
          <div className="info-title">
            {obj.txrmc || '--'}
            <span>{moment(obj.txrq).format('YYYY-MM-DD')}</span>
          </div>
          {obj.xmid && (
            <Link
              onClick={e => {
                e.stopPropagation();
                onClose();
              }}
              to={{
                pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                  JSON.stringify({
                    xmid: Number(obj.xmid),
                  }),
                )}`,
                state: {
                  routes: [],
                },
              }}
              className="info-prj-name"
              style={unread ? {} : { color: '#909399', fontWeight: 400 }}
            >
              {obj.xmmc || ''}
            </Link>
          )}
          <div className="info-detail">{obj.txnr}</div>
        </div>
      </div>
    );
  };
  const onClose = () => {
    setVisible(false);
    setData([]);
    getUnreadNum();
  };

  return (
    <Fragment>
      <div className="msg-notice-box">
        <Badge
          count={newMsgNum}
          offset={newMsgNum > 9 && newMsgNum <= 99 ? [4, 2] : newMsgNum > 99 ? [8, 2] : undefined}
          className="msg-bell"
          onClick={() => setVisible(true)}
        >
          <i className="iconfont icon-message" />
        </Badge>
      </div>
      <Drawer
        title={getTitleNode()}
        width={400}
        visible={visible}
        onClose={onClose}
        className="msg-notice-drawer"
        zIndex={101}
        closable={false}
        maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
      >
        <Spin spinning={isSpinning} tip="加载中">
          {data.map(x => getMsgItem(x.ckzt === '2', x))}
          {data.length !== 0 && isNoMoreData.current && (
            <div className="no-more-data">无更多数据</div>
          )}
        </Spin>
      </Drawer>
    </Fragment>
  );
}
