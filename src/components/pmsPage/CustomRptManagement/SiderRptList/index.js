import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Button, message, Input, Spin, Empty, Modal } from 'antd';
import moment from 'moment';
import { FetchQueryCustomReportList } from '../../../../services/pmsServices';

export default function SiderRptList(props) {
  const { dataProps = {}, funcProps = {} } = props;
  const { status = 'normal', rptList, rptOrigin } = dataProps;
  const { setStatus, hangleDataRestore, getEditData, setRptList } = funcProps;
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
    const handleEdit = id => {
      // if (status === 'adding') {
      //   Modal.confirm({
      //     title: '提示：',
      //     content: `请确保当前报表已保存，是否确定离开？`,
      //     okText: '确定',
      //     cancelText: '取消',
      //     onOk: () => {
      //       hangleDataRestore();
      //       getEditData(id);
      //     },
      //   });
      // } else if (status === 'editing') {
      //   Modal.confirm({
      //     title: '提示：',
      //     content: `请确保当前报表已保存，是否确定离开？`,
      //     okText: '确定',
      //     cancelText: '取消',
      //     onOk: () => {
      //       hangleDataRestore();
      //       getEditData(id);
      //     },
      //   });
      // } else {
      //   getEditData(id);
      // }
      hangleDataRestore();
      getEditData(id);
    };
    return (
      <div className="rpt-item" key={BBID} onClick={() => handleEdit(BBID)}>
        <div className="top">
          {BBMC}
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
    if (status === 'normal') {
      setStatus('adding');
    } else {
      // Modal.confirm({
      //   title: '提示：',
      //   content: `请确保当前报表已保存，是否确定离开？`,
      //   okText: '确定',
      //   cancelText: '取消',
      //   onOk: () => {
          hangleDataRestore();
          setStatus('adding');
      //   },
      // });
    }
  };

  return (
    <div className="rpt-sider">
      <div className="title-row">
        我的报表
        <span onClick={handleAddRpt}>
          <i className="iconfont circle-add" />
          新建
        </span>
      </div>
      <Input
        allowClear
        onChange={handleInputChange}
        placeholder="请输入"
        suffix={<i className="iconfont icon-search-name" />}
      />
      <div
        className="rpt-list"
        // ref={listRef}
      >
        {rptList.map(x => getRptItem(x))}
        {rptList.length === 0 && (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
        )}
        {/* {rptList.length !== 0 && isNoMoreData.current && (
          <div className="no-more-data">无更多数据</div>
        )} */}
        {/* <Spin spinning={isSpinning} /> */}
      </div>
    </div>
  );
}
