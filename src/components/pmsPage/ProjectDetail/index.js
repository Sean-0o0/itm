import React, { useEffect, useState } from 'react';
import InfoDisplay from './InfoDisplay';
import MileStone from './MileStone';
import PrjMember from './PrjMember';
import PrjMessage from './PrjMessage';
import TopConsole from './TopConsole';
import { QueryProjectInfoAll } from '../../../services/pmsServices/index';

export default function ProjectDetail(props) {
  const { routes, xmid } = props;

  useEffect(() => {
    getPrjDtlData();
    return () => {};
  }, [props]);

  //获取项目详情数据
  const getPrjDtlData = () => {
    QueryProjectInfoAll({
      current: 1,
      cxlx: 'ALL',
      pageSize: 10,
      paging: -1,
      sort: 'string',
      total: -1,
      xmid,
    })
      .then(res => {
        if (res?.success) {
          console.log('🚀 ~ QueryProjectInfoAll ~ res', res);
        }
      })
      .catch(e => {
        console.error('QueryProjectInfoAll', e);
      });
  };

  return (
    <div className="prj-detail-box">
      <TopConsole routes={routes} />
      <MileStone />
      <div className="detail-row">
        <InfoDisplay />
        <div className="col-right">
          <PrjMember />
          <PrjMessage />
        </div>
      </div>
    </div>
  );
}
