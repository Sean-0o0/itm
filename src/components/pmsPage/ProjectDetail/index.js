import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import InfoDisplay from './InfoDisplay';
import MileStone from './MileStone';
import PrjMember from './PrjMember';
import PrjMessage from './PrjMessage';
import TopConsole from './TopConsole';
import {
  QueryProjectInfoAll,
  QueryProjectTracking,
  QueryUserRole,
} from '../../../services/pmsServices/index';
import { message, Spin } from 'antd';
import moment from 'moment';
import { FetchQueryProjectLabel } from '../../../services/projectManage';
// import PrjTracking from './PrjTracking';

export default function ProjectDetail(props) {
  const { routes, xmid, dictionary } = props;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [prjData, setPrjData] = useState({}); //项目信息-所有
  const { HJRYDJ, ZSCQLX, RYGW, CGFS } = dictionary; //获奖等级、知识产权类型、岗位、招采方式
  const [isLeader, setIsLeader] = useState(false); //判断用户是否为领导 - 权限控制
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  const [isHwPrj, setIsHwPrj] = useState(false); //是否包含硬件
  const [isHwSltPrj, setIsHwSltPrj] = useState(false); //是否为硬件入围类型
  const [XMLX, setXMLX] = useState([]); //项目类型

  useEffect(() => {
    if (xmid !== -1) {
      setIsSpinning(true);
      getIsLeader();
      // console.log('🚀 ~ ProjectDetail');
      // const htmlContent = document.getElementById('htmlContent');
      // // console.log('🚀 ~ file: index.js ~ line 26 ~ useEffect ~ htmlContent', htmlContent);
      // htmlContent.scrollTop = 0; //页面跳转后滚至顶部
    }
    return () => {};
  }, [HJRYDJ, ZSCQLX, RYGW, CGFS, xmid]);

  //判断用户是否为领导
  const getIsLeader = () => {
    QueryUserRole({
      userId: Number(LOGIN_USER_INFO.id),
    })
      .then(res => {
        // console.log('res.role', res.role);
        setIsLeader(res.role !== '普通人员');
        getXMLX();
      })
      .catch(e => {
        message.error('用户信息查询失败', 1);
        console.error('QueryIsLeader', e);
      });
  };
  const getXMLX = () => {
    FetchQueryProjectLabel({})
      .then(res => {
        if (res?.success) {
          let data = JSON.parse(res.xmlxRecord).map(x => {
            return {
              ibm: x.ID,
              note: x.NAME,
            };
          });
          // console.log('🚀 ~ file: index.js:62 ~ data ~ data:', data);
          setXMLX(p => [...data]);
          getPrjDtlData(data);
        }
      })
      .catch(e => {
        console.error('FetchQueryProjectLabel', e);
        message.error('项目类型查询失败', 1);
      });
  };

  //获取项目跟踪数据
  const getTrackingData = (obj = {}) => {
    QueryProjectTracking({
      projectId: Number(xmid),
      // projectManager
      // org
      // startTime
      // endTime
      // cycle
      queryType: 'ALL',
      // projectType
    })
      .then(res => {
        if (res?.success) {
          let data = { ...obj };
          // data.trackingData = JSON.parse(res.result);
          data.trackingData = [
            {
              XMMC: '人力全流程',
              XMID: 678,
              XMZQ: '第1周',
              XMJL: '萧方赛',
              XMJLID: 11902,
              KSSJ: 20230602,
              JSSJ: 20230608,
              DQJD: '11%',
              DQZT: '进度正常',
              ZYSXSM: '无重要事项报告',
              BZGZNR: '本周无事告知，一切正常',
              XZGZAP: '下周暂无计划',
            },
            {
              XMMC: '人力全流程',
              XMID: 678,
              XMZQ: '第2周',
              XMJL: '萧方赛',
              XMJLID: 11902,
              KSSJ: 20230602,
              JSSJ: 20230608,
              DQJD: '12%',
              DQZT: '低风险',
              ZYSXSM: '无重要事项报告',
              BZGZNR: '本周无事告知，一切正常',
              XZGZAP: '下周暂无计划',
            },
            {
              XMMC: '人力全流程',
              XMID: 678,
              XMZQ: '第3周',
              XMJL: '萧方赛',
              XMJLID: 11902,
              KSSJ: 20230602,
              JSSJ: 20230608,
              DQJD: '13%',
              DQZT: '中风险',
              ZYSXSM: '无重要事项报告',
              BZGZNR: '本周无事告知，一切正常',
              XZGZAP: '下周暂无计划',
            },
            {
              XMMC: '人力全流程',
              XMID: 678,
              XMZQ: '第4周',
              XMJL: '萧方赛',
              XMJLID: 11902,
              KSSJ: 20230602,
              JSSJ: 20230608,
              DQJD: '14%',
              DQZT: '中风险',
              ZYSXSM: '无重要事项报告',
              BZGZNR: '本周无事告知，一切正常',
              XZGZAP: '下周暂无计划',
            },
            {
              XMMC: '人力全流程',
              XMID: 678,
              XMZQ: '第5周',
              XMJL: '萧方赛',
              XMJLID: 11902,
              KSSJ: 20230602,
              JSSJ: 20230608,
              DQJD: '15%',
              DQZT: '中风险',
              ZYSXSM: '无重要事项报告',
              BZGZNR: '本周无事告知，一切正常',
              XZGZAP: '下周暂无计划',
            },
            {
              XMMC: '人力全流程',
              XMID: 678,
              XMZQ: '第6周',
              XMJL: '萧方赛',
              XMJLID: 11902,
              KSSJ: 20230602,
              JSSJ: 20230608,
              DQJD: '16%',
              DQZT: '中风险',
              ZYSXSM: '无重要事项报告',
              BZGZNR: '本周无事告知，一切正常',
              XZGZAP: '下周暂无计划',
            },
          ];
          setPrjData(data);
        }
      })
      .catch(e => {
        message.error('接口信息获取失败', 1);
      });
  };

  //获取项目详情数据
  const getPrjDtlData = xmlxArr => {
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
          let member = p(res.ryxxRecord);
          member.forEach(item => {
            item.GW = RYGW?.filter(x => x.ibm === item.GW)[0]?.note;
          });
          let prjBasic = p(res.xmjbxxRecord, false);
          // console.log('🚀 ~ file: index.js:130 ~ getPrjDtlData ~ prjBasic:', p(res.xmjbxxRecord, false), CGFS);
          setIsHwSltPrj(prjBasic.XMLX === '6');
          setIsHwPrj(prjBasic.SFBHYJ === '1');
          //字典处理
          let award = p(res.hjxxRecord);
          prjBasic.XMLX !== '6' &&
            award.forEach(item => {
              item.RYDJ = HJRYDJ?.filter(x => x.ibm === item.RYDJ)[0]?.note;
              item.ZSCQLX = ZSCQLX?.filter(x => x.ibm === item.ZSCQLX)[0]?.note;
              item.HJSJ = item.HJSJ.slice(0, 10);
            });
          prjBasic.ZBFS = CGFS?.filter(x => x.ibm === prjBasic.ZBFS)[0]?.note;
          if (xmlxArr) {
            prjBasic.XMLX = xmlxArr?.filter(x => x.ibm === prjBasic.XMLX)[0]?.note;
          } else {
            prjBasic.XMLX = XMLX?.filter(x => x.ibm === prjBasic.XMLX)[0]?.note;
          }
          //供应商信息处理
          function uniqueFunc(arr, uniId) {
            const res = new Map();
            return arr.filter(item => !res.has(item[uniId]) && res.set(item[uniId], 1));
          }
          let supplierArr = uniqueFunc(p(res.gysxxRecord), 'GYSID');
          supplierArr.forEach(x => {
            let lxrdata = [];
            p(res.gysxxRecord).forEach(y => {
              if (y.GYSID === x.GYSID) lxrdata.push(y);
            });
            x.LXRDATA = [...lxrdata];
          });
          // console.log("🚀 ~ file: index.js:127 ~ getPrjDtlData ~ supplierArr:", supplierArr)
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
            supplier: supplierArr,
            xmjbxxRecord: p(res.xmjbxxRecord),
          };
          setPrjData(obj);
          // console.log('🚀 ~ getPrjDtlData', obj);
          // getTrackingData(obj);
        }
      })
      .catch(e => {
        console.error('QueryProjectInfoAll', e);
        message.error('项目详情信息查询失败', 1);
      });
  };

  return (
    <Spin
      spinning={isSpinning}
      tip="加载中"
      size="large"
      wrapperClassName="diy-style-spin-prj-detail"
    >
      <div className="prj-detail-box">
        <TopConsole
          xmid={xmid}
          routes={routes}
          prjData={prjData}
          getPrjDtlData={getPrjDtlData}
          isLeader={isLeader}
        />
        <div className="detail-row">
          <div className="col-left">
            <MileStone
              xmid={xmid}
              prjData={prjData}
              getPrjDtlData={getPrjDtlData}
              setIsSpinning={setIsSpinning}
              isLeader={isLeader}
              isHwSltPrj={isHwSltPrj}
            />
            {/* <PrjTracking xmid={xmid} prjData={prjData} /> */}
            <InfoDisplay
              isHwSltPrj={isHwSltPrj}
              prjData={prjData}
              routes={routes}
              xmid={xmid}
              isLeader={isLeader}
            />
          </div>
          <div className="col-right">
            <PrjMember routes={routes} prjData={prjData} dictionary={dictionary} />
            <PrjMessage xmid={xmid} />
          </div>
        </div>
      </div>
    </Spin>
  );
}
