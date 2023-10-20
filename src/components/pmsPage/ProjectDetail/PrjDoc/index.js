import React, { useEffect, useCallback } from 'react';
import {
  Collapse,
  Dropdown,
  Empty,
  Icon,
  Menu,
  message,
  Pagination,
  Popover,
  Spin,
  Timeline,
  Tooltip,
} from 'antd';
import moment from 'moment';
import config from '../../../../utils/config';
import axios from 'axios';
import { InsertFileDownloadRecord, QueryProjectFiles } from '../../../../services/pmsServices';

const { api } = config;
const {
  pmsServices: { queryFileStream },
} = api;

export default function PrjDoc(props) {
  const { prjDocData = {}, getPrjDocData, setPrjDocData, prjData = {}, isLeader } = props;
  let LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  let LOGIN_USER_NAME = LOGIN_USER_INFO.name; //定义在方法外 或 使用const定义在方法内，均不会即时刷新数据
  let LOGIN_USER_ID = String(LOGIN_USER_INFO.id); //定义在方法外 或 使用const定义在方法内，均不会即时刷新数据

  useEffect(() => {
    return () => {};
  }, []);

  //允许下载
  const allowDownload = () => {
    const arr = prjData.member?.reduce((acc, cur) => [...acc, String(cur.RYID)], []) || [];
    // console.log('🚀 ~ file: index.js:39 ~ allowDownload ~ arr:', arr, LOGIN_USER_ID, isLeader);
    return arr.includes(LOGIN_USER_ID) || isLeader;
  };

  //里程碑下拉菜单
  const lcbContent = () => {
    const onLcbChange = (obj = {}) => {
      setPrjDocData(p => ({
        ...p,
        curLcb: obj,
        lcb: p.lcbOrigin.filter(x => x.LCBID !== obj.LCBID),
      }));
      getPrjDocData({ LCBID: obj.LCBID });
    };
    return (
      <Menu>
        {prjDocData.lcb?.map(x => (
          <Menu.Item style={{ textAlign: 'left' }} onClick={() => onLcbChange(x)} key={x.LCBID}>
            {x.LCB}（{x.WDSL}）
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  //操作记录浮窗
  const historyContent = () => {
    return (
      <Timeline className="history-box" style={{ width: 240, paddingTop: 0 }}>
        <div className="download-record-title">下载记录</div>
        <Spin spinning={prjDocData.historyLoading} tip="加载中">
          {prjDocData.history?.map((x, i) => (
            <Timeline.Item
              color="#3361ff"
              className={
                'history-item' +
                (prjDocData.history.length - 1 === i ? ' only-one-history-item' : '')
              }
              key={i}
            >
              <div>{JSON.parse(x.CZSM || '{}')?.czr}</div>
              <span>{x.CZSJ && moment(x.CZSJ).format('YYYY-MM-DD HH:mm:ss')}</span>
            </Timeline.Item>
          ))}
          {prjDocData.history?.length === 0 && (
            <Empty
              description="暂无记录"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ margin: 0 }}
            />
          )}
        </Spin>
      </Timeline>
    );
  };

  //页面切换
  const handlePageChange = (current, pageSize) => {
    getPrjDocData({ current, pageSize, LCBID: prjDocData.curLcb?.LCBID });
  };

  //文档下载
  const handleFilePreview = (id, fileName, extr) => {
    setPrjDocData(p => ({ ...p, loading: true }));
    axios({
      method: 'POST',
      url: queryFileStream,
      responseType: 'blob',
      data: {
        objectName: 'TWD_XM',
        columnName: 'DFJ',
        id,
        title: fileName,
        extr,
        type: '',
      },
    })
      .then(res => {
        const href = URL.createObjectURL(res.data);
        console.log('🚀 ~ file: index.js:121 ~ handleFilePreview ~ res.data:', res.data);
        const a = document.createElement('a');
        a.download = fileName;
        a.href = href;
        a.click();
        window.URL.revokeObjectURL(a.href);
        //插入项目文档下载记录
        InsertFileDownloadRecord({
          fileId: Number(id),
          userName: LOGIN_USER_NAME,
        })
          .then(res => {
            console.log('🚀 ~ file: index.js:88 ~ handleFilePreview ~ res:', res);
            if (res?.success) {
              setPrjDocData(p => ({ ...p, loading: false }));
            }
          })
          .catch(e => {
            console.error('🚀文档下载记录保存失败', e);
            message.error('文档下载记录保存失败', 1);
            setPrjDocData(p => ({ ...p, loading: false }));
          });
      })
      .catch(err => {
        message.error('文档下载失败', 1);
        setPrjDocData(p => ({ ...p, loading: false }));
      });
  };

  //文档下载记录
  const getHistoryData = fileId => {
    setPrjDocData(p => ({ ...p, historyLoading: true }));
    QueryProjectFiles({
      current: 1,
      fileId: Number(fileId),
      pageSize: 10,
      paging: -1,
      // projectId: Number(xmid),
      queryType: 'XZJL',
      sort: '',
      total: -1,
    })
      .then(res => {
        if (res?.success) {
          setPrjDocData(p => ({
            ...p,
            history: JSON.parse(res.xzjlResult),
            historyLoading: false,
          }));
        }
      })
      .catch(e => {
        console.error('🚀文档下载记录', e);
        message.error('文档下载记录获取失败', 1);
        setPrjDocData(p => ({ ...p, historyLoading: false }));
      });
  };

  //跳转在线文档
  const jumpToZxwd = url => {
    window.open(url);
  };

  if (prjDocData.data?.length === 0) return null;
  return (
    <div className="prj-doc-box">
      <div className="top-title">
        项目文档
        <Dropdown
          overlay={lcbContent()}
          placement="bottomRight"
          overlayClassName="tc-btn-more-content-dropdown"
        >
          <span style={prjDocData.loading ? { pointerEvents: 'none' } : {}}>
            {prjDocData.curLcb?.LCB}（{prjDocData.curLcb?.WDSL}）
            {prjDocData.loading ? (
              <Icon type="loading" className="iconfont icon-down" />
            ) : (
              <i className="iconfont icon-down" />
            )}
          </span>
        </Dropdown>
      </div>
      <div className="doc-list">
        <Spin spinning={prjDocData.loading} tip="加载中">
          <Collapse
            // accordion
            bordered={false}
            // defaultActiveKey={[data.children[0]?.value]}
            expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          >
            {prjDocData.data.map(x =>
              x.ZXWD ? (
                <Collapse.Panel header={x.WDLX + `（${x.WDSL}）`} key={x.WDID}>
                  <div
                    className="doc-item"
                    key={x.ZXWDMC}
                    style={allowDownload() ? {} : { color: '#303133', cursor: 'default' }}
                  >
                    <Tooltip
                      title={x.ZXWDMC}
                      placement="topLeft"
                      onClick={() => (allowDownload() ? jumpToZxwd(x.ZXWD) : {})}
                    >
                      {x.ZXWDMC}
                    </Tooltip>
                  </div>
                </Collapse.Panel>
              ) : (
                <Collapse.Panel
                  header={x.WDLX + `（${JSON.parse(x.WDFJ || '{}')?.items?.length}）`}
                  key={x.WDID}
                >
                  {JSON.parse(x.WDFJ || '{}')?.items?.map(y => (
                    <div
                      className="doc-item"
                      key={y[0]}
                      style={allowDownload() ? {} : { color: '#303133', cursor: 'default' }}
                    >
                      <Tooltip
                        title={y[1]}
                        placement="topLeft"
                        onClick={() =>
                          allowDownload() ? handleFilePreview(x.WDID, y[1], y[0]) : {}
                        }
                      >
                        {y[1]}
                      </Tooltip>
                      <Popover
                        placement="bottomRight"
                        content={historyContent()}
                        overlayClassName="custom-rpt-management-popover"
                        title={null}
                        trigger="click"
                        onVisibleChange={v => setPrjDocData(p => ({ ...p, history: [] }))}
                        arrowPointAtCenter
                      >
                        <i
                          className="iconfont icon-history"
                          onClick={() => getHistoryData(x.WDID)}
                        />
                      </Popover>
                    </div>
                  ))}
                </Collapse.Panel>
              ),
            )}
          </Collapse>
        </Spin>
      </div>
      <div className="footer-pagination">
        <Pagination
          size="small"
          current={prjDocData.current}
          pageSize={prjDocData.pageSize}
          total={prjDocData.pageTotal}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
}
