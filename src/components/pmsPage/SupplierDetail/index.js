import React, { useEffect, useState } from 'react';
import TopConsole from './TopConsole';
import BasicInfo from './BasicInfo';
import TableTabs from './TableTabs';
import { QuerySupplierDetailInfo, QuerySupplierList } from '../../../services/pmsServices';
import { Spin, message } from 'antd';

export default function SupplierDetail(props) {
  const { dictionary, routes, splId = -2 } = props;
  const { GYSLX, WBRYGW } = dictionary;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [detailData, setDetailData] = useState({
    splInfo: {}, //供应商
    overviewInfo: {}, //总览
    contactInfo: [], //联系人
    prjPurchase: [], //采购项目
    HROutsource: [], //人力外包
    splEvaluation: [], //供应商评价
  }); //需求数据
  const {
    splInfo = {},
    overviewInfo = {},
    contactInfo = [],
    prjPurchase = [],
    HROutsource = [],
    splEvaluation = [],
  } = detailData;

  useEffect(() => {
    if (splId !== -2) {
      getDetailData(splId);
    }
    // console.log('🚀 ~ file: index.js:31 ~ SupplierDetail ~ splId:', splId);
    return () => {};
  }, [splId]);

  const getDetailData = (supplierId = -1) => {
    setIsSpinning(true);
    QuerySupplierDetailInfo({
      current: 1,
      pageSize: 10,
      paging: 1,
      queryType: 'ALL',
      sort: 'XMID DESC',
      supplierId,
      total: -1,
    })
      .then(res => {
        if (res?.success) {
          setDetailData({
            splInfo: JSON.parse(res.gysxxRecord)[0], //供应商
            overviewInfo: JSON.parse(res.zlxxRecord)[0], //总览
            contactInfo: JSON.parse(res.lxrxxRecord), //联系人
          });
          setIsSpinning(false);
        }
      })
      .catch(e => {
        message.error('供应商详情信息查询失败', 1);
        console.error('QuerySupplierDetailInfo', e);
      });
  };
  return (
    <div className="supplier-detail-box">
      <Spin spinning={isSpinning} tip="加载中" size="large" wrapperClassName="supplier-detail-spin">
        <TopConsole
          detailData={detailData}
          routes={routes}
          GYSLX={GYSLX}
          getDetailData={getDetailData}
          splId={splId}
        />
        <BasicInfo detailData={detailData} splId={splId}/>
        <TableTabs detailData={detailData} WBRYGW={WBRYGW} splId={splId}/>
      </Spin>
    </div>
  );
}
