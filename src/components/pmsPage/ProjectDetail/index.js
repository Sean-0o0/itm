import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import InfoDisplay from './InfoDisplay';
import MileStone from './MileStone';
import PrjMember from './PrjMember';
import PrjMessage from './PrjMessage';
import TopConsole from './TopConsole';
import { QueryProjectInfoAll } from '../../../services/pmsServices/index';
import { message } from 'antd';

export default function ProjectDetail(props) {
  const { routes, xmid, dictionary } = props;
  const [prjData, setPrjData] = useState({}); //项目信息-所有
  const { HJRYDJ, ZSCQLX, GWLX, CGFS } = dictionary; //获奖等级、知识产权类型、岗位、招采方式
  // console.log('🚀 ~ file: index.js ~ line 13 ~ ProjectDetail ~ dictionary', dictionary);

  useEffect(() => {
    if (xmid !== -1) {
      getPrjDtlData();
    }
    return () => {};
  }, [xmid]);

  //获取项目详情数据
  const getPrjDtlData = () => {
    QueryProjectInfoAll({
      current: 1,
      cxlx: 'ALL',
      pageSize: 10,
      paging: -1,
      sort: 'string',
      total: -1,
      xmid: Number(xmid),
      // xmid: 334,
    })
      .then(res => {
        if (res?.success) {
          // console.log('🚀 ~ file: index.js ~ line 38 ~ getPrjDtlData ~ res', res);
          const p = (str, isArr = true) => {
            if (isArr) return JSON.parse(str) || [];
            return JSON.parse(str)[0] || {};
          };
          //字典处理
          let award = p(res.hjxxRecord);
          award.forEach(item => {
            item.RYDJ = HJRYDJ?.filter(x => x.ibm === item.RYDJ)[0]?.note;
            item.ZSCQLX = ZSCQLX?.filter(x => x.ibm === item.ZSCQLX)[0]?.note;
          });
          let member = p(res.ryxxRecord);
          member.forEach(item => {
            item.GW = GWLX?.filter(x => x.ibm === item.GW)[0]?.note;
          });
          let prjBasic = p(res.xmjbxxRecord, false);
          prjBasic.ZBFS = CGFS?.filter(x => x.ibm === prjBasic.ZBFS)[0]?.note;
          let obj = {
            prjBasic,
            member,
            demand: p(res.xqxxRecord),
            risk: p(res.fxxxRecord),
            contrast: p(res.htxxRecord, false),
            bidding: p(res.zbxxRecord, false),
            otrSupplier: p(res.qtgysxxRecord),
            award,
            topic: p(res.ktxxRecord),
            payment: p(res.fkxxRecord),
            supplier: p(res.gysxxRecord),
          };
          // console.log('🚀 ~ getPrjDtlData', obj);
          setPrjData(obj);
        }
      })
      .catch(e => {
        console.error('QueryProjectInfoAll', e);
      });
  };
  return (
    <div className="prj-detail-box">
      <TopConsole xmid={xmid} routes={routes} prjData={prjData} getPrjDtlData={getPrjDtlData} />
      <MileStone xmid={xmid} />
      <div className="detail-row">
        <InfoDisplay prjData={prjData} dictionary={dictionary} />
        <div className="col-right">
          <PrjMember routes={routes} prjData={prjData} dictionary={dictionary} />
          <PrjMessage xmid={xmid} />
        </div>
      </div>
    </div>
  );
}
