import React, { useEffect, useState, useRef, useCallback, Fragment } from 'react';
import { Button, message, Input, Spin, Empty, Modal, Tooltip } from 'antd';
import moment from 'moment';
import { FetchQueryCustomReportList } from '../../../../services/pmsServices';

export default function SiderRptList(props) {
  const { dataProps = {}, funcProps = {} } = props;
  const {
    status = 'unSlt',
    rptList,
    rptOrigin,
    activeBbData = {},
    basicData = {},
    selectedOrigin = {},
    isFold,
  } = dataProps;
  const {
    getEditData,
    setRptList,
    getBasicData,
    setStatus,
    hangleDataRestore,
    getIsSaved,
    setRptName,
    setRptNameOrigin,
    setSelectingData,
    setSelectedData,
    setActiveBbData,
    setIsFold,
  } = funcProps;
  // const [bbmc, setBbmc] = useState(''); //报表名称
  // const [isSpinning, setIsSpinning] = useState(false); //加载状态
  // const listRef = useRef(null); //滚动元素
  // const curPage = useRef(1); //当前页码
  // const isNoMoreData = useRef(false); //无更多数据

  let timer = null;

  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, []);

  //滚动监听
  // useEffect(() => {
  //   const container = listRef.current;
  //   container.addEventListener('scroll', handleScroll);
  //   return () => {
  //     container.removeEventListener('scroll', handleScroll);
  //   };
  // }, [handleScroll, listRef]);

  //处理滚动之底部
  // const handleScroll = useCallback(() => {
  //   const container = listRef.current;
  //   if (container.scrollHeight - (container.clientHeight + container.scrollTop) < 20) {
  //     // 滚动到底部了
  //     debounce(() => {
  //       // console.log('滚动到底部了', isNoMoreData);
  //       if (!isNoMoreData.current) {
  //         curPage.current = curPage.current + 1;
  //         getRptList(bbmc, curPage.current + 1);
  //       }
  //     }, 500);
  //   }
  // }, [isNoMoreData, curPage]);

  //搜索
  const handleInputChange = e => {
    e.persist();
    // debounce(() => {
    //   setBbmc(e.target.value);
    //   getRptList(e.target.value, 1);
    // }, 500);
    debounce(() => {
      // setBbmc(e.target.value);
      // getRptList(e.target.value, 1);
      if (e.target.value !== '' && e.target.value !== undefined) {
        const re = new RegExp(e.target.value, 'i'); // "i" 表示忽略大小写
        const result = [...rptOrigin].filter(item => re.test(item.BBMC));
        setRptList(result);
      } else {
        setRptList([...rptOrigin]);
      }
    }, 500);
  };

  //报表块
  const getRptItem = ({ BBID, BBMC = '--', CJR = '--', CJRID, FXR = '', SFSC = '0' }) => {
    const handleSlt = (bbid, bbmc, cjrid) => {
      if (bbid !== activeBbData.bbid) {
        if (!getIsSaved(status)) {
          Modal.confirm({
            title: '提示：',
            content: `当前报表未保存，是否确定离开？`,
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              setStatus('slted');
              setActiveBbData({ bbid, bbmc, cjrid });
            },
          });
        } else {
          setStatus('slted');
          setActiveBbData({ bbid, bbmc, cjrid });
        }
      }
    };
    return (
      <div
        className="rpt-item"
        key={BBID}
        onClick={() => handleSlt(BBID, BBMC, CJRID)}
        style={activeBbData.bbid === BBID ? { backgroundColor: '#3361ff1a' } : {}} //选中样式
      >
        <div className="top">
          <Tooltip title={BBMC} placement="topLeft">
            <span>{BBMC}</span>
          </Tooltip>
          {SFSC === 1 && <i className="iconfont icon-star-fill" />}
        </div>
        <div className="bottom">
          创建人：{CJR}
          <span>|</span>
          {FXR.includes(';') ? '公开' : '仅个人可见'}
        </div>
      </div>
    );
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

  //新建
  const handleAddRpt = () => {
    if (!getIsSaved(status)) {
      Modal.confirm({
        title: '提示：',
        content: `当前报表未保存，是否确定离开？`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          if (
            basicData.conditionFilter?.length === 0 ||
            selectedOrigin.conditionFilter?.length === 0
          ) {
            //需要获取基础数据
            getBasicData();
          } else {
            hangleDataRestore();
          }
          setStatus('adding');
        },
      });
    } else {
      if (basicData.conditionFilter?.length === 0 || selectedOrigin.conditionFilter?.length === 0) {
        //需要获取基础数据
        getBasicData();
      } else {
        hangleDataRestore();
      }
      setStatus('adding');
    }
    setSelectedData({
      ...selectedOrigin,
    });
    setSelectingData({
      conditionFilter: [],
      conditionGroup: [],
      columnFields: [],
    });
    setRptName('未命名报表');
    setRptNameOrigin('未命名报表');
    setActiveBbData({ bbid: -1, bbmc: '未命名报表', cjrid: -1 });
  };

  return (
    <div className="rpt-sider" style={isFold ? { width: 0 } : {}}>
      <div
        className="unfold-icon"
        style={!isFold ? { width: 0, overflow: 'hidden' } : {}}
        onClick={() => setIsFold(false)}
      >
        <i className="iconfont icon-right" />
      </div>
      {!isFold && (
        <Fragment>
          <div className="fold-icon" onClick={() => setIsFold(true)}>
            <i className="iconfont icon-left" />
          </div>
          <div className="title-row">
            我的报表
            <span
              onClick={status === 'adding' ? () => {} : handleAddRpt}
              style={status === 'adding' ? { cursor: 'not-allowed' } : {}}
            >
              <i className="iconfont circle-add" />
              新建
            </span>
          </div>
          <Input
            allowClear
            onChange={handleInputChange}
            placeholder="请输入报表名称"
            suffix={<i className="iconfont icon-search-name" />}
          />
          <div className="rpt-list">
            {rptList.map(x => getRptItem(x))}
            {rptList.length === 0 && (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
            )}
          </div>
        </Fragment>
      )}
    </div>
  );
}
