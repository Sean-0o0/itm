import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import InfoDisplay from './InfoDisplay';
import MileStone from './MileStone';
import PrjMember from './PrjMember';
import PrjMessage from './PrjMessage';
import TopConsole from './TopConsole';
import { QueryProjectInfoAll, QueryUserRole } from '../../../services/pmsServices/index';
import { Spin } from 'antd';

export default function ProjectDetail(props) {
  const { routes, xmid, dictionary } = props;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [prjData, setPrjData] = useState({}); //项目信息-所有
  const { HJRYDJ, ZSCQLX, RYGW, CGFS, XMLX } = dictionary; //获奖等级、知识产权类型、岗位、招采方式
  const [isLeader, setIsLeader] = useState(false); //判断用户是否为领导 - 权限控制
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  // console.log('🚀 ~ file: index.js ~ line 13 ~ ProjectDetail ~ dictionary', dictionary);

  useEffect(() => {
    if (xmid !== -1) {
      setIsSpinning(true);
      getPrjDtlData();
      getIsLeader();
      const htmlContent = document.getElementById('htmlContent');
      // console.log('🚀 ~ file: index.js ~ line 26 ~ useEffect ~ htmlContent', htmlContent);
      htmlContent.scrollTop = 0; //页面跳转后滚至顶部
    }
    return () => {};
  }, [xmid]);

  //判断用户是否为领导
  const getIsLeader = () => {
    QueryUserRole({
      userId: Number(LOGIN_USER_INFO.id),
    })
      .then(res => {
        // console.log('res.role', res.role);
        setIsLeader(res.role !== '普通人员');
      })
      .catch(e => {
        console.error('QueryIsLeader', e);
      });
  };

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
            item.GW = RYGW?.filter(x => x.ibm === item.GW)[0]?.note;
          });
          let prjBasic = p(res.xmjbxxRecord, false);
          prjBasic.ZBFS = CGFS?.filter(x => x.ibm === prjBasic.ZBFS)[0]?.note;
          prjBasic.XMLX = XMLX?.filter(x => x.ibm === prjBasic.XMLX)[0]?.note;
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
          console.log('🚀 ~ getPrjDtlData', obj);
          setPrjData(obj);
        }
      })
      .catch(e => {
        console.error('QueryProjectInfoAll', e);
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
        <TopConsole xmid={xmid} routes={routes} prjData={prjData} getPrjDtlData={getPrjDtlData} isLeader={isLeader}/>
        <MileStone
          xmid={xmid}
          prjData={prjData}
          getPrjDtlData={getPrjDtlData}
          setIsSpinning={setIsSpinning}
          isLeader={isLeader}
        />
        <div className="detail-row">
          <InfoDisplay prjData={prjData} routes={routes} xmid={xmid} isLeader={isLeader} />
          <div className="col-right">
            <PrjMember routes={routes} prjData={prjData} dictionary={dictionary} />
            <PrjMessage xmid={xmid} />
          </div>
        </div>
      </div>
    </Spin>
  );
}
