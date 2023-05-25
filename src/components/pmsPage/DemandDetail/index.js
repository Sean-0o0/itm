import React, { useEffect, useState } from 'react';
import TopConsole from './TopConsole';
import { QueryRequirementDetail, QueryUserRole } from '../../../services/pmsServices/index';
import { message, Spin } from 'antd';
import ProjectItems from './ProjectItems';
import DemandTable from './DemandTable';
import ResumeInfo from './ResumeInfo';
import EvaluationTable from './EvaluationTable';
import EmploymentInfo from './EmploymentInfo';
// import { FetchQueryProjectLabel } from '../../../services/projectManage';

export default function DemandDetail(props) {
  const { routes, xqid = -2, fqrid = -2, dictionary } = props;
  const { WBSWLX = [], WBRYGW = [] } = dictionary;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [dtlData, setDtlData] = useState({}); //详情信息
  const [isDock, setIsDock] = useState(false); //是否为外包项目对接人 - 权限控制
  const LOGIN_USER_ID = JSON.parse(sessionStorage.getItem('user'))?.id;
  const isAuth = isDock || LOGIN_USER_ID === fqrid; //是否为外包项目对接人或需求发起人
  const [curXqid, setCurXqid] = useState(xqid); //当前xqid
  const [curFqrid, setCurFqrid] = useState(fqrid); //当前fqrid

  useEffect(() => {
    if (xqid !== -2) {
      // console.log(
      //   '🚀 ~ file: index.js:338 ~ DemandDetail ~ xqid, WBSWLX, fqrid:',
      //   xqid,
      //   WBSWLX,
      //   fqrid,
      // );
      getDtldata(xqid, fqrid);
    }
    return () => {};
  }, [xqid, fqrid, WBRYGW, WBSWLX]);

  //获取详情数据
  const getDtldata = (xqid, fqrid) => {
    setIsSpinning(true);
    setCurFqrid(fqrid);
    setCurXqid(xqid);
    QueryUserRole({
      userId: Number(LOGIN_USER_ID),
    })
      .then(res => {
        if (res.code === 1) {
          setIsDock(res.zyrole === '外包项目对接人');
          QueryRequirementDetail({
            current: 1,
            pageSize: 10,
            paging: -1,
            sort: '',
            total: -1,
            cxlx: 'ALL',
            js:
              res.zyrole === '外包项目对接人'
                ? res.zyrole
                : String(LOGIN_USER_ID) === fqrid
                ? '需求发起人'
                : res.role,
            xqid,
          })
            .then(res => {
              if (res.code === 1) {
                const xqsx =
                  JSON.parse(res.xqsx).length === 0
                    ? []
                    : JSON.parse(res.xqsx)[0].XQID === undefined
                    ? []
                    : Object.values(
                        JSON.parse(res.xqsx)?.reduce((acc, curr) => {
                          let { XQID, SWLX, SWMC, ZXZT, SWZXID, WBSWID } = curr;
                          SWLX = WBSWLX?.filter(x => x.ibm === SWLX)[0]?.note;
                          if (!acc[SWLX]) {
                            acc[SWLX] = { XQID, WBSWID, SWLX, SXDATA: [{ SWMC, ZXZT, SWZXID }] };
                          } else {
                            acc[SWLX].SXDATA.push({ SWMC, ZXZT, SWZXID });
                          }
                          return acc;
                        }, {}),
                      );
                const xqnr =
                  JSON.parse(res.xqnr).length === 0
                    ? []
                    : JSON.parse(res.xqnr)[0].XQNRID === undefined
                    ? []
                    : JSON.parse(res.xqnr);
                xqnr.forEach(x => {
                  x.GW = WBRYGW?.filter(y => y.ibm === x.GW)[0]?.note;
                });
                const zhpc =
                  JSON.parse(res.zhpc).length === 0
                    ? []
                    : JSON.parse(res.zhpc)[0].PCID === undefined
                    ? []
                    : JSON.parse(res.zhpc);
                zhpc.forEach(x => {
                  x.GW = WBRYGW?.filter(y => y.ibm === x.GW)[0]?.note;
                });
                const jlxx =
                  JSON.parse(res.jlxx).length === 0
                    ? []
                    : JSON.parse(res.jlxx)[0].GYSID === undefined
                    ? []
                    : Object.values(
                        JSON.parse(res.jlxx)?.reduce((acc, curr) => {
                          let { GYSID, GYSMC, JLID, JLMC } = curr;
                          if (!acc[GYSID]) {
                            acc[GYSID] = { GYSID, GYSMC, JLID, JLDATA: [{ JLID, JLMC }] };
                          } else {
                            acc[GYSID].JLDATA.push({ JLID, JLMC });
                          }
                          return acc;
                        }, {}),
                      );
                jlxx.forEach(x => {
                  let jldata = [];
                  let jldata2 = [];
                  x.JLDATA.map(y => {
                    let arr = JSON.parse(y.JLMC)?.items?.map(z => {
                      return {
                        JLID: y.JLID,
                        ENTRYNO: z[0],
                        JLMC: z[1],
                      };
                    });
                    let arr2 = JSON.parse(y.JLMC)?.items;
                    jldata2 = {
                      nextId: JSON.parse(y.JLMC)?.nextId,
                      items: jldata2.concat(arr2),
                    };
                    jldata = jldata.concat(arr);
                  });
                  x.JLDATA = jldata;
                  x.JLORIGINDATA = jldata2;
                });
                const obj = {
                  XMXX: JSON.parse(res.xmxx)[0],
                  XQXQ: JSON.parse(res.xqxq),
                  XQSX: xqsx,
                  XQNR: xqnr,
                  JLXX: jlxx,
                  LYSQ: JSON.parse(res.lysq)[0],
                  ZHPC: zhpc,
                  FKTX: JSON.parse(res.fktx)[0],
                };
                console.log('🚀 ~ file: index.js:379 ~ getDtldata ~ obj:', obj);
                setDtlData({
                  ...obj,
                });
                setIsSpinning(false);
              }
            })
            .catch(e => {
              message.error('详情信息获取失败', 1);
            });
        }
      })
      .catch(e => {
        message.error('用户信息查询失败', 1);
      });
  };

  return (
    <Spin
      spinning={isSpinning}
      tip="加载中"
      size="large"
      wrapperClassName="diy-style-spin-demand-detail"
    >
      <div className="demand-detail-box">
        <TopConsole
          xqid={xqid}
          routes={routes}
          dtlData={dtlData}
          isAuth={isAuth}
          getDtldata={getDtldata}
        />
        <ProjectItems
          dtlData={dtlData}
          isAuth={isAuth}
          xqid={curXqid}
          fqrid={curFqrid}
          getDtldata={getDtldata}
        />
        <DemandTable dtlData={dtlData} />
        <ResumeInfo dtlData={dtlData} isAuth={isAuth} setIsSpinning={setIsSpinning} />
        <EvaluationTable dtlData={dtlData} dictionary={dictionary} isAuth={isAuth} />
        <EmploymentInfo dtlData={dtlData} isAuth={isAuth} setIsSpinning={setIsSpinning} />
      </div>
    </Spin>
  );
}
