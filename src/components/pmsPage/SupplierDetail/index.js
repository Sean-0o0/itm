import React, { useEffect, useState } from 'react';
import TopConsole from './TopConsole';
import BasicInfo from './BasicInfo';
import TableTabs from './TableTabs';
import { QuerySupplierDetailInfo, QuerySupplierList } from '../../../services/pmsServices';

export default function SupplierDetail(props) {
  const { dictionary, routes, splId = -2 } = props;
  const { GYSLX } = dictionary;
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
    QuerySupplierDetailInfo({
      current: 1,
      pageSize: 10,
      paging: -1,
      queryType: 'ALL',
      sort: 'string',
      supplierId,
      total: -1,
    })
      .then(res => {
        if (res?.success) {
          setDetailData({
            splInfo: JSON.parse(res.gysxxRecord)[0], //供应商
            overviewInfo: JSON.parse(res.zlxxRecord)[0], //总览
            contactInfo: JSON.parse(res.lxrxxRecord), //联系人
            prjPurchase: JSON.parse(res.cgxmRecord), //采购项目
            HROutsource: JSON.parse(res.rlwbRecord), //人力外包
            splEvaluation: JSON.parse(res.gyspjRecord), //供应商评价
          });
          // console.log('🚀 ~ file: index.js:44 ~ getDetailData', {
          //   splInfo: JSON.parse(res.gysxxRecord), //供应商
          //   overviewInfo: JSON.parse(res.zlxxRecord), //总览
          //   contactInfo: JSON.parse(res.lxrxxRecord), //联系人
          //   prjPurchase: JSON.parse(res.cgxmRecord), //采购项目
          //   HROutsource: JSON.parse(res.rlwbRecord), //人力外包
          //   splEvaluation: JSON.parse(res.gyspjRecord), //供应商评价
          // });
        }
      })
      .catch(e => {
        console.error('QuerySupplierDetailInfo', e);
      });
  };
  return (
    <div className="supplier-detail-box">
      <TopConsole detailData={detailData} routes={routes} GYSLX={GYSLX} getDetailData={getDetailData} splId={splId}/>
      <BasicInfo />
      <TableTabs />
    </div>
  );
}
