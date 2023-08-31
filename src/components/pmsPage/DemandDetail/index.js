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
  const { WBSWLX = [], WBRYGW = [], DFZT } = dictionary;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [dtlData, setDtlData] = useState({}); //详情信息
  const [isDock, setIsDock] = useState(false); //是否为外包项目对接人 - 权限控制
  const LOGIN_USER_ID = JSON.parse(sessionStorage.getItem('user'))?.id;
  const isAuth = isDock || String(LOGIN_USER_ID) === String(fqrid); //是否为外包项目对接人或需求发起人
  const [curXqid, setCurXqid] = useState(xqid); //当前xqid
  const [curFqrid, setCurFqrid] = useState(fqrid); //当前fqrid
  const [activeKey, setActiveKey] = useState(xqid); //高亮的需求tab id

  useEffect(() => {
    if (xqid !== -2 && WBRYGW.length !== 0 && WBSWLX.length !== 0) {
      setActiveKey(String(xqid));
      // console.log('🚀 ~ file: index.js:338 ~ DemandDetail ~ xqid, WBSWLX, fqrid:', xqid);
      getDtldata(xqid, fqrid);
    }
    return () => {};
  }, [xqid, fqrid, JSON.stringify(WBRYGW), JSON.stringify(WBSWLX)]);

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
                          let { XQID, SWLX, SWMC, ZXZT, SWZXID, WBSWID, THRY } = curr;
                          SWLX = WBSWLX?.filter(x => x.ibm === SWLX)[0]?.note ?? SWLX;
                          if (!acc[SWLX]) {
                            acc[SWLX] = { XQID, WBSWID, SWLX, SXDATA: [{ SWMC, ZXZT, SWZXID, THRY }] };
                          } else {
                            acc[SWLX].SXDATA.push({ SWMC, ZXZT, SWZXID, THRY });
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
                  x.GW = WBRYGW?.filter(y => y.ibm === x.GW)[0]?.note ?? '--';
                });
                const xqnr2 = xqnr.map(item1 => {
                  const jldata =
                    JSON.parse(res.jlxx).length === 0
                      ? []
                      : JSON.parse(res.jlxx)[0].GYSID === undefined
                      ? []
                      : JSON.parse(res.jlxx)
                          .filter(item2 => item1.XQNRID === item2.RYXQ)
                          .map(item2 => {
                            const items = JSON.parse(item2.JLMC).items;
                            const jldataItem = items.map(([entryNo, fileName]) => ({
                              GYSID: item2.GYSID,
                              GYSMC: item2.GYSMC,
                              JLID: item2.JLID,
                              ENTRYNO: entryNo,
                              JLMC: fileName,
                              ZT: item2.ZT,
                              NEXTID: JSON.parse(item2.JLMC).nextId,
                            }));
                            return jldataItem;
                          })
                          .flat();
                  return {
                    ...item1,
                    JLDATA: jldata.filter(x => x.JLMC.substring(0, 4) !== '%no%'), //过滤有不分发标记的
                  };
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
                          let { RYXQ, GYSID, GYSMC, JLID, JLMC, ZT } = curr;
                          if (!acc[GYSID]) {
                            acc[GYSID] = { RYXQ, GYSID, GYSMC, JLID, JLDATA: [{ JLID, JLMC, ZT }] };
                          } else {
                            acc[GYSID].JLDATA.push({ JLID, JLMC, ZT });
                          }
                          return acc;
                        }, {}),
                      );
                jlxx.forEach(x => {
                  let jldata = [];
                  x.JLDATA.map(y => {
                    // console.log('🚀 ~ file: index.js:115 ~ getDtldata ~ y:', y);
                    let arr = JSON.parse(y.JLMC)?.items?.map(z => {
                      return {
                        JLID: y.JLID,
                        ENTRYNO: z[0],
                        JLMC: z[1],
                        ZT: y.ZT,
                        NEXTID: JSON.parse(y.JLMC)?.nextId,
                      };
                    });
                    jldata = jldata.concat(arr);
                  });
                  x.JLDATA = jldata;
                });

                const output = JSON.parse(res.jlxx).reduce((acc, cur) => {
                  const { RYXQ, RYXQNR, GYSID, GYSMC, JLID, JLMC } = cur;
                  const jlData = JSON.parse(JLMC).items.map(([entryNo, jlmc]) => ({
                    JLID,
                    ENTRYNO: entryNo,
                    JLMC: jlmc,
                    NEXTID: JSON.parse(JLMC).nextId,
                  }));
                  acc[RYXQ] = acc[RYXQ] || { RYXQ, RYXQNR, DATA: [] };
                  const ryData = acc[RYXQ].DATA.find(ry => ry.GYSID === GYSID);
                  if (ryData) {
                    ryData.JLDATA.push(...jlData);
                  } else {
                    acc[RYXQ].DATA.push({
                      GYSID,
                      GYSMC,
                      JLDATA: jlData,
                    });
                  }
                  acc[RYXQ].DATA.sort((a, b) => (a.GYSID > b.GYSID ? 1 : -1));
                  acc[RYXQ].DATA.forEach(ry =>
                    ry.JLDATA.sort((a, b) => (a.JLMC > b.JLMC ? 1 : -1)),
                  );
                  return acc;
                }, {});

                const jlxx2 = Object.values(output).sort((a, b) => (a.RYXQ > b.RYXQ ? 1 : -1));

                const obj = {
                  XMXX: JSON.parse(res.xmxx)[0],
                  XQXQ: JSON.parse(res.xqxq),
                  XQSX: xqsx,
                  XQNR: xqnr2,
                  JLXX: jlxx, //简历信息展示
                  JLXX2: jlxx2, //简历查看使用
                  LYSQ: JSON.parse(res.lysq)[JSON.parse(res.lysq).length - 1] ?? {},
                  ZHPC: zhpc,
                  FKTX: JSON.parse(res.fktx)[0],
                  XQSX_ORIGIN: JSON.parse(res.xqsx),
                };
                console.log('🚀 ~ file: index.js:379 ~ getDtldata ~ obj:', obj);
                setDtlData({
                  ...obj,
                });
                setIsSpinning(false);
              }
            })
            .catch(e => {
              console.error(e);
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
          activeKey={activeKey}
          setActiveKey={setActiveKey}
        />
        <ProjectItems
          dtlData={dtlData}
          isDock={isDock}
          isAuth={isAuth}
          isFqr={String(LOGIN_USER_ID) === String(fqrid)}
          xqid={curXqid}
          fqrid={curFqrid}
          getDtldata={getDtldata}
          WBRYGW={WBRYGW}
          dictionary={dictionary}
          routes={routes}
        />
        <DemandTable
          dtlData={dtlData}
          fqrid={curFqrid}
          setIsSpinning={setIsSpinning}
          isDock={isDock}
          xqid={curXqid}
        />
        <EvaluationTable
          dtlData={dtlData}
          dictionary={dictionary}
          isAuth={isAuth}
          xqid={curXqid}
          fqrid={curFqrid}
          getDtldata={getDtldata}
          isDock={isDock}
        />

        <EmploymentInfo dtlData={dtlData} isAuth={isAuth} setIsSpinning={setIsSpinning} />
        <ResumeInfo dtlData={dtlData} isAuth={isAuth} setIsSpinning={setIsSpinning} />
      </div>
    </Spin>
  );
}
